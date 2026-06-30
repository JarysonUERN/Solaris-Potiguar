module Api
  class AnalysisController < ApplicationController
    def create
      property = Property.find(params[:property_id])

      unless property.latitude && property.longitude
        render json: { error: "Propriedade sem coordenadas. Atualize o cadastro primeiro." }, status: :unprocessable_entity
        return
      end

      climate = ClimateService.new(property.latitude, property.longitude).fetch

      energy = EnergyCalculatorService.new(property, climate).calculate
      classification = EnergyClassifierService.new(
        property,
        energy[:generation_kwh],
        energy[:consumption_kwh],
        energy[:balance_kwh]
      ).classify

      context = build_agent_context(property, climate, energy, classification)

      gen_insight   = GenerationAgentService.new(context).call
      cons_insight  = ConsumptionAgentService.new(context).call
      stor_insight  = StorageAgentService.new(context).call

      synthesis = OrchestratorAgentService.new(
        context.merge(insights: {
          generation: gen_insight,
          consumption: cons_insight,
          storage: stor_insight
        })
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
        executive_summary: synthesis[:executive_summary],
        recommendations: synthesis[:recommendations]&.join("\n"),
        estimated_savings_kwh: energy[:savings_kwh],
        estimated_savings_currency: energy[:savings_currency],
        currency: energy[:currency],
        raw_data: {
          climate: climate,
          energy: energy,
          classification: classification,
          insights: {
            generation: gen_insight,
            consumption: cons_insight,
            storage: stor_insight
          }
        }
      )

      render json: AnalysisSerializer.new(analysis).serialize, status: :created
    rescue ActiveRecord::RecordNotFound
      render json: { error: "Propriedade não encontrada" }, status: :not_found
    rescue => e
      render json: { error: "Erro ao gerar análise: #{e.message}" }, status: :internal_server_error
    end

    def index
      property = Property.find(params[:property_id])
      analyses = property.analyses.recent(20)
      render json: analyses.map { |a| AnalysisSerializer.new(a).serialize }
    end

    def show
      analysis = Analysis.find(params[:id])
      render json: AnalysisSerializer.new(analysis).serialize
    end

    private

    def build_agent_context(property, climate, energy, classification)
      {
        installed_capacity_kwp: property.installed_capacity_kwp,
        has_battery: property.has_battery,
        battery_capacity_kwh: property.battery_capacity_kwh,
        battery_charge_kwh: energy[:battery_charge_kwh],
        battery_status: energy[:battery_status],
        generation_kwh: energy[:generation_kwh],
        consumption_kwh: energy[:consumption_kwh],
        balance_kwh: energy[:balance_kwh],
        solar_irradiation: climate[:solar_irradiation],
        cloud_cover: climate[:cloud_cover],
        temperature: climate[:temperature],
        classification: classification[:code],
        savings_currency: energy[:savings_currency],
        business_type: property.business_type
      }
    end
  end
end
