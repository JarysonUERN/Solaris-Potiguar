class StorageAgentService < BaseAgentService
  def system_prompt
    <<~PROMPT
      Você é um especialista em sistemas de armazenamento de energia.
      Analise o comportamento da bateria e forneça recomendações
      sobre carga e descarga.
      Responda em português brasileiro, em até 3 frases.
    PROMPT
  end

  def user_prompt
    "Dados da bateria:\n" \
    "- Possui bateria: #{@context[:has_battery]}\n" \
    "- Capacidade da bateria: #{@context[:battery_capacity_kwh]} kWh\n" \
    "- Carga estimada: #{@context[:battery_charge_kwh]} kWh\n" \
    "- Status: #{@context[:battery_status]}\n" \
    "- Excedente: #{@context[:balance_kwh]} kWh\n\n" \
    "Gere um insight sobre o uso da bateria."
  end

  def fallback_response
    return "Sistema sem bateria. Nenhuma análise de armazenamento aplicável." unless @context[:has_battery]

    case @context[:battery_status]
    when "full"
      "A bateria atingirá carga máxima. Considere redirecionar o excedente para outros usos."
    when "charging"
      "A bateria está acumulando o excedente de geração, armazenando #{@context[:battery_charge_kwh]} kWh."
    when "discharging"
      "A bateria está fornecendo energia para suprir o déficit de geração."
    else
      "A bateria está ociosa. Monitore as condições para otimizar o ciclo de carga."
    end
  end
end
