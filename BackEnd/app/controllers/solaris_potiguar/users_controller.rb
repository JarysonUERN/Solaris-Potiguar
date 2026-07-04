module SolarisPotiguar
  class UsersController < ApplicationController
    before_action :authenticate_request

    def show
      render json: serialize_user(current_user)
    end

    def update
      if current_user.update(update_params)
        render json: {
          message: "User updated successfully.",
          user: serialize_user(current_user)
        }
      else
        render json: { errors: current_user.errors.full_messages }, status: :unprocessable_entity
      end
    end

    private

    def update_params
      params.permit(:full_name, :phone, :has_whatsapp)
    end

    def serialize_user(user)
      {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        has_whatsapp: user.has_whatsapp,
        cpf: user.cpf
      }
    end
  end
end
