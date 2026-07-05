import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Sun, MapPin, CircleAlert, ChevronLeft, ChevronRight, 
  Check, Droplet, Store, House, Factory, Bird, FileText,
} from "lucide-react";

import type { PropertyConfig, Profile, LoadCurve, CitySuggestion } from "../types/index.js";
import { style } from "../styles/styles.js";
import { useLanguage } from "../i18n/index.js";
import LangSelector from "../components/LangSelector.js";
import { submitOnboarding, searchCity } from "../services/api.js";


const profiles = [
  { value: "irrigacao" as Profile, icon: Droplet, labelKey: "onboarding.profile.irrigacao", descKey: "onboarding.profile.irrigacao.desc", color: "text-blue-400" },
  { value: "avicultura" as Profile, icon: Bird, labelKey: "onboarding.profile.avicultura", descKey: "onboarding.profile.avicultura.desc", color: "text-yellow-400" },
  { value: "comercio" as Profile, icon: Store, labelKey: "onboarding.profile.comercio", descKey: "onboarding.profile.comercio.desc", color: "text-accent" },
  { value: "residencial" as Profile, icon: House, labelKey: "onboarding.profile.residencial", descKey: "onboarding.profile.residencial.desc", color: "text-green-400" },
  { value: "agroindustria" as Profile, icon: Factory, labelKey: "onboarding.profile.agroindustria", descKey: "onboarding.profile.agroindustria.desc", color: "text-purple-400" },
];

const equipmentKeys = [
  "onboarding.equipment.pumps",
  "onboarding.equipment.coldroom",
  "onboarding.equipment.milking",
  "onboarding.equipment.motors",
  "onboarding.equipment.ventilation",
  "onboarding.equipment.lighting",
  "onboarding.equipment.compressor",
  "onboarding.equipment.silo",
];

const loadCurves: Record<Profile, LoadCurve> = {
  irrigacao: {
    label: "Irrigação agrícola",
    description: "Bombas ligadas durante o dia — consumo máximo entre 8h e 17h",
    hourlyPercentage: [1.5, 1.5, 1.5, 1.5, 1.5, 2.0, 4.0, 6.0, 8.0, 9.0, 9.0, 8.0, 7.0, 7.0, 7.0, 7.0, 6.0, 4.0, 3.0, 2.0, 1.5, 1.5, 1.5, 1.5],
  },
  avicultura: {
    label: "Avicultura / pecuária",
    description: "Avicultura — consumo estável 24h com leve elevação em alimentação e climatização",
    hourlyPercentage: [3.5, 3.5, 3.5, 3.5, 3.5, 4.0, 5.0, 5.5, 5.0, 4.5, 4.5, 5.0, 4.5, 4.0, 4.0, 4.5, 5.0, 5.5, 5.0, 4.5, 4.0, 3.5, 3.5, 3.5],
  },
  comercio: {
    label: "Comércio rural",
    description: "Funcionamento comercial 8h–18h — pico entre 9h e 16h, consumo mínimo à noite",
    hourlyPercentage: [1.0, 1.0, 1.0, 1.0, 1.0, 1.5, 3.0, 5.0, 8.0, 9.0, 9.0, 8.0, 7.0, 7.0, 8.0, 8.0, 7.0, 5.0, 3.0, 2.0, 1.5, 1.5, 1.0, 1.0],
  },
  residencial: {
    label: "Residencial rural",
    description: "Dupla ponta — manhã (6h–8h) e noite (18h–22h), baixo consumo durante o dia",
    hourlyPercentage: [2.0, 2.0, 2.0, 2.0, 2.0, 3.0, 6.0, 7.0, 5.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 4.0, 5.0, 7.0, 8.0, 8.0, 7.0, 5.0, 3.0],
  },
  agroindustria: {
    label: "Agroindústria",
    description: "Produção industrial em turno — consumo alto e constante das 6h às 22h",
    hourlyPercentage: [1.0, 1.0, 1.0, 1.0, 1.0, 2.0, 6.0, 7.0, 7.0, 7.0, 7.0, 6.0, 6.0, 6.0, 6.0, 7.0, 7.0, 7.0, 6.0, 5.0, 4.0, 3.0, 2.0, 1.0],
  },
};

export default function Onboarding() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [step, setStep] = useState(0);

  useEffect(() => {
    const raw = localStorage.getItem("solaris-auth");
    if (!raw) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const [config, setConfig] = useState<PropertyConfig>({
    name: "",
    city: "",
    capacity: "",
    storage: "",
    consumption: "",
    profile: "residencial",
    routine: "",
  });
  const [selectedCity, setSelectedCity] = useState<CitySuggestion | null>(null);
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [isSearchingCity, setIsSearchingCity] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const cityQuery = config.city.trim();

  useEffect(() => {
    if (!cityQuery) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    if (selectedCity && cityQuery === selectedCity.name) {
      setShowSuggestions(false);
      return;
    }

    setIsSearchingCity(true);
    setShowSuggestions(true);

    const timer = setTimeout(async () => {
      try {
        const results = await searchCity(cityQuery);
        setSuggestions(results);
      } catch {
        setSuggestions([]);
      }
      setIsSearchingCity(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [cityQuery, selectedCity]);

  const steps = [
    { titleKey: "onboarding.step0.title", subtitleKey: "onboarding.step0.subtitle" },
    { titleKey: "onboarding.step1.title", subtitleKey: "onboarding.step1.subtitle" },
    { titleKey: "onboarding.step2.title", subtitleKey: "onboarding.step2.subtitle" },
    { titleKey: "onboarding.step3.title", subtitleKey: "onboarding.step3.subtitle" },
  ];

  const canAdvance = () => {
    if (step === 0) return config.name.trim() && selectedCity !== null;
    if (step === 1) return config.capacity.trim();
    if (step === 2) return !!config.profile;
    if (step === 3) return true;
    return false;
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({ ...config, city: e.target.value });
    if (selectedCity && e.target.value !== selectedCity.name) {
      setSelectedCity(null);
    }
  };

  const handleSelectCity = (suggestion: CitySuggestion) => {
    setConfig({ ...config, city: suggestion.name, latitude: suggestion.latitude, longitude: suggestion.longitude });
    setSelectedCity(suggestion);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    try {
      const res = await submitOnboarding({
        farm_name: config.name,
        city: config.city,
        ...(config.latitude !== undefined && { latitude: config.latitude }),
        ...(config.longitude !== undefined && { longitude: config.longitude }),
        installed_power_kwp: parseFloat(config.capacity) || 0,
        has_battery: parseFloat(config.storage) > 0,
        battery_capacity_kwh: parseFloat(config.storage) || 0,
        average_monthly_consumption_kwh: parseFloat(config.consumption) || 0,
        operation_type: config.profile,
        operation_description: config.routine,
      });

      const existing = localStorage.getItem("solaris-auth");
      if (existing) {
        const session = JSON.parse(existing);
        session.property_id = res.property_id;
        localStorage.setItem("solaris-auth", JSON.stringify(session));
      }

      navigate("/dashboard", { state: { config, property_id: res.property_id } });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao salvar configuração.");
    }
  };

  return (
    <div className={style.pageFlex}>
      {/* Header */}
      <div className={style.headerFlexBetween}>
        <button onClick={() => navigate("/")} className={style.flexCenter}>
          <div className={style.iconBoxTiny}>
            <Sun size={12} className={style.textPrimary} />
          </div>
          <span className={style.logoText}>Solaris Potiguar</span>
        </button>
        <div className="flex items-center gap-3">
          <div className={style.headerMono}>
            {t("onboarding.header.title")} · {step + 1} {t("onboarding.header.of")} 4
          </div>
          <LangSelector />
        </div>
      </div>

      <div className={style.flexCenterFull}>
        <div className={style.containerLg}>
          <div className={style.progressBar}>
            {steps.map((_, i) => (
              <div
                key={i}
                className={`${style.progressStep} ${i <= step ? "bg-primary" : "bg-secondary"}`}
              />
            ))}
          </div>
          <div className="mb-8">
            <div className="text-xs font-mono text-primary mb-2 uppercase tracking-widest">
              {t("onboarding.step")} {step + 1}
            </div>
            <h1 className={style.title2xl}>{t(steps[step]!.titleKey)}</h1>
            <p className={style.textSmMutedTop}>{t(steps[step]!.subtitleKey)}</p>
          </div>
          {step === 0 && (
            <div className={style.spaceY4}>
              <div>
                <label className={style.label}>{t("onboarding.step0.label.name")}</label>
                <input
                  type="text"
                  placeholder={t("onboarding.step0.placeholder.name")}
                  value={config.name}
                  onChange={(e) => setConfig({ ...config, name: e.target.value })}
                  className={style.input}
                />
              </div>
              <div>
                <label className={style.label}>{t("onboarding.step0.label.city")}</label>
                <div className="relative">
                  <MapPin size={15} className={style.inputIconPos} />
                  <input
                    type="text"
                    placeholder={t("onboarding.step0.placeholder.city")}
                    value={config.city}
                    onChange={handleCityChange}
                    onFocus={() => { if (suggestions.length > 0 || isSearchingCity) setShowSuggestions(true); }}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    className={style.inputIcon}
                    autoComplete="off"
                  />

                  {showSuggestions && (
                    <ul className="absolute z-50 left-0 right-0 top-full mt-1 bg-card border border-border rounded-xl shadow-xl overflow-hidden max-h-56 overflow-y-auto">
                      {isSearchingCity && (
                        <li className="px-4 py-3 text-xs text-muted-foreground">{t("onboarding.step0.searching")}</li>
                      )}
                      {!isSearchingCity && suggestions.length === 0 && cityQuery && (
                        <li className="px-4 py-3 text-xs text-muted-foreground">{t("onboarding.step0.noresults")}</li>
                      )}
                      {!isSearchingCity &&
                        suggestions.map((s, i) => (
                          <li
                            key={`${s.latitude}-${s.longitude}-${i}`}
                            onMouseDown={() => handleSelectCity(s)}
                            className="px-4 py-3 text-sm cursor-pointer hover:bg-primary/10 transition-colors border-b border-border last:border-b-0"
                          >
                            <span className="text-foreground font-medium">{s.name}</span>
                            {s.admin1 && (
                              <span className="text-muted-foreground ml-1.5 text-xs">
                                {s.admin1}, {s.country}
                              </span>
                            )}
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
                {selectedCity && (
                  <p className="text-xs text-green-600 mt-1.5 flex items-center gap-1">
                    <Check size={12} />
                    {t("onboarding.step0.confirmed")}: {selectedCity.name}
                    {selectedCity.admin1 && `, ${selectedCity.admin1}`}
                  </p>
                )}
              </div>
              <div className={style.alertCard}>
                <CircleAlert size={14} className={style.textMutedFlex} />
                <p className={style.textXsLeading}>
                  {t("onboarding.step0.alert")}
                </p>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className={style.spaceY4}>
              <div>
                <label className={style.label}>{t("onboarding.step1.label.capacity")}</label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder={t("onboarding.step1.placeholder.capacity")}
                    value={config.capacity}
                    onChange={(e) => setConfig({ ...config, capacity: e.target.value })}
                    className={style.inputSuffix}
                  />
                  <span className={style.inputSuffixText}>kWp</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">{t("onboarding.step1.hint.capacity")}</p>
              </div>
              <div>
                <label className={style.label}>
                  {t("onboarding.step1.label.storage")}
                  <span className="ml-2 text-xs font-normal text-muted-foreground">{t("onboarding.step1.optional")}</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder={t("onboarding.step1.placeholder.storage")}
                    value={config.storage}
                    onChange={(e) => setConfig({ ...config, storage: e.target.value })}
                    className={style.inputSuffix}
                  />
                  <span className={style.inputSuffixText}>kWh</span>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("onboarding.step2.desc")}
              </p>

              <div className="grid grid-cols-1 gap-3">
                {profiles.map((p) => {
                  const curve = loadCurves[p.value];
                  const selected = config.profile === p.value;
                  const maxVal = Math.max(...curve.hourlyPercentage);

                  return (
                    <button
                      key={p.value}
                      onClick={() => setConfig({ ...config, profile: p.value })}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${
                        selected
                          ? "border-primary bg-primary/10"
                          : "border-border bg-card hover:border-primary/30 hover:bg-secondary/30"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`mt-0.5 ${p.color}`}><p.icon size={22} /></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <div className={`font-semibold text-sm ${selected ? "text-primary" : "text-foreground"}`}>
                              {t(p.labelKey)}
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {t(p.descKey)}
                          </div>

                          {/* Gráfico da curva de carga */}
                          <div className="flex items-end gap-[2px] h-8 mt-3">
                            {curve.hourlyPercentage.map((val, i) => (
                              <div
                                key={i}
                                className="flex-1 rounded-t-sm transition-colors"
                                style={{
                                  height: `${(val / maxVal) * 100}%`,
                                  backgroundColor: selected
                                    ? "var(--color-primary)"
                                    : "var(--color-border)",
                                  opacity: selected ? 0.7 : 0.4,
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="border-t border-border pt-4">
                <label className={style.label}>{t("onboarding.step2.label.consumption")}</label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder={t("onboarding.step2.placeholder.consumption")}
                    value={config.consumption}
                    onChange={(e) => setConfig({ ...config, consumption: e.target.value })}
                    className={style.inputSuffix}
                  />
                  <span className={style.inputSuffixText}>kWh/mês</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">
                  {t("onboarding.step2.hint.consumption")}
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("onboarding.step3.desc")}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className={style.label}>
                      {t("onboarding.step3.label.equipment")}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {equipmentKeys.map((key) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() =>
                            setConfig({
                              ...config,
                              routine: config.routine
                                ? `${config.routine}\n${t(key)}`
                                : t(key),
                            })
                          }
                          className="px-3 py-1.5 rounded-lg border border-border bg-secondary text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground hover:bg-primary/5 transition-all active:scale-95"
                        >
                          + {t(key)}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {t("onboarding.step3.hint.equipment")}
                    </p>
                  </div>

                  <div>
                    <label className={style.label}>
                      {t("onboarding.step3.label.routine")}
                      <span className="ml-2 text-xs font-normal text-muted-foreground">{t("onboarding.step1.optional")}</span>
                    </label>
                    <textarea
                      placeholder="Ex: As bombas funcionam das 14h às 17h, a câmara fria fica ligada 24h..."
                      value={config.routine}
                      onChange={(e) => setConfig({ ...config, routine: e.target.value })}
                      className={style.textarea}
                      rows={6}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("onboarding.step3.examples")}</p>
                  <div className={style.alertCard}>
                    <FileText size={14} className="text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-green-600">{t("onboarding.step3.example.good.title")}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                        {t("onboarding.step3.example.good.text")}
                      </p>
                    </div>
                  </div>
                  <div className={style.alertCard}>
                    <CircleAlert size={14} className="text-yellow-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-yellow-600">{t("onboarding.step3.example.weak.title")}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                        {t("onboarding.step3.example.weak.text")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-10">
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className={style.btnBackStep}
            >
              <ChevronLeft size={16} />
              {t("onboarding.button.back")}
            </button>

            <button
              onClick={handleNext}
              disabled={!canAdvance()}
              className={`${style.btnNext} ${
                canAdvance()
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-secondary text-muted-foreground cursor-not-allowed"
              }`}
            >
              {step === 3 ? (
                <>
                  <Check size={15} />
                  {t("onboarding.button.finish")}
                </>
              ) : (
                <>
                  {t("onboarding.button.continue")}
                  <ChevronRight size={16} />
                </>
              )}
            </button>
            </div>
        </div>
      </div>
    </div>
  );

}
