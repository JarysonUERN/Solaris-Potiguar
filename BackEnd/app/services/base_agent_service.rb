class BaseAgentService
  FIREWORKS_API_URL = "https://api.fireworks.ai/inference/v1/chat/completions".freeze
  DEFAULT_MODEL = "accounts/fireworks/models/gpt-oss-120b".freeze

  def initialize(context = {})
    @context = context
  end

  def system_prompt
    raise NotImplementedError
  end

  def user_prompt
    raise NotImplementedError
  end

  def required_keys
    []
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
      }.to_json,
      timeout: 60
    )

    if response.success?
      content = response.parsed_response.dig("choices", 0, "message", "content") || ""
      parsed = parse_json_response(content)
      return parsed if parsed.present? && keys_present?(parsed)
      Rails.logger.warn "[#{self.class.name}] AI response missing required keys, using fallback"
    else
      Rails.logger.warn "[#{self.class.name}] Fireworks AI API error: #{response.code} #{response.body&.slice(0, 200)}"
    end
    fallback_response
  rescue StandardError => e
    Rails.logger.warn "[#{self.class.name}] Fireworks AI error: #{e.class} - #{e.message}"
    fallback_response
  end

  private

  def keys_present?(hash)
    return true if required_keys.empty?
    required_keys.all? { |key| hash.key?(key) }
  end

  def parse_json_response(content)
    json_str = content.strip
    json_str = json_str.gsub(/\A```(?:json)?\s*/, "").gsub(/\s*```\z/, "")
    JSON.parse(json_str).deep_symbolize_keys
  rescue JSON::ParserError
    Rails.logger.warn "[#{self.class.name}] Failed to parse JSON: #{content.truncate(200)}"
    nil
  end

  def fireworks_api_key
    ENV.fetch("FIREWORKS_API_KEY", "")
  end

  def fallback_response
    {}
  end
end
