class StorageAgentService < BaseAgentService
  def required_keys
    %i[battery_available battery_capacity battery_strategy reasoning confidence]
  end

  def system_prompt
    <<~PROMPT
      You are a battery storage specialist.

      Consider ONLY installed battery capacity.

      Never assume battery charge percentage.

      Never invent sensor data.

      Return ONLY valid JSON using this exact schema:
      {
        "battery_available": true|false,
        "battery_capacity": 0.0,
        "battery_strategy": "CHARGE|OPTIONAL|NOT_APPLICABLE",
        "reasoning": ["string"],
        "confidence": 0.0-1.0
      }
    PROMPT
  end

  def user_prompt
    {
      battery_capacity_kwh: @context[:battery_capacity_kwh],
      estimated_generation_kwh: @context[:estimated_generation_kwh]
    }.to_json
  end

  def fallback_response
    capacity = @context[:battery_capacity_kwh].to_f
    generation = @context[:estimated_generation_kwh].to_f

    if capacity <= 0
      return {
        battery_available: false,
        battery_capacity: 0,
        battery_strategy: "NOT_APPLICABLE",
        reasoning: ["No battery installed"],
        confidence: 1.0
      }
    end

    strategy = generation > capacity ? "CHARGE" : "OPTIONAL"
    confidence = generation > 0 ? 0.81 : 0.70

    reasons = []
    reasons << "Battery exists (#{capacity} kWh)"
    if generation > capacity
      reasons << "Generation forecast (#{generation.round(1)} kWh) exceeds battery capacity"
      reasons << "Battery can absorb surplus"
    else
      reasons << "Generation forecast (#{generation.round(1)} kWh) is moderate"
    end

    {
      battery_available: true,
      battery_capacity: capacity,
      battery_strategy: strategy,
      reasoning: reasons,
      confidence: confidence
    }
  end
end
