class ApplicationController < ActionController::Base
  skip_before_action :verify_authenticity_token

  rescue_from ActiveRecord::RecordNotFound, with: :not_found
  rescue_from ActiveRecord::RecordInvalid, with: :unprocessable
  rescue_from ActionController::ParameterMissing, with: :bad_request

  private

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
