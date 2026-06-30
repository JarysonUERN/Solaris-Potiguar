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
      daily: "shortwave_radiation_sum,cloud_cover_mean,temperature_2m_max,temperature_2m_min",
      timezone: "America/Sao_Paulo",
      forecast_days: 1
    })

    raise "Open-Meteo API error: #{response.code}" unless response.success?

    parse(response.parsed_response)
  end

  private

  def parse(data)
    daily = data.dig("daily") || {}
    {
      solar_irradiation: daily.dig("shortwave_radiation_sum", 0)&.to_f || 0,
      cloud_cover:       daily.dig("cloud_cover_mean", 0)&.to_f || 0,
      temperature_max:   daily.dig("temperature_2m_max", 0)&.to_f || 0,
      temperature_min:   daily.dig("temperature_2m_min", 0)&.to_f || 0,
      temperature:       daily.dig("temperature_2m_max", 0)&.to_f || 0,
      unit: "kWh/m²"
    }
  end
end
