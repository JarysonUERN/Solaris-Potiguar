class WeatherAgentService < BaseAgentService
  def required_keys
    %i[summary solar_conditions weather_risk confidence reasoning]
  end

  def system_prompt
    <<~PROMPT
      You are an expert in solar meteorology.

      Analyze ONLY weather information.

      Ignore batteries, consumption and financial aspects.

      Return ONLY valid JSON using this exact schema:
      {
        "summary": "string",
        "solar_conditions": "HIGH|MEDIUM|LOW",
        "weather_risk": "LOW|MODERATE|HIGH",
        "confidence": 0.0-1.0,
        "reasoning": ["string"]
      }
    PROMPT
  end

  def user_prompt
    { weather: @context }.to_json
  end

  def fallback_response
    irradiation = @context[:solar_irradiation].to_f
    cloud_cover = @context[:cloud_cover].to_f
    precip_prob = @context[:precipitation_probability].to_f

    risk = cloud_cover > 50 ? "MODERATE" : "LOW"
    conditions = classify_irradiance(irradiation)
    confidence = [(100 - cloud_cover) / 100.0, 0.5].max.round(2)

    {
      summary: risk == "LOW" ? "Favorable solar conditions expected." : "Moderate cloud cover may affect generation.",
      solar_conditions: conditions,
      weather_risk: risk,
      confidence: confidence,
      reasoning: build_reasoning(irradiation, cloud_cover, precip_prob)
    }
  end

  private

  def classify_irradiance(value)
    case value
    when 0...3 then "LOW"
    when 3...5 then "MEDIUM"
    else "HIGH"
    end
  end

  def build_reasoning(irradiation, cloud_cover, precip_prob)
    reasons = []
    if cloud_cover <= 30
      reasons << "Low cloud cover (#{cloud_cover.round(0)}%)"
    elsif cloud_cover <= 60
      reasons << "Moderate cloud cover (#{cloud_cover.round(0)}%)"
    else
      reasons << "High cloud cover (#{cloud_cover.round(0)}%)"
    end
    reasons << "Low probability of rain (#{precip_prob.round(0)}%)" if precip_prob <= 20
    reasons << "High expected irradiation (#{irradiation.round(1)} kWh/m²)" if irradiation >= 5
    reasons << "Moderate expected irradiation (#{irradiation.round(1)} kWh/m²)" if irradiation >= 3 && irradiation < 5
    reasons
  end
end
