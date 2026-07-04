class OrchestratorAgentService < BaseAgentService
  def system_prompt
    <<~PROMPT
      Você é um analista sênior de sistemas de energia solar.
      Com base nos insights dos especialistas de geração, consumo
      e armazenamento, produza:

      1. Resumo executivo (2-3 frases)
      2. Recomendações práticas (até 3 itens)
      3. Justificativa técnica

      Responda em português brasileiro, de forma estruturada.
    PROMPT
  end

  def user_prompt
    agent_insights = @context[:insights] || {}
    <<~PROMPT
      Insight de Geração:
      #{agent_insights[:generation] || "Não disponível"}

      Insight de Consumo:
      #{agent_insights[:consumption] || "Não disponível"}

      Insight de Armazenamento:
      #{agent_insights[:storage] || "Não disponível"}

      Dados técnicos:
      - Geração: #{@context[:generation_kwh]} kWh
      - Consumo: #{@context[:consumption_kwh]} kWh
      - Saldo: #{@context[:balance_kwh]} kWh
      - Classificação: #{@context[:classification]}
      - Economia estimada: R$ #{@context[:savings_currency]}

      Produza a síntese final.
    PROMPT
  end

  def fallback_response
    classification_labels = {
      "EXCEDENTE"     => "Dia favorável para geração de energia solar.",
      "EQUILIBRIO"    => "Geração e consumo estão equilibrados.",
      "BAIXA_GERACAO" => "Geração abaixo do esperado devido às condições climáticas.",
      "RISCO_DEFICIT" => "Risco de déficit de energia. Consumo pode superar a geração.",
      "DEFICIT"       => "Déficit de energia previsto. Consumo superior à geração."
    }

    executive = classification_labels[@context[:classification]] || "Análise concluída."

    {
      executive_summary: executive,
      recommendations: [
        "Monitore a geração ao longo do dia para ajustar o consumo.",
        "Utilize equipamentos de alto consumo no período de pico solar.",
        @context[:has_battery] ? "Otimize os ciclos de carga e descarga da bateria." : nil
      ].compact,
      justification: "Análise baseada em dados climáticos do Open-Meteo e algoritmos de estimativa energética."
    }
  end

  def call
    result = super
    return result if result.is_a?(Hash)

    fallback_response
  end
end
