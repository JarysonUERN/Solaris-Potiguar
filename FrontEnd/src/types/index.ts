export type Profile =
  | "irrigacao"
  | "avicultura"
  | "comercio"
  | "residencial"
  | "agroindustria";

export interface PropertyConfig {
  name: string;
  city: string;
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

export interface Analysis {
  id: string;
  time: string;
  summary: string;
  agents: {
    meteo: string;
    consumption: string;
    storage: string;
  };
  synthesis: string;
}

export interface ForecastItem {
  hour: string;
  icon: string;
  temp: number;
}
