class SimplificationAgentService < BaseAgentService
  MODEL = "accounts/fireworks/models/gemma-7b-it"

  def required_keys
    %i[simplified_text]
  end

  def system_prompt
    lang = @context[:lang] || "pt"
    lang_instruction = if lang == "en"
      "Output ONLY in English. Use simple everyday English words a farmer would understand. Avoid technical jargon like 'photovoltaic', 'self-consumption', 'irradiance'."
    else
      "Output ONLY in Brazilian Portuguese (pt-BR). Use simple everyday Portuguese words a farmer would understand. Avoid technical jargon like 'fotovoltaico', 'autoconsumo', 'irradiância'."
    end

    <<~PROMPT
      You are a language simplification assistant for Solaris Potiguar, an agricultural solar energy platform.

      Your ONLY job is to rewrite technical solar energy recommendations in extremely simple, clear language.

      Rules:
      - Output MUST be at most 2 short sentences.
      - Use only everyday words a farmer would understand.
      - No technical jargon at all.
      - Be direct and concrete — say what to do and why.
      - Friendly tone but extremely concise.

      #{lang_instruction}

      Return ONLY valid JSON using this exact schema:
      {
        "simplified_text": "string"
      }
    PROMPT
  end

  def user_prompt
    {
      orchestrator_output: {
        executive_summary: @context[:executive_summary],
        recommendation: @context[:recommendation],
        expected_benefit: @context[:expected_benefit],
        priority: @context[:priority],
        confidence: @context[:confidence]
      }
    }.to_json
  end

  def fallback_response
    summary = @context[:executive_summary] || ""
    recommendation = @context[:recommendation] || ""
    expected_benefit = @context[:expected_benefit] || ""

    simplified = [summary, recommendation, expected_benefit].reject(&:empty?).join(" ")
    {
      simplified_text: simplified
    }
  end
end
