import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sun, MapPin, AlertCircle, ChevronLeft, ChevronRight,
  Check, Thermometer, Clock
} from "lucide-react";
import type { PropertyConfig } from "../types";

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
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <div className="border-b border-border px-6 py-4 flex items-center justify-between">
        <button onClick={() => navigate("/")} className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-primary/15 flex items-center justify-center">
            <Sun size={12} className="text-primary" />
          </div>
          <span className="text-sm font-semibold">SolarMind</span>
        </button>
        <div className="text-xs text-muted-foreground font-mono">
          Configuração inicial · {step + 1} de 3
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg">
          <div className="flex gap-2 mb-10">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                  i <= step ? "bg-primary" : "bg-secondary"
                }`}
              />
            ))}
          </div>

          <div className="mb-8">
            <div className="text-xs font-mono text-primary mb-2 uppercase tracking-widest">
              Passo {step + 1}
            </div>
            <h1 className="text-2xl font-bold text-foreground">{steps[step].title}</h1>
            <p className="text-muted-foreground mt-1 text-sm">{steps[step].subtitle}</p>
          </div>

          {step === 0 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Nome da propriedade
                </label>
                <input
                  type="text"
                  placeholder="Ex: Fazenda Boa Vista"
                  value={config.name}
                  onChange={(e) => setConfig({ ...config, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Cidade / Região no RN
                </label>
                <div className="relative">
                  <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Ex: Mossoró, Caicó, Serra do Mel…"
                    value={config.city}
                    onChange={(e) => setConfig({ ...config, city: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all"
                  />
                </div>
              </div>
              <div className="pt-2 p-4 rounded-lg bg-secondary/50 border border-border flex gap-2.5">
                <AlertCircle size={14} className="text-muted-foreground flex-shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  A localização é usada para buscar dados climáticos da Open-Meteo API automaticamente.
                </p>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Capacidade de geração (kWp)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Ex: 8.5"
                    value={config.capacity}
                    onChange={(e) => setConfig({ ...config, capacity: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all pr-16"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground">kWp</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">Soma dos painéis instalados. Informe 0 se não souber.</p>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Capacidade de armazenamento (kWh)
                  <span className="ml-2 text-xs font-normal text-muted-foreground">— opcional</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Ex: 12.0 — ou 0 se não tiver bateria"
                    value={config.storage}
                    onChange={(e) => setConfig({ ...config, storage: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all pr-16"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground">kWh</span>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Consumo médio mensal (kWh)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Ex: 450"
                    value={config.consumption}
                    onChange={(e) => setConfig({ ...config, consumption: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all pr-16"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground">kWh/mês</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">Encontre na sua fatura de energia da Cosern.</p>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Horário de maior consumo
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "morning" as const, label: "Manhã", sub: "06h–12h", icon: <Sun size={14} /> },
                    { value: "afternoon" as const, label: "Tarde", sub: "12h–18h", icon: <Thermometer size={14} /> },
                    { value: "night" as const, label: "Noite", sub: "18h–23h", icon: <Clock size={14} /> },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setConfig({ ...config, peakHour: opt.value })}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border text-center transition-all ${
                        config.peakHour === opt.value
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-secondary text-muted-foreground hover:border-foreground/20 hover:text-foreground"
                      }`}
                    >
                      {opt.icon}
                      <div className="text-xs font-medium">{opt.label}</div>
                      <div className="text-[10px] font-mono opacity-70">{opt.sub}</div>
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
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
              Voltar
            </button>

            <button
              onClick={handleNext}
              disabled={!canAdvance()}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
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
