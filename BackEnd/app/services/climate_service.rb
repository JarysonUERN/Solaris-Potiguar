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
      daily: "shortwave_radiation_sum,cloud_cover_mean,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
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
      unit: "kWh/m²"
    }
  end

  private

  def parse(data)
    daily = data.dig("daily") || {}
    irradiation = daily.dig("shortwave_radiation_sum", 0)&.to_f || 0

    {
      date: daily.dig("time", 0) || Date.today.iso8601,
      solar_irradiation: irradiation,
      cloud_cover:       daily.dig("cloud_cover_mean", 0)&.to_f || 0,
      temperature_max:   daily.dig("temperature_2m_max", 0)&.to_f || 0,
      temperature_min:   daily.dig("temperature_2m_min", 0)&.to_f || 0,
      temperature:       daily.dig("temperature_2m_max", 0)&.to_f || 0,
      precipitation_probability: daily.dig("precipitation_probability_max", 0)&.to_f || 0,
      solar_irradiance:  classify_irradiance(irradiation),
      unit: "kWh/m²"
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
