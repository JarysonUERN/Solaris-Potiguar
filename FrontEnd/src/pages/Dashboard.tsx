import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sun, CloudSun, Cloud, Brain, History, Layers, Cpu, MapPin,
  RefreshCw, Sparkles, ChevronRight, Zap, Battery
} from "lucide-react";
import ThemeToggle from "../components/ThemeToggle.js";
import LangSelector from "../components/LangSelector.js";
import type { PropertyConfig, AnalysisResponse, User, Property } from "../types/index.js";
import { style } from "../styles/styles.js";
import { useLanguage } from "../i18n/index.js";
import homeIcon from "../assets/icons/home-1-svgrepo-com.svg";
import SolarisP from "../assets/images/SolarisP.png";
import { fetchUser, fetchProperty, fetchClimate, createAnalysis, fetchAnalysesByProperty, updateUser } from "../services/api.js";

function getStoredPropId(): number | null {
  try {
    const raw = localStorage.getItem("solaris-auth");
    if (!raw) return null;
    const data = JSON.parse(raw);
    return data.property_id ?? null;
  } catch {
    return null;
  }
}

type ClimateDisplay = {
  temp: number;
  condition: string;
  uv: number | null;
  wind: number | null;
  humidity: number | null;
  irradiation: number;
  cloud_cover: number;
  is_real_data: boolean;
};

function WeatherIcon({ type, size = 20 }: { type: string; size?: number }) {
  if (type === "sun") return <Sun size={size} className={style.textPrimary} />;
  if (type === "cloud-sun") return <CloudSun size={size} className={style.textYellow} />;
  return <Cloud size={size} className={style.textMuted} />;
}

function buildWeatherDisplay(analysis: AnalysisResponse): ClimateDisplay {
  const weather = analysis.weather || analysis.climate!;
  const irradiation = weather.solar_irradiation;
  const cloud_cover = weather.cloud_cover;
  const temperature = weather.temperature_max;

  const is_real_data = irradiation > 0 || cloud_cover > 0 || temperature > 0;

  let condition = "Ensolarado";
  if (cloud_cover > 60) condition = "Nublado";
  else if (cloud_cover > 30) condition = "Parcialmente nublado";
  if (!is_real_data) condition = "Sem dados climáticos";

  return {
    temp: Math.round(temperature),
    condition,
    uv: is_real_data && irradiation > 4 ? Math.round(irradiation * 2) : null,
    wind: is_real_data ? 12 : null,
    humidity: is_real_data ? Math.round(Math.max(20, Math.min(95, 100 - irradiation * 8))) : null,
    irradiation,
    cloud_cover,
    is_real_data,
  };
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const [analyses, setAnalyses] = useState<AnalysisResponse[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [property, setProperty] = useState<Property | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingPassword, setEditingPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [activePropId, setActivePropId] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("solaris-auth");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    const init = async () => {
      try {
        const userData = await fetchUser();
        console.log("[Dashboard] user fetched", userData);
        setUser(userData);
        setEditingName(userData.full_name);

        let pid = getStoredPropId();
        if (pid === null && userData.property_id) {
          pid = userData.property_id;
          const raw = localStorage.getItem("solaris-auth");
          if (raw) {
            const session = JSON.parse(raw);
            session.property_id = userData.property_id;
            localStorage.setItem("solaris-auth", JSON.stringify(session));
          }
        }

        if (pid === null) {
          navigate("/onboarding", { replace: true });
          return;
        }

        setActivePropId(pid);

        console.log("[Dashboard] fetching property", pid);
        const [propRes, climateRes, historyRes] = await Promise.all([
          fetchProperty(pid),
          fetchClimate(pid).catch((e) => {
            console.warn("[Dashboard] climate failed", e);
            return null;
          }),
          fetchAnalysesByProperty(pid).catch((e) => {
            console.warn("[Dashboard] history failed", e);
            return [] as AnalysisResponse[];
          }),
        ]);

        console.log("[Dashboard] property fetched", propRes);
        setProperty(propRes.property);
        setAnalyses(Array.isArray(historyRes) ? historyRes : []);
      } catch (err) {
        console.error("[Dashboard] init error", err);
        localStorage.removeItem("solaris-auth");
        navigate("/login", { replace: true });
      } finally {
        console.log("[Dashboard] finally running");
        setLoading(false);
      }
    };

    init();
  }, [navigate]);

  const config: PropertyConfig = property
    ? {
        name: property.farm_name,
        city: property.city,
        capacity: String(property.installed_power_kwp),
        storage: String(property.battery_capacity_kwh),
        consumption: String(property.average_daily_consumption_kwh * 30),
        profile: (property.operation_type as PropertyConfig["profile"]) || "residencial",
        routine: property.operation_description || "",
      }
    : {
        name: t("dashboard.loading"),
        city: "",
        capacity: "0",
        storage: "0",
        consumption: "0",
        profile: "residencial",
        routine: "",
      };

  const handleAnalyze = async () => {
    if (!activePropId) return;
    setAnalyzing(true);
    setError("");

    try {
      const analysis = await createAnalysis(activePropId, language);
      setAnalyses([analysis, ...analyses]);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("dashboard.analyze.error"));
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSaveUser = async () => {
    if (!user) return;
    try {
      await updateUser({ full_name: editingName });
      setUser({ ...user, full_name: editingName });
      setShowEditForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("dashboard.update.error"));
    }
  };

  const initials = (user?.full_name || "??")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const latestAnalysis = analyses[0];
  const activeClimate = latestAnalysis
    ? buildWeatherDisplay(latestAnalysis)
    : null;

  if (loading) {
    return (
      <div className={style.page}>
        <div className="flex items-center justify-center min-h-screen text-muted-foreground">
          {t("dashboard.loading")}
        </div>
      </div>
    );
  }

  return (
    <div className={style.page}>
      <header className={style.header}>
        <div className={`${style.headerInner} relative flex w-full items-center justify-between`}>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card/80 transition-colors hover:border-primary/30 hover:bg-primary/10"
              aria-label={t("dashboard.header.back")}
            >
              <img src={homeIcon} alt={t("dashboard.header.back")} className="h-4 w-4" />
            </button>
            <ThemeToggle size={13} />
          </div>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <img
              src={SolarisP}
              alt="Solaris Potiguar"
              className="h-8 w-auto object-contain"
            />
          </div>

          <div className="flex items-center">
            <LangSelector />
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-4rem)]">
        <aside className="w-72 border-r border-border p-6 flex flex-col gap-5 flex-shrink-0">
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-full bg-primary/15 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">{initials}</span>
            </div>
            <div className="text-center">
              <div className={style.subtitleHeader}>{user?.full_name || "..."}</div>
              <div className={style.textXs}>{user?.email || "..."}</div>
            </div>
          </div>

          <button
            onClick={() => setShowEditForm(!showEditForm)}
            className={`text-sm font-medium transition-colors ${
              showEditForm ? "text-muted-foreground" : "text-primary hover:text-primary/80"
            }`}
          >
            {showEditForm ? t("dashboard.sidebar.cancel") : t("dashboard.sidebar.edit")}
          </button>

          {showEditForm && (
            <div className="space-y-3">
              <div>
                <label className={style.label}>{t("dashboard.sidebar.label.name")}</label>
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className={style.input}
                />
              </div>
              <div>
                <label className={style.label}>{t("dashboard.sidebar.label.password")}</label>
                <input
                  type="password"
                  value={editingPassword}
                  onChange={(e) => setEditingPassword(e.target.value)}
                  className={style.input}
                  placeholder={t("dashboard.sidebar.placeholder.password")}
                />
              </div>
              {error ? (
                <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">
                  {error}
                </div>
              ) : null}
              <button
                onClick={handleSaveUser}
                className={`${style.btnPrimarySm} w-full justify-center`}
              >
                {t("dashboard.sidebar.save")}
              </button>
            </div>
          )}

          <div className="border-t border-border" />

          <button
            onClick={() => navigate("/onboarding")}
            className="text-sm text-muted-foreground hover:text-foreground border border-border rounded-lg px-4 py-2 transition-colors w-full text-center"
          >
            {t("dashboard.sidebar.redo")}
          </button>
        </aside>

        <div className="flex-1 flex flex-col">
          <main className="flex-1 px-6 py-8 max-w-3xl space-y-6">
            {activeClimate && (
              <div className={style.card}>
                <div className={`${style.flexBetween} mb-4`}>
                  <div className={style.textSectionLabel}>
                    <CloudSun size={12} className={style.textPrimary} />
                    {t("dashboard.climate.now")} · {config.city.toUpperCase()}
                  </div>
                  <div className={style.forecastTime}>
                    {activeClimate.is_real_data ? "Open-Meteo API" : t("dashboard.climate.unavailable")}
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-5">
                  <Sun size={40} className={style.textPrimary} />
                  <div>
                    <div className={style.text4xlMono}>{activeClimate.temp}°</div>
                    <div className={style.textSmMuted}>{activeClimate.condition}</div>
                  </div>
                  <div className={style.gridStats}>
                    <div className={style.textXs}>{t("dashboard.climate.uv")}</div>
                    <div className={style.textMonoFg}>
                      {activeClimate.uv !== null ? activeClimate.uv : t("dashboard.climate.na")}
                    </div>
                    <div className={style.textXs}>{t("dashboard.climate.wind")}</div>
                    <div className={style.textMonoFg}>
                      {activeClimate.wind !== null ? `${activeClimate.wind} km/h` : t("dashboard.climate.na")}
                    </div>
                    <div className={style.textXs}>{t("dashboard.climate.humidity")}</div>
                    <div className={style.textMonoFg}>
                      {activeClimate.humidity !== null ? `${activeClimate.humidity}%` : t("dashboard.climate.na")}
                    </div>
                  </div>
                </div>

                <div className={style.gridCols6}>
                  {[
                    { label: t("dashboard.climate.irradiation"), value: `${activeClimate.irradiation.toFixed(1)} kWh/m²` },
                    { label: t("dashboard.climate.cloud_cover"), value: `${activeClimate.cloud_cover.toFixed(0)}%` },
                  ].map((stat) => (
                    <div key={stat.label} className="p-2 rounded-lg border border-border bg-card/50 text-center col-span-3">
                      <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">{stat.label}</div>
                      <div className="text-sm font-bold font-mono text-foreground mt-0.5">{stat.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error && !showEditForm ? (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            ) : null}

            <button
              onClick={handleAnalyze}
              disabled={analyzing || !activePropId}
              className={`${style.btnAnalyze} ${analyzing || !activePropId ? style.btnAnalyzeDisabled : style.btnAnalyzeActive
                }`}
            >
              {analyzing ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  {t("dashboard.analyzing")}
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  {t("dashboard.analyze")}
                </>
              )}
            </button>

            {latestAnalysis && (
              <div
                className={style.cardResult}
                onClick={() => navigate("/result", { state: { analysis: latestAnalysis } })}
              >
                <div className={`${style.flexBetween} mb-3`}>
                  <div className={style.resultHeader}>
                    <Brain size={12} />
                    {t("dashboard.recommendation")} · {new Date(latestAnalysis.analysis_date || latestAnalysis.date!).toLocaleString("pt-BR")}
                  </div>
                  <ChevronRight size={16} className={style.chevronIcon} />
                </div>
                <p className="text-foreground leading-relaxed">{latestAnalysis.recommendation?.summary || latestAnalysis.insights?.executive_summary}</p>
                <div className={`mt-3 ${style.analysisCard}`}>
                  <Layers size={11} />
                  {t("dashboard.reasoning")}
                </div>
              </div>
            )}

            {analyses.length > 1 && (
              <div>
                <div className={style.analysisHistoryHeader}>
                  <History size={11} />
                  {t("dashboard.history")}
                </div>
                <div className={style.spaceY2}>
                  {analyses.slice(1, 4).map((a) => (
                    <button
                      key={a.id}
                      onClick={() => navigate("/result", { state: { analysis: a } })}
                      className={style.cardHistory}
                    >
                      <div>
                        <div className={style.textResultMuted}>{new Date(a.analysis_date || a.date!).toLocaleString("pt-BR")}</div>
                        <div className={style.textResultFg}>{(a.recommendation?.summary || a.insights?.executive_summary || "").slice(0, 80)}...</div>
                      </div>
                      <ChevronRight size={14} className={style.btnBack} />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </main>

          <footer className="border-t border-border px-6 py-4">
            <div className="max-w-3xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Cpu size={14} className="text-primary" />
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Sistema</div>
                    <div className="text-sm font-bold font-mono text-foreground">{config.capacity} kWp · {config.storage || "0"} kWh</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                {latestAnalysis && (
                  <>
                    <div className="flex items-center gap-2">
                      <Sun size={14} className="text-primary" />
                      <div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{t("dashboard.stats.generation")}</div>
                        <div className="text-sm font-bold font-mono text-primary">{latestAnalysis.energy.generation_kwh.toFixed(1)} kWh</div>
                      </div>
                    </div>
                    <div className="w-px h-8 bg-border" />
                    <div className="flex items-center gap-2">
                      <Zap size={14} className="text-blue-400" />
                      <div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{t("dashboard.stats.consumption")}</div>
                        <div className="text-sm font-bold font-mono text-blue-400">{latestAnalysis.energy.consumption_kwh.toFixed(1)} kWh</div>
                      </div>
                    </div>
                    <div className="w-px h-8 bg-border" />
                    <div className="flex items-center gap-2">
                      <Battery size={14} className="text-accent" />
                      <div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{t("dashboard.stats.battery")}</div>
                        <div className="text-sm font-bold font-mono text-accent">
                          {latestAnalysis.battery.status === "not_applicable" ? "N/A" : `${latestAnalysis.battery.charge_kwh.toFixed(1)} kWh`}
                        </div>
                      </div>
                    </div>
                    <div className="w-px h-8 bg-border" />
                  </>
                )}
                <div>
                  <div className={style.subtitleHeader}>{config.name}</div>
                  <div className={style.textLocation}>
                    <MapPin size={9} />
                    {config.city}
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
