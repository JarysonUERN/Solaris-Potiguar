class BaseAgentService
  FIREWORKS_API_URL = "https://api.fireworks.ai/inference/v1/chat/completions".freeze
  DEFAULT_MODEL = "accounts/fireworks/models/llama-v3p1-8b-instruct".freeze

  def initialize(context = {})
    @context = context
  end

  def system_prompt
    raise NotImplementedError
  end

  def user_prompt
    raise NotImplementedError
  end

  def call
    response = HTTParty.post(
      FIREWORKS_API_URL,
      headers: {
        "Authorization" => "Bearer #{fireworks_api_key}",
        "Content-Type" => "application/json"
      },
      body: {
        model: DEFAULT_MODEL,
        messages: [
          { role: "system", content: system_prompt },
          { role: "user", content: user_prompt }
        ],
        temperature: 0.3,
        max_tokens: 500
      }.to_json
    )

    if response.success?
      response.parsed_response.dig("choices", 0, "message", "content") || ""
    else
      fallback_response
    end
  end

  private

  def fireworks_api_key
    ENV.fetch("FIREWORKS_API_KEY", "")
  end

  def fallback_response
    ""
  end
end
