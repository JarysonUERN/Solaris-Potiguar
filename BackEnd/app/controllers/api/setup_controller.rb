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
        :location, :latitude, :longitude,
        :installed_capacity_kwp, :has_battery, :battery_capacity_kwh,
        :average_daily_consumption_kwh, :business_type
      )
    end

    def serialize_property(property)
      {
        id: property.id,
        location: property.location,
        installed_capacity_kwp: property.installed_capacity_kwp.to_f,
        has_battery: property.has_battery,
        battery_capacity_kwh: property.battery_capacity_kwh.to_f,
        average_daily_consumption_kwh: property.average_daily_consumption_kwh.to_f,
        business_type: property.business_type,
        latitude: property.latitude&.to_f,
        longitude: property.longitude&.to_f,
        created_at: property.created_at,
        updated_at: property.updated_at
      }
    end
  end
end
