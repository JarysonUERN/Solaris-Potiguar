class GenerationAgentService < BaseAgentService
  def system_prompt
    <<~PROMPT
      Você é um especialista em energia solar fotovoltaica.
      Analise os dados de geração e clima e produza um insight
      conciso sobre a performance esperada do sistema.
      Responda em português brasileiro, em até 3 frases.
    PROMPT
  end

  def user_prompt
    "Dados do sistema:\n" \
    "- Capacidade instalada: #{@context[:installed_power_kwp]} kWp\n" \
    "- Geração estimada: #{@context[:generation_kwh]} kWh\n" \
    "- Irradiação solar: #{@context[:solar_irradiation]} kWh/m²\n" \
    "- Nebulosidade: #{@context[:cloud_cover]}%\n" \
    "- Temperatura: #{@context[:temperature]}°C\n" \
    "- Classificação: #{@context[:classification]}\n\n" \
    "Gere um insight sobre a geração de energia para hoje."
  end

  def fallback_response
    if @context[:classification] == "EXCEDENTE"
      "A geração esperada é alta devido à boa irradiação solar e baixa nebulosidade."
    elsif @context[:classification] == "DEFICIT" || @context[:classification] == "RISCO_DEFICIT"
      "A geração pode ser insuficiente devido à baixa irradiação ou alta nebulosidade."
    else
      "A geração está dentro do esperado para as condições climáticas atuais."
    end
  end
end
