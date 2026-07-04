module Api
  class ClimateController < ApplicationController
    def fetch
      property = Property.find(params[:property_id])

      unless property.latitude && property.longitude
        render json: { error: "Propriedade sem coordenadas. Cadastre latitude/longitude primeiro." }, status: :unprocessable_entity
        return
      end

      service = ClimateService.new(property.latitude, property.longitude)
      data = service.fetch

      render json: {
        property_id: property.id,
        city: property.city,
        climate: data
      }
    rescue => e
      render json: { error: "Erro ao buscar dados climáticos: #{e.message}" }, status: :service_unavailable
    end
  end
end
