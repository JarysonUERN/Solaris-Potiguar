module Api
  class SetupController < ApplicationController
    def create
      property = Property.new(property_params)

      if property.save
        render json: { property_id: property.id, message: "Propriedade cadastrada com sucesso" }, status: :created
      else
        render json: { errors: property.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def show
      property = Property.find(params[:id])
      render json: { property: serialize_property(property) }
    end

    def update
      property = Property.find(params[:id])
      if property.update(property_params)
        render json: { property: serialize_property(property), message: "Propriedade atualizada" }
      else
        render json: { errors: property.errors.full_messages }, status: :unprocessable_entity
      end
    end

    private

    def property_params
      params.require(:property).permit(
        :farm_name, :city, :latitude, :longitude,
        :installed_power_kwp, :has_battery, :battery_capacity_kwh,
        :average_daily_consumption_kwh, :operation_type,
        :peak_consumption_period, :flexible_operation,
        :operation_description,
        main_equipments: []
      )
    end

    def serialize_property(property)
      {
        id: property.id,
        farm_name: property.farm_name,
        city: property.city,
        installed_power_kwp: property.installed_power_kwp.to_f,
        has_battery: property.has_battery,
        battery_capacity_kwh: property.battery_capacity_kwh.to_f,
        average_daily_consumption_kwh: property.average_daily_consumption_kwh.to_f,
        operation_type: property.operation_type,
        peak_consumption_period: property.peak_consumption_period,
        flexible_operation: property.flexible_operation,
        main_equipments: property.main_equipments,
        operation_description: property.operation_description,
        latitude: property.latitude&.to_f,
        longitude: property.longitude&.to_f,
        created_at: property.created_at,
        updated_at: property.updated_at
      }
    end
  end
end
