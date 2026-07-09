class ClimateService
  OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast".freeze

  def initialize(latitude, longitude)
    @latitude = latitude
    @longitude = longitude
  end

  def fetch
    response = HTTParty.get(OPEN_METEO_URL, query: {
      latitude: @latitude,
      longitude: @longitude,
      daily: "shortwave_radiation_sum,cloud_cover_mean,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,wind_direction_10m_dominant,precipitation_sum,rain_sum,showers_sum,snowfall_sum,uv_index_max",
      hourly: "relative_humidity_2m",
      timezone: "America/Sao_Paulo",
      forecast_days: 1
    }, timeout: 30)

    raise "Open-Meteo API error: #{response.code}" unless response.success?

    parse(response.parsed_response)
  rescue StandardError => e
    Rails.logger.warn "[ClimateService] Open-Meteo error: #{e.class} - #{e.message} (lat=#{@latitude}, lng=#{@longitude})"
    today = Date.today.iso8601
    {
      date: today,
      solar_irradiation: 0,
      cloud_cover: 0,
      temperature_max: 0,
      temperature_min: 0,
      temperature: 0,
      precipitation_probability: 0,
      solar_irradiance: "LOW",
      unit: "kWh/m²",
      wind_speed: 0,
      wind_direction: 0,
      humidity: 0,
      precipitation: 0,
      rain: 0,
      showers: 0,
      snowfall: 0,
      uv_index: 0
    }
  end

  private

  def parse(data)
    daily = data.dig("daily") || {}
    hourly = data.dig("hourly") || {}
    irradiation = daily.dig("shortwave_radiation_sum", 0)&.to_f || 0

    humidity_values = hourly.dig("relative_humidity_2m") || []
    max_humidity = humidity_values.any? ? humidity_values.map(&:to_f).max : 0

    {
      date: daily.dig("time", 0) || Date.today.iso8601,
      solar_irradiation: irradiation,
      cloud_cover:       daily.dig("cloud_cover_mean", 0)&.to_f || 0,
      temperature_max:   daily.dig("temperature_2m_max", 0)&.to_f || 0,
      temperature_min:   daily.dig("temperature_2m_min", 0)&.to_f || 0,
      temperature:       daily.dig("temperature_2m_max", 0)&.to_f || 0,
      precipitation_probability: daily.dig("precipitation_probability_max", 0)&.to_f || 0,
      solar_irradiance:  classify_irradiance(irradiation),
      unit: "kWh/m²",
      wind_speed:        daily.dig("wind_speed_10m_max", 0)&.to_f || 0,
      wind_direction:    daily.dig("wind_direction_10m_dominant", 0)&.to_f || 0,
      humidity:          max_humidity,
      precipitation:     daily.dig("precipitation_sum", 0)&.to_f || 0,
      rain:              daily.dig("rain_sum", 0)&.to_f || 0,
      showers:           daily.dig("showers_sum", 0)&.to_f || 0,
      snowfall:          daily.dig("snowfall_sum", 0)&.to_f || 0,
      uv_index:          daily.dig("uv_index_max", 0)&.to_f || 0
    }
  end

  def classify_irradiance(value)
    case value
    when 0...3 then "LOW"
    when 3...5 then "MEDIUM"
    else "HIGH"
    end
  end
end
