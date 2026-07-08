class ConsumptionAgentService < BaseAgentService
  def required_keys
    %i[consumption_profile flexibility recommended_operation_window reasoning confidence]
  end

  def system_prompt
    <<~PROMPT
      You are an agricultural energy consultant.

      Analyze the operational profile.

      Recommend the best period to perform energy-intensive activities.

      Do not analyze weather.

      Return ONLY valid JSON using this exact schema:
      {
        "consumption_profile": "IRRIGATION|POULTRY|COMMERCIAL|RESIDENTIAL|GENERAL",
        "flexibility": "HIGH|MEDIUM|LOW",
        "recommended_operation_window": "string",
        "reasoning": ["string"],
        "confidence": 0.0-1.0
      }
    PROMPT
  end

  def user_prompt
    {
      property: @context[:property],
      generation: { estimated_peak_period: @context.dig(:generation, :estimated_peak_period) }
    }.to_json
  end

  def fallback_response
    profile = normalize_profile(@context.dig(:property, :operation_type) || "other")
    flexibility = @context.dig(:property, :flexible_operation) ? "MEDIUM" : "LOW"
    peak = @context.dig(:generation, :estimated_peak_period) || "10:00 - 14:00"

    reasons = []
    reasons << "Irrigation schedule can be adjusted" if @context.dig(:property, :operation_type) == "irrigacao"
    reasons << "Energy demand is concentrated in equipment"
    reasons << "Operational flexibility available" if @context.dig(:property, :flexible_operation)
    reasons << "Fixed operation schedule" unless @context.dig(:property, :flexible_operation)

    {
      consumption_profile: profile,
      flexibility: flexibility,
      recommended_operation_window: peak,
      reasoning: reasons,
      confidence: flexibility == "MEDIUM" ? 0.82 : 0.75
    }
  end

  private

  def normalize_profile(type)
    mapping = {
      "irrigacao" => "IRRIGATION",
      "avicultura" => "POULTRY",
      "comercio" => "COMMERCIAL",
      "residencial" => "RESIDENTIAL",
      "agroindustria" => "AGRO_INDUSTRY"
    }
    mapping[type] || "GENERAL"
  end
end
