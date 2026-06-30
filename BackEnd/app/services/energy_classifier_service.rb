class EnergyClassifierService
  THRESHOLDS = {
    high_generation:  0.20,
    normal_generation: -0.10,
    low_generation:    -0.30,
    deficit_risk:      -0.50
  }.freeze

  def initialize(property, generation_kwh, consumption_kwh, balance_kwh)
    @property = property
    @generation = generation_kwh
    @consumption = consumption_kwh
    @balance = balance_kwh
  end

  def classify
    ratio = @consumption > 0 ? @balance.to_f / @consumption : 0

    if ratio >= THRESHOLDS[:high_generation]
      { code: "EXCEDENTE", label: "Excedente", severity: "positive", ratio: ratio }
    elsif ratio >= THRESHOLDS[:normal_generation]
      { code: "EQUILIBRIO", label: "Equilíbrio", severity: "neutral", ratio: ratio }
    elsif ratio >= THRESHOLDS[:low_generation]
      { code: "BAIXA_GERACAO", label: "Baixa Geração", severity: "warning", ratio: ratio }
    elsif ratio >= THRESHOLDS[:deficit_risk]
      { code: "RISCO_DEFICIT", label: "Risco de Déficit", severity: "alert", ratio: ratio }
    else
      { code: "DEFICIT", label: "Déficit", severity: "critical", ratio: ratio }
    end
  end
end
