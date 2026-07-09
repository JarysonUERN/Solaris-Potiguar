module Api
  class AnalysisController < ApplicationController
    before_action :authenticate_request

    def create
      property = current_user.properties.find(params[:property_id])
      lang = params[:lang].presence || "pt"

      unless property.latitude && property.longitude
        render json: { error: "Propriedade sem coordenadas. Atualize o cadastro primeiro." }, status: :unprocessable_entity and return
      end

      climate = ClimateService.new(property.latitude, property.longitude).fetch
      energy = EnergyCalculatorService.new(property, climate).calculate
      classification = EnergyClassifierService.new(
        property,
        energy[:generation_kwh],
        energy[:consumption_kwh],
        energy[:balance_kwh]
      ).classify

      shared_context = build_shared_context(property, climate, energy)

      weather_insight    = WeatherAgentService.new(shared_context[:weather].merge(lang: lang)).call
      consumption_insight = ConsumptionAgentService.new(
        property: shared_context[:property],
        generation: { estimated_peak_period: shared_context[:generation][:estimated_peak_period] },
        lang: lang
      ).call
      storage_insight = StorageAgentService.new(
        battery_capacity_kwh: property.battery_capacity_kwh,
        estimated_generation_kwh: energy[:generation_kwh],
        lang: lang
      ).call

      orchestrator_result = OrchestratorAgentService.new(
        weather_agent: weather_insight,
        consumption_agent: consumption_insight,
        storage_agent: storage_insight,
        original_context: shared_context,
        lang: lang
      ).call

      simplification_result = SimplificationAgentService.new(
        executive_summary: orchestrator_result[:executive_summary],
        recommendation: orchestrator_result[:recommendation],
        expected_benefit: orchestrator_result[:expected_benefit],
        priority: orchestrator_result[:priority],
        confidence: orchestrator_result[:confidence],
        lang: lang
      ).call

      analysis = Analysis.create!(
        property: property,
        analysis_date: Time.current,
        solar_irradiation: climate[:solar_irradiation],
        cloud_cover: climate[:cloud_cover],
        temperature: climate[:temperature],
        estimated_generation_kwh: energy[:generation_kwh],
        estimated_consumption_kwh: energy[:consumption_kwh],
        balance_kwh: energy[:balance_kwh],
        classification: classification[:code],
        battery_charge_kwh: energy[:battery_charge_kwh],
        battery_status: energy[:battery_status],
        executive_summary: orchestrator_result[:executive_summary],
        recommendations: orchestrator_result[:recommendation],
        estimated_savings_kwh: energy[:savings_kwh],
        estimated_savings_currency: energy[:savings_currency],
        currency: energy[:currency],
        raw_data: {
          climate: climate,
          energy: energy,
          classification: classification,
          agents: {
            weather: weather_insight,
            consumption: consumption_insight,
            storage: storage_insight
          },
          orchestrator: orchestrator_result,
          simplified: simplification_result
        }
      )

      render json: AnalysisSerializer.new(analysis, shared_context, {
        weather: weather_insight,
        consumption: consumption_insight,
        storage: storage_insight
      }, orchestrator_result, simplification_result).serialize, status: :created
    rescue ActiveRecord::RecordNotFound
      render json: { error: "Propriedade não encontrada" }, status: :not_found and return
    rescue => e
      render json: { error: "Erro ao gerar análise: #{e.message}" }, status: :internal_server_error and return
    end

    def index
      property = current_user.properties.find(params[:property_id])
      analyses = property.analyses.recent(20)
      render json: analyses.map { |a| AnalysisSerializer.new(a).serialize }
    rescue ActiveRecord::RecordNotFound
      render json: { error: "Propriedade não encontrada" }, status: :not_found
    end

    def show
      analysis = Analysis.find(params[:id])
      render json: AnalysisSerializer.new(analysis).serialize
    end

    private

    def build_shared_context(property, climate, energy)
      {
        property: {
          farm_name: property.farm_name,
          city: property.city,
          installed_power_kwp: property.installed_power_kwp,
          battery_capacity_kwh: property.battery_capacity_kwh,
          average_daily_consumption_kwh: property.average_daily_consumption_kwh,
          operation_type: property.operation_type,
          operation_description: property.operation_description,
          flexible_operation: property.flexible_operation
        },
        weather: {
          date: climate[:date],
          temperature_max: climate[:temperature_max],
          temperature_min: climate[:temperature_min],
          cloud_cover: climate[:cloud_cover],
          precipitation_probability: climate[:precipitation_probability],
          solar_irradiance: climate[:solar_irradiance],
          solar_irradiation: climate[:solar_irradiation],
          wind_speed: climate[:wind_speed],
          wind_direction: climate[:wind_direction],
          humidity: climate[:humidity],
          precipitation: climate[:precipitation],
          rain: climate[:rain],
          showers: climate[:showers],
          snowfall: climate[:snowfall],
          uv_index: climate[:uv_index]
        },
        generation: {
          estimated_generation_kwh: energy[:generation_kwh],
          estimated_peak_period: energy[:estimated_peak_period]
        }
      }
    end
  end
end
