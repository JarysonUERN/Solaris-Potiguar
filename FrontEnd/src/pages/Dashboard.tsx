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
  uv: number;
  wind: number;
  humidity: number;
  forecast: { hour: string; icon: string; temp: number }[];
};

function WeatherIcon({ type, size = 20 }: { type: string; size?: number }) {
  if (type === "sun") return <Sun size={size} className={style.textPrimary} />;
  if (type === "cloud-sun") return <CloudSun size={size} className={style.textYellow} />;
  return <Cloud size={size} className={style.textMuted} />;
}

function buildWeatherDisplay(analysis: AnalysisResponse): ClimateDisplay {
  const { solar_irradiation, cloud_cover, temperature } = analysis.climate;
  const classification = analysis.energy.classification;

  let condition = "Ensolarado";
  if (cloud_cover > 60) condition = "Nublado";
  else if (cloud_cover > 30) condition = "Parcialmente nublado";

  const forecast = [
    { hour: "Agora", icon: cloud_cover > 60 ? "cloud" : "sun", temp: Math.round(temperature) },
  ];

  for (let i = 1; i <= 5; i++) {
    const h = (new Date().getHours() + i) % 24;
    const icon = i > 3 && cloud_cover > 40 ? "cloud-sun" : "sun";
    forecast.push({
      hour: `${h}h`,
      icon,
      temp: Math.round(temperature - i * 0.5),
    });
  }

  return {
    temp: Math.round(temperature),
    condition,
    uv: classification === "EXCEDENTE" ? 9 : classification === "DEFICIT" ? 3 : 6,
    wind: 12,
    humidity: Math.round(100 - solar_irradiation * 10),
    forecast,
  };
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [analyses, setAnalyses] = useState<AnalysisResponse[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [property, setProperty] = useState<Property | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingPassword, setEditingPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const propId = getStoredPropId();

  useEffect(() => {
    const token = localStorage.getItem("solaris-auth");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    const init = async () => {
      try {
        const userData = await fetchUser();
        setUser(userData);
        setEditingName(userData.full_name);

        if (propId) {
          const [propRes, , historyRes] = await Promise.all([
            fetchProperty(propId),
            fetchClimate(propId).catch(() => null),
            fetchAnalysesByProperty(propId).catch(() => [] as AnalysisResponse[]),
          ]);

          setProperty(propRes.property);
          setAnalyses(Array.isArray(historyRes) ? historyRes : []);
        }
      } catch {
        localStorage.removeItem("solaris-auth");
        navigate("/login", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [navigate, propId]);

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
    if (!propId) return;
    setAnalyzing(true);
    setError("");

    try {
      const analysis = await createAnalysis(propId);
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
        <div className={style.headerInner}>
          <div className={style.flexCenterGap3}>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="mr-1 flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card/80 transition-colors hover:border-primary/30 hover:bg-primary/10"
              aria-label={t("dashboard.header.back")}
            >
              <img src={homeIcon} alt={t("dashboard.header.back")} className="h-4 w-4" />
            </button>
            <ThemeToggle size={13} />
            <LangSelector />
            <div>
              <div className={style.subtitleHeader}>{config.name}</div>
              <div className={style.textLocation}>
                <MapPin size={9} />
                {config.city}
              </div>
            </div>
          </div>
          <div className={style.textSpecs}>
            <Cpu size={12} />
            {config.capacity} kWp · {config.storage || "0"} kWh batt
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="w-72 border-r border-border min-h-[calc(100vh-4rem)] p-6 flex flex-col gap-5 flex-shrink-0">
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

        <main className="flex-1 px-6 py-8 max-w-3xl space-y-6">
          {activeClimate && (
            <div className={style.card}>
              <div className={`${style.flexBetween} mb-4`}>
                <div className={style.textSectionLabel}>
                  <CloudSun size={12} className={style.textPrimary} />
                  {t("dashboard.climate.now")} · {config.city.toUpperCase()}
                </div>
                <div className={style.forecastTime}>Open-Meteo API</div>
              </div>

              <div className="flex items-center gap-4 mb-5">
                <Sun size={40} className={style.textPrimary} />
                <div>
                  <div className={style.text4xlMono}>{activeClimate.temp}°</div>
                  <div className={style.textSmMuted}>{activeClimate.condition}</div>
                </div>
                <div className={style.gridStats}>
                  <div className={style.textXs}>{t("dashboard.climate.uv")}</div>
                  <div className={style.textMonoFg}>{activeClimate.uv}</div>
                  <div className={style.textXs}>{t("dashboard.climate.wind")}</div>
                  <div className={style.textMonoFg}>{activeClimate.wind} km/h</div>
                  <div className={style.textXs}>{t("dashboard.climate.humidity")}</div>
                  <div className={style.textMonoFg}>{activeClimate.humidity}%</div>
                </div>
              </div>

              <div className={style.gridCols6}>
                {activeClimate.forecast.map((f) => (
                  <div key={f.hour} className={style.flexCol}>
                    <div className={style.forecastTime}>{f.hour}</div>
                    <WeatherIcon type={f.icon} size={16} />
                    <div className={style.textMonoFg}>{f.temp}°</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={analyzing || !propId}
            className={`${style.btnAnalyze} ${
              analyzing || !propId ? style.btnAnalyzeDisabled : style.btnAnalyzeActive
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
                  {t("dashboard.recommendation")} · {new Date(latestAnalysis.date).toLocaleString("pt-BR")}
                </div>
                <ChevronRight size={16} className={style.chevronIcon} />
              </div>
              <p className="text-foreground leading-relaxed">{latestAnalysis.insights.executive_summary}</p>
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
                      <div className={style.textResultMuted}>{new Date(a.date).toLocaleString("pt-BR")}</div>
                      <div className={style.textResultFg}>{a.insights.executive_summary.slice(0, 80)}...</div>
                    </div>
                    <ChevronRight size={14} className={style.btnBack} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {latestAnalysis && (
            <div className={style.gridCols3}>
              {[
                { labelKey: "dashboard.stats.generation", value: `${latestAnalysis.energy.generation_kwh.toFixed(1)} kWh`, subKey: "dashboard.stats.estimated", icon: <Sun size={13} className={style.textPrimary} />, color: "text-primary" },
                { labelKey: "dashboard.stats.consumption", value: `${latestAnalysis.energy.consumption_kwh.toFixed(1)} kWh`, subKey: "dashboard.stats.estimated", icon: <Zap size={13} className={style.textBlue} />, color: "text-blue-400" },
                { labelKey: "dashboard.stats.battery", value: latestAnalysis.battery.status === "not_applicable" ? "N/A" : `${latestAnalysis.battery.charge_kwh.toFixed(1)} kWh`, subKey: latestAnalysis.battery.status, icon: <Battery size={13} className={style.textAccent} />, color: "text-accent" },
              ].map((stat) => (
                <div key={stat.labelKey} className={style.cardSmall}>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                    {stat.icon}
                    {t(stat.labelKey)}
                  </div>
                  <div className={`text-xl font-bold font-mono ${stat.color}`}>{stat.value}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5 font-mono">
                    {stat.subKey === "dashboard.stats.estimated" ? t(stat.subKey) : stat.subKey}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
