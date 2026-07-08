class ApplicationController < ActionController::Base
  skip_before_action :verify_authenticity_token

  rescue_from ActiveRecord::RecordNotFound, with: :not_found
  rescue_from ActiveRecord::RecordInvalid, with: :unprocessable
  rescue_from ActionController::ParameterMissing, with: :bad_request

  private

  def authenticate_request
    header = request.headers["Authorization"]
    token = header&.split(" ")&.last
    decoded = JwtService.decode(token)

    if decoded
      @current_user = User.find_by(id: decoded["user_id"])
    end

    unless @current_user
      render json: { error: "Não autorizado" }, status: :unauthorized
      return
    end
  end

  def current_user
    @current_user
  end

  def not_found
    render json: { error: "Recurso não encontrado" }, status: :not_found
  end

  def unprocessable(exception)
    render json: { errors: exception.record.errors.full_messages }, status: :unprocessable_entity
  end

  def bad_request(exception)
    render json: { error: exception.message }, status: :bad_request
  end
end
