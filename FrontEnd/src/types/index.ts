export type Profile =
  | "irrigacao"
  | "avicultura"
  | "comercio"
  | "residencial"
  | "agroindustria";

export interface CitySuggestion {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}

export interface PropertyConfig {
  name: string;
  city: string;
  latitude?: number;
  longitude?: number;
  capacity: string;
  storage: string;
  consumption: string;
  profile: Profile;
  routine: string;
}

export interface LoadCurve {
  label: string;
  icon?: string;
  description: string;
  hourlyPercentage: number[];
}

export interface ForecastItem {
  hour: string;
  icon: string;
  temp: number;
}

export interface User {
  id: number;
  full_name: string;
  email: string;
  phone: string | null;
  has_whatsapp: boolean;
  cpf: string | null;
  property_id: number | null;
}

export interface AuthResponse {
  token: string;
  email: string;
  full_name: string;
  property_id: number | null;
}

export interface Property {
  id: number;
  farm_name: string;
  city: string;
  installed_power_kwp: number;
  has_battery: boolean;
  battery_capacity_kwh: number;
  average_daily_consumption_kwh: number;
  operation_type: string | null;
  peak_consumption_period: string | null;
  flexible_operation: boolean;
  main_equipments: string[];
  operation_description: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string;
}

export interface ClimateData {
  solar_irradiation: number;
  cloud_cover: number;
  temperature: number;
}

export interface WeatherData {
  date: string;
  temperature_max: number;
  temperature_min: number;
  cloud_cover: number;
  precipitation_probability: number;
  solar_irradiance: string;
  solar_irradiation: number;
  wind_speed?: number;
  wind_direction?: number;
  humidity?: number;
  precipitation?: number;
  rain?: number;
  showers?: number;
  snowfall?: number;
  uv_index?: number;
}

export interface AgentWeatherResponse {
  summary: string;
  solar_conditions: string;
  weather_risk: string;
  confidence: number;
  reasoning: string[];
}

export interface AgentConsumptionResponse {
  consumption_profile: string;
  flexibility: string;
  recommended_operation_window: string;
  reasoning: string[];
  confidence: number;
}

export interface AgentStorageResponse {
  battery_available: boolean;
  battery_capacity: number;
  battery_strategy: string;
  reasoning: string[];
  confidence: number;
}

export interface Recommendation {
  summary: string;
  recommendation: string;
  priority: string;
  confidence: number;
  expected_benefit?: string;
}

export interface SimplifiedResponse {
  simplified_text: string;
}

export interface AnalysisResponse {
  id: number;
  property_id: number;
  analysis_date: string;
  created_at: string;
  updated_at: string;
  weather: WeatherData;
  generation: {
    estimated_generation_kwh: number;
    estimated_peak_period: string;
  };
  energy: {
    generation_kwh: number;
    consumption_kwh: number;
    balance_kwh: number;
  };
  battery: {
    charge_kwh: number;
    status: string;
  };
  savings: {
    kwh: number;
    currency: number;
    currency_unit: string;
  };
  agents: {
    weather: AgentWeatherResponse;
    consumption: AgentConsumptionResponse;
    storage: AgentStorageResponse;
  };
  recommendation: Recommendation;

  simplified?: SimplifiedResponse;

  /** @deprecated Use `weather` instead */
  climate?: ClimateData;
  /** @deprecated Use `recommendation` instead */
  insights?: {
    executive_summary: string;
    recommendations: string;
  };
  /** @deprecated Use `agents` instead */
  raw_data?: {
    insights: {
      generation: string;
      consumption: string;
      storage: string;
    };
  };
  /** @deprecated Use `analysis_date` instead */
  date?: string;
}

export interface ClimateFetchResponse {
  property_id: number;
  city: string;
  climate: {
    solar_irradiation: number;
    cloud_cover: number;
    temperature: number;
    unit: string;
    wind_speed: number;
    wind_direction: number;
    humidity: number;
    precipitation: number;
    rain: number;
    showers: number;
    snowfall: number;
    uv_index: number;
  };
}

export interface OnboardingResponse {
  property_id: number;
  message: string;
}
