class AnalysisSerializer
  def initialize(analysis)
    @analysis = analysis
  end

  def serialize
    raw = @analysis.raw_data || {}

    {
      id: @analysis.id,
      property_id: @analysis.property_id,
      date: @analysis.analysis_date,
      climate: {
        solar_irradiation: @analysis.solar_irradiation&.to_f,
        cloud_cover: @analysis.cloud_cover&.to_f,
        temperature: @analysis.temperature&.to_f
      },
      energy: {
        generation_kwh: @analysis.estimated_generation_kwh&.to_f,
        consumption_kwh: @analysis.estimated_consumption_kwh&.to_f,
        balance_kwh: @analysis.balance_kwh&.to_f,
        classification: @analysis.classification
      },
      battery: {
        charge_kwh: @analysis.battery_charge_kwh&.to_f,
        status: @analysis.battery_status
      },
      insights: {
        executive_summary: @analysis.executive_summary,
        recommendations: @analysis.recommendations
      },
      raw_data: {
        insights: raw.dig("insights") || raw.dig(:insights) || {}
      },
      savings: {
        kwh: @analysis.estimated_savings_kwh&.to_f,
        currency: @analysis.estimated_savings_currency&.to_f,
        currency_unit: @analysis.currency
      },
      created_at: @analysis.created_at,
      updated_at: @analysis.updated_at
    }
  end
end
