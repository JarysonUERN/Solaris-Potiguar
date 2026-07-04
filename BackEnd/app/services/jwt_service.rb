class JwtService
  SECRET = Rails.application.secret_key_base
  ALGORITHM = "HS256"
  EXPIRATION = 24.hours

  def self.encode(payload)
    payload = payload.dup
    payload[:exp] = EXPIRATION.from_now.to_i
    JWT.encode(payload, SECRET, ALGORITHM)
  end

  def self.decode(token)
    decoded = JWT.decode(token, SECRET, true, algorithm: ALGORITHM)
    decoded.first
  rescue JWT::DecodeError, JWT::ExpiredSignature
    nil
  end
end
