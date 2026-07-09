class OrchestratorAgentService < BaseAgentService
  def required_keys
    %i[executive_summary recommendation priority confidence]
  end

  def system_prompt
    lang = @context[:lang] || "pt"
    lang_instruction = lang == "en" ? "Output in English." : "Output in Brazilian Portuguese (pt-BR)."

    <<~PROMPT
      You are the Solaris Potiguar Orchestrator.

      Your job is NOT to analyze weather.

      Your job is NOT to analyze batteries.

      Your job is to combine specialist opinions.

      Produce one practical recommendation.

      #{lang_instruction}

      Return ONLY valid JSON using this exact schema:
      {
        "executive_summary": "string",
        "recommendation": "string",
        "expected_benefit": "string",
        "priority": "HIGH|MEDIUM|LOW",
        "confidence": 0.0-1.0
      }
    PROMPT
  end

  def user_prompt
    {
      weather_agent: @context[:weather_agent],
      consumption_agent: @context[:consumption_agent],
      storage_agent: @context[:storage_agent],
      original_context: @context[:original_context]
    }.to_json
  end

  def fallback_response
    weather = @context[:weather_agent] || {}
    consumption = @context[:consumption_agent] || {}
    storage = @context[:storage_agent] || {}
    ctx = @context[:original_context] || {}
    property = ctx[:property] || {}
    generation = ctx[:generation] || {}
    weather_data = ctx[:weather] || {}

    gen_kwh = generation[:estimated_generation_kwh] || 0
    peak = generation[:estimated_peak_period] || "10:00 - 14:00"
    farm = property[:farm_name] || "propriedade"

    conditions = weather_data[:solar_irradiance] || "MEDIUM"
    profile = consumption[:consumption_profile] || "GENERAL"
    has_battery = storage[:battery_available] || false

    base_recommendation = if profile == "IRRIGATION"
      "Schedule irrigation between #{peak} to align energy-intensive activities with photovoltaic generation."
    else
      "Prioritize equipment operation during #{peak} for better self-consumption."
    end

    if has_battery
      base_recommendation += " Use the battery to store surplus for evening demand."
    end

    {
      executive_summary: "#{farm}: #{conditions} solar conditions. Estimated generation of #{gen_kwh.round(1)} kWh today.",
      recommendation: base_recommendation,
      expected_benefit: "Higher self-consumption of locally generated energy.",
      priority: conditions == "HIGH" ? "HIGH" : "MEDIUM",
      confidence: calculate_confidence(weather, consumption, storage)
    }
  end

  private

  def calculate_confidence(weather, consumption, storage)
    scores = [
      weather[:confidence] || 0.7,
      consumption[:confidence] || 0.7,
      storage[:confidence] || 0.7
    ]
    (scores.sum / scores.size).round(2)
  end
end
