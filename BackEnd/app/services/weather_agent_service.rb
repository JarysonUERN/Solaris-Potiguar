class WeatherAgentService < BaseAgentService
  def required_keys
    %i[summary solar_conditions weather_risk confidence reasoning]
  end

  def system_prompt
    <<~PROMPT
      You are an expert in solar meteorology.

      Analyze ONLY weather information based on real Open-Meteo data.

      Consider ALL parameters provided: temperature, cloud cover, solar irradiation,
      wind speed, wind direction, humidity, precipitation, rain, showers, snowfall,
      UV index, and precipitation probability.

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
    wind_speed  = @context[:wind_speed].to_f
    humidity    = @context[:humidity].to_f
    uv_index    = @context[:uv_index].to_f

    risk = cloud_cover > 50 ? "MODERATE" : "LOW"
    risk = "HIGH" if precip_prob > 60 || wind_speed > 30
    conditions = classify_irradiance(irradiation)
    confidence = [(100 - cloud_cover) / 100.0, 0.5].max.round(2)

    {
      summary: risk == "LOW" ? "Favorable solar conditions expected." : "Moderate to high weather risk may affect generation.",
      solar_conditions: conditions,
      weather_risk: risk,
      confidence: confidence,
      reasoning: build_reasoning(irradiation, cloud_cover, precip_prob, wind_speed, humidity, uv_index)
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

  def build_reasoning(irradiation, cloud_cover, precip_prob, wind_speed, humidity, uv_index)
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
    reasons << "Wind speed of #{wind_speed.round(1)} km/h" if wind_speed > 0
    reasons << "UV index #{uv_index.round(1)}" if uv_index > 0
    reasons << "Relative humidity at #{humidity.round(0)}%" if humidity > 0
    reasons
  end
end
