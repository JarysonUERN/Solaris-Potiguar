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
}

export interface AuthResponse {
  token: string;
  email: string;
  full_name: string;
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

export interface AnalysisResponse {
  id: number;
  property_id: number;
  date: string;
  climate: ClimateData;
  energy: {
    generation_kwh: number;
    consumption_kwh: number;
    balance_kwh: number;
    classification: string;
  };
  battery: {
    charge_kwh: number;
    status: string;
  };
  insights: {
    executive_summary: string;
    recommendations: string;
  };
  savings: {
    kwh: number;
    currency: number;
    currency_unit: string;
  };
  raw_data?: {
    insights: {
      generation: string;
      consumption: string;
      storage: string;
    };
  };
  created_at: string;
  updated_at: string;
}

export interface ClimateFetchResponse {
  property_id: number;
  city: string;
  climate: {
    solar_irradiation: number;
    cloud_cover: number;
    temperature: number;
    unit: string;
  };
}

export interface OnboardingResponse {
  property_id: number;
  message: string;
}
