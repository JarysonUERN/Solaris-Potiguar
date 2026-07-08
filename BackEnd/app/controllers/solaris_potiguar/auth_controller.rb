module SolarisPotiguar
  class AuthController < ApplicationController
    def login
      user = User.find_by(email: params[:email]&.downcase&.strip)

      if user&.authenticate(params[:password])
        token = JwtService.encode(user_id: user.id)
        property = user.properties.first
        render json: {
          token: token,
          email: user.email,
          full_name: user.full_name,
          property_id: property&.id
        }
      else
        render json: { error: "Email ou senha inválidos" }, status: :unauthorized
      end
    end

    def register
      user = User.new(register_params)

      if user.save
        render json: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          phone: user.phone,
          has_whatsapp: user.has_whatsapp,
          cpf: user.cpf
        }, status: :created
      else
        render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
      end
    end

    private

    def register_params
      params.permit(:full_name, :email, :password, :phone, :has_whatsapp, :cpf)
    end
  end
end
