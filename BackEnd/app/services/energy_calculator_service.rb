class EnergyCalculatorService
  SYSTEM_EFFICIENCY = 0.80

  def initialize(property, climate_data)
    @property = property
    @climate = climate_data
  end

  def calculate
    generation = estimated_generation
    consumption = estimated_consumption
    balance = generation - consumption
    savings = calculate_savings(balance)

    {
      generation_kwh: generation.round(3),
      consumption_kwh: consumption.round(3),
      balance_kwh: balance.round(3),
      battery_charge_kwh: battery_charge(balance).round(3),
      battery_status: battery_status(balance),
      savings_kwh: savings[:kwh].round(3),
      savings_currency: savings[:currency].round(2),
      currency: "BRL"
    }
  end

  private

  def estimated_generation
    irradiation = @climate[:solar_irradiation] || 0
    capacity = @property.installed_capacity_kwp
    capacity * irradiation * SYSTEM_EFFICIENCY
  end

  def estimated_consumption
    @property.average_daily_consumption_kwh
  end

  def calculate_savings(balance)
    surplus = [balance, 0].max
    rate_per_kwh = 0.80
    {
      kwh: surplus,
      currency: surplus * rate_per_kwh
    }
  end

  def battery_charge(balance)
    return 0 unless @property.has_battery?

    if balance > 0
      [balance, @property.battery_capacity_kwh].min
    else
      [@property.battery_capacity_kwh + balance, 0].max
    end
  end

  def battery_status(balance)
    return "not_applicable" unless @property.has_battery?

    if balance > 0 && battery_charge(balance) >= @property.battery_capacity_kwh
      "full"
    elsif balance > 0
      "charging"
    elsif balance < 0 && battery_charge(balance) > 0
      "discharging"
    else
      "idle"
    end
  end
end
