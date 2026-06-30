export interface PropertyConfig {
  name: string;
  city: string;
  capacity: string;
  storage: string;
  consumption: string;
  peakHour: "morning" | "afternoon" | "night";
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
