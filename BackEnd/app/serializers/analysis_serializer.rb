class AnalysisSerializer
  def initialize(analysis, shared_context = nil, agents = nil, recommendation = nil, simplified = nil)
    @analysis = analysis
    @shared_context = shared_context
    @agents = agents
    @recommendation = recommendation
    @simplified = simplified
  end

  def serialize
    raw = @analysis.raw_data || {}
    agent_data = @agents || raw.dig("agents") || raw.dig(:agents) || {}
    reco = @recommendation || raw.dig("orchestrator") || raw.dig(:orchestrator) || {}

    base = {
      id: @analysis.id,
      property_id: @analysis.property_id,
      analysis_date: @analysis.analysis_date.iso8601,
      created_at: @analysis.created_at,
      updated_at: @analysis.updated_at,
      weather: @shared_context&.dig(:weather) || build_weather_from_raw(raw),
      generation: @shared_context&.dig(:generation) || {
        estimated_generation_kwh: @analysis.estimated_generation_kwh&.to_f,
        estimated_peak_period: "10:00 - 14:00"
      },
      energy: {
        generation_kwh: @analysis.estimated_generation_kwh&.to_f,
        consumption_kwh: @analysis.estimated_consumption_kwh&.to_f,
        balance_kwh: @analysis.balance_kwh&.to_f
      },
      battery: {
        charge_kwh: @analysis.battery_charge_kwh&.to_f,
        status: @analysis.battery_status
      },
      savings: {
        kwh: @analysis.estimated_savings_kwh&.to_f,
        currency: @analysis.estimated_savings_currency&.to_f,
        currency_unit: @analysis.currency
      },
      agents: {
        weather: agent_data.dig("weather") || agent_data.dig(:weather) || {},
        consumption: agent_data.dig("consumption") || agent_data.dig(:consumption) || {},
        storage: agent_data.dig("storage") || agent_data.dig(:storage) || {}
      },
      recommendation: {
        summary: reco.dig("executive_summary") || reco.dig(:executive_summary) || @analysis.executive_summary,
        recommendation: reco.dig("recommendation") || reco.dig(:recommendation) || @analysis.recommendations,
        priority: reco.dig("priority") || reco.dig(:priority) || "MEDIUM",
        confidence: reco.dig("confidence") || reco.dig(:confidence) || 0.7
      }
    }

    base[:climate] = base[:weather] if @shared_context.nil?
    base[:insights] = {
      executive_summary: base[:recommendation][:summary],
      recommendations: base[:recommendation][:recommendation]
    }
    base[:raw_data] = { insights: extract_legacy_insights(raw, agent_data) }

    simplified_data = @simplified || raw.dig("simplified") || raw.dig(:simplified) || {}
    base[:simplified] = {
      simplified_text: simplified_data.dig("simplified_text") || simplified_data.dig(:simplified_text) || ""
    }

    base
  end

  private

  def build_weather_from_raw(raw)
    climate = raw.dig("climate") || raw.dig(:climate) || {}
    temp = climate.dig("temperature_max") || climate.dig(:temperature_max) || climate.dig("temperature") || climate.dig(:temperature) || @analysis.temperature&.to_f
    {
      date: @analysis.analysis_date.iso8601,
      temperature_max: temp,
      temperature_min: climate.dig("temperature_min") || climate.dig(:temperature_min) || temp,
      cloud_cover: climate.dig("cloud_cover") || climate.dig(:cloud_cover) || @analysis.cloud_cover&.to_f,
      precipitation_probability: climate.dig("precipitation_probability") || climate.dig(:precipitation_probability) || 0,
      solar_irradiance: climate.dig("solar_irradiance") || climate.dig(:solar_irradiance) || "MEDIUM",
      solar_irradiation: climate.dig("solar_irradiation") || climate.dig(:solar_irradiation) || @analysis.solar_irradiation&.to_f
    }
  end

  def extract_legacy_insights(raw, agent_data)
    insights = raw.dig("insights") || raw.dig(:insights) || {}
    {
      generation: insights.dig("generation") || insights.dig(:generation) || agent_data.dig("weather", "summary") || "",
      consumption: insights.dig("consumption") || insights.dig(:consumption) || agent_data.dig("consumption", "consumption_profile") || "",
      storage: insights.dig("storage") || insights.dig(:storage) || agent_data.dig("storage", "battery_strategy") || ""
    }
  end
end
