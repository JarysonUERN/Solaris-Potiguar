module SolarisPotiguar
  class OnboardingController < ApplicationController
    before_action :authenticate_request

    def create
      property = current_user.properties.new(onboarding_params)

      if property.save
        render json: {
          property_id: property.id,
          message: "Property configured successfully."
        }, status: :created
      else
        render json: { errors: property.errors.full_messages }, status: :unprocessable_entity
      end
    end

    private

    def onboarding_params
      params.permit(
        :farm_name, :city, :installed_power_kwp,
        :has_battery, :battery_capacity_kwh,
        :average_monthly_consumption_kwh,
        :operation_type, :peak_consumption_period,
        :flexible_operation, :operation_description,
        main_equipments: []
      ).tap do |p|
        if p[:average_monthly_consumption_kwh].present?
          p[:average_daily_consumption_kwh] = p.delete(:average_monthly_consumption_kwh).to_f / 30.0
        end
      end
    end
  end
end
