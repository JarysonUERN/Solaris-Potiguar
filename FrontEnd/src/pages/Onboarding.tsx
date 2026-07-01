import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sun, MapPin, AlertCircle, ChevronLeft, ChevronRight,
  Check, Thermometer, Clock
} from "lucide-react";
import type { PropertyConfig } from "../types/index.js";
import { style } from "../styles/styles.js";

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [config, setConfig] = useState<PropertyConfig>({
    name: "",
    city: "",
    capacity: "",
    storage: "",
    consumption: "",
    peakHour: "afternoon",
  });

  const steps = [
    { title: "Sua propriedade", subtitle: "Como você chama e onde fica?" },
    { title: "Sistema solar", subtitle: "Capacidade instalada de geração e armazenamento" },
    { title: "Consumo", subtitle: "Perfil de uso da sua propriedade" },
  ];

  const canAdvance = () => {
    if (step === 0) return config.name.trim() && config.city.trim();
    if (step === 1) return config.capacity.trim();
    if (step === 2) return config.consumption.trim();
    return false;
  };

  const handleNext = () => {
    if (step < 2) setStep(step + 1);
    else navigate("/dashboard", { state: { config } });
  };

  return (
    <div className={style.pageFlex}>
      <div className={style.headerFlexBetween}>
        <button onClick={() => navigate("/")} className={style.flexCenter}>
          <div className={style.iconBoxTiny}>
            <Sun size={12} className={style.textPrimary} />
          </div>
          <span className={style.logoText}>SolarMind</span>
        </button>
        <div className={style.headerMono}>
          Configuração inicial · {step + 1} de 3
        </div>
      </div>

      <div className={style.flexCenterFull}>
        <div className={style.containerLg}>
          <div className={style.progressBar}>
            {steps.map((_, i) => (
              <div
                key={i}
                className={`${style.progressStep} ${
                  i <= step ? "bg-primary" : "bg-secondary"
                }`}
              />
            ))}
          </div>

          <div className="mb-8">
            <div className="text-xs font-mono text-primary mb-2 uppercase tracking-widest">
              Passo {step + 1}
            </div>
            <h1 className={style.title2xl}>{steps[step]!.title}</h1>
            <p className={style.textSmMutedTop}>{steps[step]!.subtitle}</p>
          </div>

          {step === 0 && (
            <div               className={style.spaceY4}>
              <div>
                <label className={style.label}>
                  Nome da propriedade
                </label>
                <input
                  type="text"
                  placeholder="Ex: Fazenda Boa Vista"
                  value={config.name}
                  onChange={(e) => setConfig({ ...config, name: e.target.value })}
                  className={style.input}
                />
              </div>
              <div>
                <label className={style.label}>
                  Cidade / Região no RN
                </label>
                <div className="relative">
                  <MapPin size={15} className={style.inputIconPos} />
                  <input
                    type="text"
                    placeholder="Ex: Mossoró, Caicó, Serra do Mel…"
                    value={config.city}
                    onChange={(e) => setConfig({ ...config, city: e.target.value })}
                    className={style.inputIcon}
                  />
                </div>
              </div>
              <div className={style.alertCard}>
                <AlertCircle size={14} className={style.textMutedFlex} />
                <p className={style.textXsLeading}>
                  A localização é usada para buscar dados climáticos da Open-Meteo API automaticamente.
                </p>
              </div>
            </div>
          )}

          {step === 1 && (
            <div               className={style.spaceY4}>
              <div>
                <label className={style.label}>
                  Capacidade de geração (kWp)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Ex: 8.5"
                    value={config.capacity}
                    onChange={(e) => setConfig({ ...config, capacity: e.target.value })}
                    className={style.inputSuffix}
                  />
                  <span className={style.inputSuffixText}>kWp</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">Soma dos painéis instalados. Informe 0 se não souber.</p>
              </div>
              <div>
                <label className={style.label}>
                  Capacidade de armazenamento (kWh)
                  <span className="ml-2 text-xs font-normal text-muted-foreground">— opcional</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Ex: 12.0 — ou 0 se não tiver bateria"
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
            <div               className={style.spaceY4}>
              <div>
                <label className={style.label}>
                  Consumo médio mensal (kWh)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Ex: 450"
                    value={config.consumption}
                    onChange={(e) => setConfig({ ...config, consumption: e.target.value })}
                    className={style.inputSuffix}
                  />
                  <span className={style.inputSuffixText}>kWh/mês</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">Encontre na sua fatura de energia da Cosern.</p>
              </div>

              <div>
                <label className={style.label}>
                  Horário de maior consumo
                </label>
                <div className={style.gridCols3Sm}>
                  {[
                    { value: "morning" as const, label: "Manhã", sub: "06h–12h", icon: <Sun size={14} /> },
                    { value: "afternoon" as const, label: "Tarde", sub: "12h–18h", icon: <Thermometer size={14} /> },
                    { value: "night" as const, label: "Noite", sub: "18h–23h", icon: <Clock size={14} /> },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setConfig({ ...config, peakHour: opt.value })}
                      className={`${style.peakBtnBase} ${
                        config.peakHour === opt.value
                          ? style.peakBtnActive
                          : style.peakBtnInactive
                      }`}
                    >
                      {opt.icon}
                      <div className={style.textXsMedium}>{opt.label}</div>
                      <div className={style.textMicroMono}>{opt.sub}</div>
                    </button>
                  ))}
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
              Voltar
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
              {step === 2 ? (
                <>
                  <Check size={15} />
                  Concluir configuração
                </>
              ) : (
                <>
                  Continuar
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
