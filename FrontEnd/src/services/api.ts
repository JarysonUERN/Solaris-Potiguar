import type {
  AuthResponse,
  User,
  Property,
  AnalysisResponse,
  ClimateFetchResponse,
  OnboardingResponse,
  CitySuggestion,
} from "../types/index.js";

function getToken(): string | null {
  const raw = localStorage.getItem("solaris-auth");
  if (!raw) return null;
  try {
    return JSON.parse(raw).token;
  } catch {
    return null;
  }
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: { ...authHeaders(), ...(options.headers as Record<string, string>) },
    });

    const contentType = res.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      const text = await res.text();
      throw new Error(
        `Resposta inesperada do servidor (${res.status}): ${text.slice(0, 120)}`
      );
    }

    const body = await res.json();

    if (!res.ok) {
      const msg = body.error || body.errors?.join?.(". ") || "Erro de servidor";
      throw new Error(msg);
    }

    return body as T;
  } finally {
    clearTimeout(timer);
  }
}

export async function searchCity(query: string): Promise<CitySuggestion[]> {
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=pt&format=json`,
  );
  const data = await res.json();
  return (data.results || []).map((r: { name: string; latitude: number; longitude: number; country: string; admin1?: string }) => ({
    name: r.name,
    latitude: r.latitude,
    longitude: r.longitude,
    country: r.country,
    admin1: r.admin1,
  }));
}

export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  return request<AuthResponse>("/solaris_potiguar/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function register(data: {
  full_name: string;
  email: string;
  password: string;
  phone: string;
  has_whatsapp: boolean;
  cpf: string;
}): Promise<{ id: number; full_name: string; email: string }> {
  return request("/solaris_potiguar/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function fetchUser(): Promise<User> {
  return request<User>("/solaris_potiguar/user");
}

export async function updateUser(data: {
  full_name?: string;
  phone?: string;
  has_whatsapp?: boolean;
}): Promise<{ message: string; user: User }> {
  return request("/solaris_potiguar/user", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function submitOnboarding(data: {
  farm_name: string;
  city: string;
  latitude?: number;
  longitude?: number;
  installed_power_kwp: number;
  has_battery: boolean;
  battery_capacity_kwh: number;
  average_monthly_consumption_kwh: number;
  operation_type: string;
  operation_description: string;
}): Promise<OnboardingResponse> {
  return request<OnboardingResponse>("/solaris_potiguar/onboarding", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function fetchProperty(
  propertyId: number
): Promise<{ property: Property }> {
  return request(`/api/setup/${propertyId}`);
}

export async function fetchClimate(
  propertyId: number
): Promise<ClimateFetchResponse> {
  return request<ClimateFetchResponse>(`/api/climate/fetch/${propertyId}`);
}

export async function createAnalysis(
  propertyId: number
): Promise<AnalysisResponse> {
  return request<AnalysisResponse>("/api/analysis", {
    method: "POST",
    body: JSON.stringify({ property_id: propertyId }),
  });
}

export async function fetchAnalysis(id: number): Promise<AnalysisResponse> {
  return request<AnalysisResponse>(`/api/analysis/${id}`);
}

export async function fetchAnalysesByProperty(
  propertyId: number
): Promise<AnalysisResponse[]> {
  return request<AnalysisResponse[]>(
    `/api/analysis/property/${propertyId}`
  );
}
