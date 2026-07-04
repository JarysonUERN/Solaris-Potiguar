import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Sun, MapPin, CircleAlert, ChevronLeft, ChevronRight, 
  Check, Droplet, Store, House, Factory, Bird, FileText,
} from "lucide-react";

import type { PropertyConfig, Profile, LoadCurve } from "../types/index.js";
import { style } from "../styles/styles.js";


const profiles = [
  { value: "irrigacao", icon: Droplet, label: "Irrigação agrícola", description: "Pico de consumo durante o dia para bombas", color: "text-blue-400" },
  { value: "avicultura", icon: Bird, label: "Avicultura / pecuária", description: "Consumo contínuo e relativamente estável", color: "text-yellow-400" },
  { value: "comercio", icon: Store, label: "Comércio rural", description: "Pico no horário comercial, baixo à noite", color: "text-accent" },
  { value: "residencial", icon: House, label: "Residencial rural", description: "Pico manhã e noite, baixo durante o dia", color: "text-green-400" },
  { value: "agroindustria", icon: Factory, label: "Agroindústria", description: "Consumo alto e constante em horário de produção", color: "text-purple-400" },
] as const;

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
  const [step, setStep] = useState(0);
  const [config, setConfig] = useState<PropertyConfig>({
    name: "",
    city: "",
    capacity: "",
    storage: "",
    consumption: "",
    profile: "residencial",
    routine: "",
  });

  const steps = [
    { title: "Sua propriedade", subtitle: "Como você chama e onde fica?" },
    { title: "Sistema solar", subtitle: "Capacidade instalada de geração e armazenamento" },
    { title: "Perfil de consumo", subtitle: "Selecione o perfil que mais se aproxima do seu uso" },
    { title: "Rotina de consumo", subtitle: "Descreva como sua operação consome energia" },
  ];

  const canAdvance = () => {
    if (step === 0) return config.name.trim() && config.city.trim();
    if (step === 1) return config.capacity.trim();
    if (step === 2) return !!config.profile;
    if (step === 3) return true;
    return false;
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else navigate("/dashboard", { state: { config } });
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
        <div className={style.headerMono}>
          Configuração inicial · {step + 1} de 4
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
              Passo {step + 1}
            </div>
            <h1 className={style.title2xl}>{steps[step]!.title}</h1>
            <p className={style.textSmMutedTop}>{steps[step]!.subtitle}</p>
          </div>
          {step === 0 && (
            <div className={style.spaceY4}>
              <div>
                <label className={style.label}>Nome da propriedade</label>
                <input
                  type="text"
                  placeholder="Ex: Fazenda Boa Vista"
                  value={config.name}
                  onChange={(e) => setConfig({ ...config, name: e.target.value })}
                  className={style.input}
                />
              </div>
              <div>
                <label className={style.label}>Cidade / Região no RN</label>
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
                <CircleAlert size={14} className={style.textMutedFlex} />
                <p className={style.textXsLeading}>
                  A localização é usada para buscar dados climáticos da Open-Meteo API automaticamente.
                </p>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className={style.spaceY4}>
              <div>
                <label className={style.label}>Capacidade de geração (kWp)</label>
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
            <div className="space-y-5">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Escolha o perfil que melhor representa o consumo da sua propriedade.
                Cada perfil tem uma curva de carga típica baseada em dados da ANEEL.
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
                              {p.label}
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {p.description}
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
                <label className={style.label}>Consumo médio mensal (kWh)</label>
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
                <p className="text-xs text-muted-foreground mt-1.5">
                  Encontre na sua fatura de energia da Cosern.
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Descreva brevemente como funciona sua rotina de consumo de energia.
                Quanto mais detalhes, melhor o agente poderá analisar e sugerir otimizações.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className={style.label}>
                      Quais equipamentos consomem mais energia?
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Bombas de irrigação",
                        "Câmara fria",
                        "Ordenhadeira",
                        "Motores elétricos",
                        "Ventilação",
                        "Iluminação",
                        "Compressor",
                        "Silo / secador",
                      ].map((eq) => (
                        <button
                          key={eq}
                          type="button"
                          onClick={() =>
                            setConfig({
                              ...config,
                              routine: config.routine
                                ? `${config.routine}\n${eq}`
                                : eq,
                            })
                          }
                          className="px-3 py-1.5 rounded-lg border border-border bg-secondary text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground hover:bg-primary/5 transition-all active:scale-95"
                        >
                          + {eq}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Clique para adicionar à descrição abaixo.
                    </p>
                  </div>

                  <div>
                    <label className={style.label}>
                      Descrição da rotina
                      <span className="ml-2 text-xs font-normal text-muted-foreground">— opcional</span>
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
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Exemplos</p>
                  <div className={style.alertCard}>
                    <FileText size={14} className="text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-green-600">Boa descrição</p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                        "Temos uma fazenda irrigada. As bombas de irrigação funcionam normalmente das 14h às 17h. Também usamos uma câmara fria durante todo o dia. Se houver vantagem econômica, conseguimos antecipar a irrigação para o período da manhã."
                      </p>
                    </div>
                  </div>
                  <div className={style.alertCard}>
                    <CircleAlert size={14} className="text-yellow-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-yellow-600">Descrição fraca</p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                        "Tenho placas solares e gasto bastante energia."
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
              {step === 3 ? (
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
