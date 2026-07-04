class ConsumptionAgentService < BaseAgentService
  def system_prompt
    <<~PROMPT
      Você é um especialista em eficiência energética.
      Analise o padrão de consumo versus geração e sugira
      melhores horários para uso de equipamentos.
      Responda em português brasileiro, em até 3 frases.
    PROMPT
  end

  def user_prompt
    "Dados de consumo:\n" \
    "- Consumo médio diário: #{@context[:consumption_kwh]} kWh\n" \
    "- Geração estimada: #{@context[:generation_kwh]} kWh\n" \
    "- Saldo: #{@context[:balance_kwh]} kWh\n" \
    "- Classificação: #{@context[:classification]}\n\n" \
    "Gere um insight sobre o consumo e recomende horários ideais para uso de energia."
  end

  def fallback_response
    if @context[:balance_kwh] && @context[:balance_kwh] > 0
      "O saldo positivo indica que a geração cobre o consumo. Aproveite o período ensolarado para usar equipamentos de maior potência."
    elsif @context[:balance_kwh] && @context[:balance_kwh] < 0
      "O consumo supera a geração. Considere deslocar o uso de equipamentos de alto consumo para o período com maior incidência solar."
    else
      "Geração e consumo estão equilibrados. Mantenha o padrão atual de uso."
    end
  end
end
