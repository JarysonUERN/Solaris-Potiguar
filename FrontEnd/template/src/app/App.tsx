import { useState } from "react";
import {
  Sun,
  Battery,
  Zap,
  Wind,
  CloudSun,
  Cloud,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Check,
  Cpu,
  BarChart2,
  Thermometer,
  Clock,
  Layers,
  Sparkles,
  Menu,
  X,
  MapPin,
  AlertCircle,
  RefreshCw,
  History,
  Brain,
  Bot,
  Network,
} from "lucide-react";

type Screen = "landing" | "onboarding" | "dashboard" | "result";

interface PropertyConfig {
  name: string;
  city: string;
  capacity: string;
  storage: string;
  consumption: string;
  peakHour: "morning" | "afternoon" | "night";
}

interface Analysis {
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

const mockAnalyses: Analysis[] = [
  {
    id: "a1",
    time: "Hoje, 14:23",
    summary: "Geração excelente — acumule para a noite",
    agents: {
      meteo:
        "Irradiância solar atual de 847 W/m². Temperatura ambiente de 32°C com índice UV 9. Previsão para as próximas 6h: nuvens esparsas entre 16h e 17h30, redução estimada de 18% na geração nesse período. Nenhuma precipitação prevista. Condições ideais de geração até o pôr do sol às 17h51.",
      consumption:
        "Consumo atual em 2,3 kW, dentro do padrão histórico para terça-feira à tarde. Com base no perfil cadastrado (pico noturno entre 19h e 22h), a demanda deve escalar para 4,1 kW após as 18h. O sistema está consumindo 31% abaixo da geração atual — excedente disponível para armazenamento.",
      storage:
        "Bateria em 67% de carga (8,0 kWh de 12 kWh). Taxa de carga atual: 1,8 kW. Com o excedente disponível, a bateria deve atingir 95% até as 17h, antes da queda de geração. Capacidade suficiente para cobrir o pico noturno projetado sem recorrer à rede.",
    },
    synthesis:
      "Condições excelentes de geração hoje. Mantenha cargas não essenciais ligadas agora para aproveitar o excedente solar. Sua bateria vai carregar completamente antes do anoitecer e terá energia suficiente para o pico da noite sem custo da rede. Economia estimada hoje: R$ 18,40.",
  },
  {
    id: "a2",
    time: "Hoje, 08:07",
    summary: "Manhã nublada — priorize o essencial",
    agents: {
      meteo:
        "Céu encoberto com nebulosidade em 80%. Irradiância reduzida para 210 W/m². Previsão de abertura do sol após 10h30, com potencial de recuperação para 650 W/m² no período da tarde.",
      consumption:
        "Consumo matinal em 3,1 kW — ligeiramente acima do padrão por conta do dia nublado e uso de iluminação artificial. Geração atual cobre apenas 35% da demanda.",
      storage:
        "Bateria em 54% após cobrir parte do consumo noturno. Recomendável poupar armazenamento para cobrir eventual tarde nublada.",
    },
    synthesis:
      "Manhã desafiadora. A geração está baixa agora, mas o sol deve abrir por volta das 10h30. Desligue aparelhos não essenciais até lá e preserve a bateria — ela pode ser necessária se a tarde vier encoberta novamente.",
  },
  {
    id: "a3",
    time: "Ontem, 19:41",
    summary: "Bateria suficiente para a noite toda",
    agents: {
      meteo:
        "Dia de sol pleno encerrado. Geração acumulada hoje: 38,2 kWh — 12% acima da média sazonal.",
      consumption:
        "Pico noturno projetado entre 19h e 22h: estimativa de 11,4 kWh de demanda. Consumo acumulado do dia dentro do esperado.",
      storage:
        "Bateria em 98% (11,7 kWh). Capacidade plenamente suficiente para cobrir o pico projetado e ainda manter reserva de 15% para a madrugada.",
    },
    synthesis:
      "Excelente dia de geração. Sua bateria está praticamente cheia e vai cobrir toda a noite sem precisar da rede elétrica. Você evitou o horário de ponta tarifária completamente hoje — economia estimada de R$ 23,10.",
  },
];

const weatherData = {
  temp: 34,
  condition: "Ensolarado",
  uv: 9,
  wind: 12,
  humidity: 58,
  forecast: [
    { hour: "Agora", icon: "sun", temp: 34 },
    { hour: "15h", icon: "sun", temp: 35 },
    { hour: "16h", icon: "cloud-sun", temp: 33 },
    { hour: "17h", icon: "cloud-sun", temp: 31 },
    { hour: "18h", icon: "cloud", temp: 29 },
    { hour: "19h", icon: "cloud", temp: 27 },
  ],
};

function WeatherIcon({ type, size = 20 }: { type: string; size?: number }) {
  if (type === "sun") return <Sun size={size} className="text-primary" />;
  if (type === "cloud-sun") return <CloudSun size={size} className="text-yellow-400" />;
  return <Cloud size={size} className="text-muted-foreground" />;
}

// ─── LANDING PAGE ─────────────────────────────────────────────────
function LandingPage({ onEnter }: { onEnter: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <Sun size={14} className="text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground tracking-tight">SolarMind</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#como-funciona" className="hover:text-foreground transition-colors">Como funciona</a>
            <a href="#agentes" className="hover:text-foreground transition-colors">Agentes</a>
            <a href="#beneficios" className="hover:text-foreground transition-colors">Benefícios</a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onEnter}
              className="text-sm px-4 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all"
            >
              Entrar
            </button>
            <button
              onClick={onEnter}
              className="text-sm px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all"
            >
              Começar grátis
            </button>
          </div>

          <button
            className="md:hidden text-muted-foreground hover:text-foreground"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-border bg-background px-6 py-4 flex flex-col gap-4">
            <a href="#como-funciona" className="text-sm text-muted-foreground" onClick={() => setMenuOpen(false)}>Como funciona</a>
            <a href="#agentes" className="text-sm text-muted-foreground" onClick={() => setMenuOpen(false)}>Agentes</a>
            <a href="#beneficios" className="text-sm text-muted-foreground" onClick={() => setMenuOpen(false)}>Benefícios</a>
            <button onClick={onEnter} className="mt-2 w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium">
              Começar grátis
            </button>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-mono mb-6">
              <Sparkles size={11} />
              Multi-agentes de IA · Rio Grande do Norte
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-[1.15] mb-5">
              Energia solar gerenciada por{" "}
              <span className="text-primary">inteligência</span>, não por dashboards
            </h1>

            <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-md">
              Três agentes de IA analisam clima, consumo e armazenamento em tempo real. Você recebe uma recomendação direta em linguagem natural — sem gráficos, sem confusão.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onEnter}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all group"
              >
                Configurar minha propriedade
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
              <a
                href="#como-funciona"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all text-sm"
              >
                Ver como funciona
              </a>
            </div>

            <div className="mt-8 flex items-center gap-6">
              {[
                { value: "38+", label: "kWh analisados/dia" },
                { value: "3", label: "agentes ativos" },
                { value: "R$ 847", label: "economia/mês média" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-xl font-bold text-foreground font-mono">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden border border-border bg-card">
              <img
                src="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=500&fit=crop&auto=format"
                alt="Painéis solares em propriedade rural com céu azul"
                className="w-full h-64 object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />

              {/* Floating card */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-card/90 backdrop-blur border border-border">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Brain size={14} className="text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground font-mono mb-1">Orquestrador · agora</div>
                    <p className="text-sm text-foreground leading-snug">
                      "Condições excelentes. Mantenha as cargas ligadas agora — sua bateria vai carregar antes do anoitecer. Economia estimada hoje: <span className="text-primary font-semibold">R$ 18,40</span>."
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative glow */}
            <div className="absolute -top-8 -right-8 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="como-funciona" className="py-20 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="text-xs font-mono text-primary mb-3 uppercase tracking-widest">Processo</div>
            <h2 className="text-3xl font-bold text-foreground">Três passos, uma resposta</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                icon: <MapPin size={20} className="text-primary" />,
                title: "Configure sua propriedade",
                desc: "Informe capacidade dos painéis, armazenamento em bateria e padrão de consumo. Feito uma vez, usado para sempre.",
              },
              {
                step: "02",
                icon: <Bot size={20} className="text-accent" />,
                title: "Agentes analisam tudo",
                desc: "Clima em tempo real via Open-Meteo, consumo histórico e estado da bateria são processados simultaneamente por três IAs.",
              },
              {
                step: "03",
                icon: <Sparkles size={20} className="text-yellow-400" />,
                title: "Recomendação em linguagem natural",
                desc: "Nada de gráfico. O orquestrador sintetiza tudo numa frase clara e acionável para você decidir agora.",
              },
            ].map((item) => (
              <div key={item.step} className="relative p-6 rounded-xl border border-border bg-card hover:border-primary/20 transition-colors group">
                <div className="text-5xl font-black text-foreground/5 font-mono absolute top-4 right-5 select-none group-hover:text-foreground/8 transition-colors">
                  {item.step}
                </div>
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agents */}
      <section id="agentes" className="py-20 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-xs font-mono text-primary mb-3 uppercase tracking-widest">Multi-agentes</div>
              <h2 className="text-3xl font-bold text-foreground mb-5">
                Três especialistas trabalhando em paralelo
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Cada agente tem uma especialidade distinta. O orquestrador ouve os três e entrega uma recomendação única — transparente e rastreável.
              </p>

              <div className="space-y-4">
                {[
                  {
                    icon: <CloudSun size={16} className="text-primary" />,
                    name: "Agente Meteorológico",
                    desc: "Irradiância, temperatura, nuvens e previsão horária via Open-Meteo API",
                    color: "bg-primary/10 border-primary/20",
                  },
                  {
                    icon: <Zap size={16} className="text-blue-400" />,
                    name: "Agente de Consumo",
                    desc: "Padrão histórico, pico tarifário e demanda projetada para as próximas horas",
                    color: "bg-blue-500/10 border-blue-500/20",
                  },
                  {
                    icon: <Battery size={16} className="text-accent" />,
                    name: "Agente de Armazenamento",
                    desc: "Estado da bateria, taxa de carga/descarga e autonomia disponível",
                    color: "bg-accent/10 border-accent/20",
                  },
                ].map((agent) => (
                  <div key={agent.name} className={`flex gap-3 p-4 rounded-lg border ${agent.color}`}>
                    <div className="w-8 h-8 rounded-md bg-secondary flex items-center justify-center flex-shrink-0">
                      {agent.icon}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">{agent.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{agent.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="p-5 rounded-2xl border border-border bg-card space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground border-b border-border pb-3 mb-1">
                  <Network size={12} />
                  Raciocínio em tempo real
                </div>
                {[
                  { label: "METEO", color: "text-primary bg-primary/10", text: "Irradiância: 847 W/m² · UV: 9 · Nuvens às 16h" },
                  { label: "CONSUMO", color: "text-blue-400 bg-blue-500/10", text: "Demanda atual: 2,3 kW · Pico previsto 19h: 4,1 kW" },
                  { label: "STORAGE", color: "text-accent bg-accent/10", text: "Bateria: 67% · Autonomia noturna: garantida" },
                  { label: "SÍNTESE", color: "text-yellow-300 bg-yellow-400/10", text: "Geração excedente → carregar bateria agora → cobrir pico noturno sem rede" },
                ].map((row) => (
                  <div key={row.label} className="flex items-start gap-3 text-xs">
                    <span className={`font-mono px-1.5 py-0.5 rounded text-[10px] font-bold flex-shrink-0 ${row.color}`}>
                      {row.label}
                    </span>
                    <span className="text-muted-foreground leading-relaxed">{row.text}</span>
                  </div>
                ))}
                <div className="mt-4 pt-3 border-t border-border rounded-lg bg-secondary/50 p-3">
                  <p className="text-sm text-foreground leading-snug">
                    "Mantenha as cargas ligadas agora. A bateria vai completar a carga antes do pôr do sol e cobrirá toda a noite — <span className="text-primary font-medium">economia de R$ 18,40</span>."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="beneficios" className="py-20 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="text-xs font-mono text-primary mb-3 uppercase tracking-widest">Por que SolarMind</div>
            <h2 className="text-3xl font-bold text-foreground">Feito para o sertão do RN</h2>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <Sun size={18} className="text-primary" />, title: "Clima local", desc: "Dados de irradiância específicos para o semiárido nordestino" },
              { icon: <Zap size={18} className="text-accent" />, title: "Sem gráficos", desc: "Recomendação direta. O que fazer agora, em português claro" },
              { icon: <Battery size={18} className="text-blue-400" />, title: "Offline-first", desc: "Funciona mesmo com conexão instável no interior" },
              { icon: <BarChart2 size={18} className="text-yellow-400" />, title: "Histórico", desc: "Acompanhe o padrão de decisões e a economia acumulada" },
            ].map((b) => (
              <div key={b.title} className="p-5 rounded-xl border border-border bg-card hover:bg-secondary/30 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center mb-3">
                  {b.icon}
                </div>
                <div className="font-medium text-foreground text-sm mb-1">{b.title}</div>
                <div className="text-xs text-muted-foreground leading-relaxed">{b.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-border">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center mx-auto mb-6">
            <Sun size={24} className="text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">Pronto para gerenciar com inteligência?</h2>
          <p className="text-muted-foreground mb-8">
            Configure sua propriedade em menos de 2 minutos e receba sua primeira análise hoje.
          </p>
          <button
            onClick={onEnter}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all group"
          >
            Começar agora, gratuitamente
            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-primary/15 flex items-center justify-center">
              <Sun size={10} className="text-primary" />
            </div>
            <span>SolarMind · Rio Grande do Norte</span>
          </div>
          <div className="flex gap-6">
            <span>Clima: Open-Meteo API</span>
            <span>IA: Multi-agent LLM</span>
            <span>MVP 2024</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── ONBOARDING ───────────────────────────────────────────────────
function OnboardingScreen({ onComplete }: { onComplete: (config: PropertyConfig) => void }) {
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
    else onComplete(config);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top bar */}
      <div className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-primary/15 flex items-center justify-center">
            <Sun size={12} className="text-primary" />
          </div>
          <span className="text-sm font-semibold">SolarMind</span>
        </div>
        <div className="text-xs text-muted-foreground font-mono">
          Configuração inicial · {step + 1} de 3
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg">
          {/* Progress */}
          <div className="flex gap-2 mb-10">
            {steps.map((s, i) => (
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

          {/* Step 0 */}
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

          {/* Step 1 */}
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

          {/* Step 2 */}
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
                    { value: "morning", label: "Manhã", sub: "06h–12h", icon: <Sun size={14} /> },
                    { value: "afternoon", label: "Tarde", sub: "12h–18h", icon: <Thermometer size={14} /> },
                    { value: "night", label: "Noite", sub: "18h–23h", icon: <Clock size={14} /> },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setConfig({ ...config, peakHour: opt.value as PropertyConfig["peakHour"] })}
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

          {/* Navigation */}
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

// ─── DASHBOARD ────────────────────────────────────────────────────
function DashboardScreen({
  config,
  analyses,
  onAnalyze,
  onOpenResult,
  analyzing,
}: {
  config: PropertyConfig;
  analyses: Analysis[];
  onAnalyze: () => void;
  onOpenResult: (a: Analysis) => void;
  analyzing: boolean;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-primary/15 flex items-center justify-center">
              <Sun size={13} className="text-primary" />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">{config.name}</div>
              <div className="text-[11px] text-muted-foreground font-mono flex items-center gap-1">
                <MapPin size={9} />
                {config.city}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <Cpu size={12} />
            {config.capacity} kWp · {config.storage || "0"} kWh batt
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {/* Weather Card */}
        <div className="p-5 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between mb-4">
            <div className="text-xs font-mono text-muted-foreground flex items-center gap-1.5">
              <CloudSun size={12} className="text-primary" />
              CLIMA AGORA · {config.city.toUpperCase()}
            </div>
            <div className="text-[10px] font-mono text-muted-foreground">Open-Meteo API</div>
          </div>

          <div className="flex items-center gap-4 mb-5">
            <Sun size={40} className="text-primary" />
            <div>
              <div className="text-4xl font-bold text-foreground font-mono">{weatherData.temp}°</div>
              <div className="text-sm text-muted-foreground">{weatherData.condition}</div>
            </div>
            <div className="ml-auto grid grid-cols-2 gap-x-6 gap-y-1 text-right">
              <div className="text-xs text-muted-foreground">UV</div>
              <div className="text-xs font-mono text-foreground">{weatherData.uv}</div>
              <div className="text-xs text-muted-foreground">Vento</div>
              <div className="text-xs font-mono text-foreground">{weatherData.wind} km/h</div>
              <div className="text-xs text-muted-foreground">Umidade</div>
              <div className="text-xs font-mono text-foreground">{weatherData.humidity}%</div>
            </div>
          </div>

          {/* 6h forecast */}
          <div className="grid grid-cols-6 gap-1 border-t border-border pt-4">
            {weatherData.forecast.map((f) => (
              <div key={f.hour} className="flex flex-col items-center gap-1.5">
                <div className="text-[10px] font-mono text-muted-foreground">{f.hour}</div>
                <WeatherIcon type={f.icon} size={16} />
                <div className="text-xs font-mono text-foreground">{f.temp}°</div>
              </div>
            ))}
          </div>
        </div>

        {/* Analyze Button */}
        <button
          onClick={onAnalyze}
          disabled={analyzing}
          className={`w-full py-4 rounded-xl font-semibold text-base transition-all flex items-center justify-center gap-3 ${
            analyzing
              ? "bg-secondary text-muted-foreground cursor-not-allowed"
              : "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.99]"
          }`}
        >
          {analyzing ? (
            <>
              <RefreshCw size={18} className="animate-spin" />
              Agentes analisando…
            </>
          ) : (
            <>
              <Sparkles size={18} />
              Analisar agora
            </>
          )}
        </button>

        {/* Latest Result */}
        {analyses.length > 0 && (
          <div
            className="p-5 rounded-xl border border-primary/20 bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors group"
            onClick={() => onOpenResult(analyses[0])}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-mono text-primary">
                <Brain size={12} />
                RECOMENDAÇÃO · {analyses[0].time}
              </div>
              <ChevronRight size={16} className="text-primary/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </div>
            <p className="text-foreground leading-relaxed">{analyses[0].synthesis}</p>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-primary/70 group-hover:text-primary transition-colors">
              <Layers size={11} />
              Ver raciocínio dos 3 agentes
            </div>
          </div>
        )}

        {/* History */}
        {analyses.length > 1 && (
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-3">
              <History size={11} />
              ANÁLISES ANTERIORES
            </div>
            <div className="space-y-2">
              {analyses.slice(1, 3).map((a) => (
                <button
                  key={a.id}
                  onClick={() => onOpenResult(a)}
                  className="w-full text-left p-4 rounded-lg border border-border bg-card hover:bg-secondary/30 hover:border-primary/20 transition-all group flex items-start justify-between gap-3"
                >
                  <div>
                    <div className="text-xs font-mono text-muted-foreground mb-1">{a.time}</div>
                    <div className="text-sm text-foreground">{a.summary}</div>
                  </div>
                  <ChevronRight size={14} className="text-muted-foreground mt-0.5 flex-shrink-0 group-hover:text-primary transition-colors" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* System status */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Geração", value: "6,2 kW", sub: "atual", icon: <Sun size={13} className="text-primary" />, color: "text-primary" },
            { label: "Consumo", value: "2,3 kW", sub: "atual", icon: <Zap size={13} className="text-blue-400" />, color: "text-blue-400" },
            { label: "Bateria", value: "67%", sub: "8,0 / 12 kWh", icon: <Battery size={13} className="text-accent" />, color: "text-accent" },
          ].map((stat) => (
            <div key={stat.label} className="p-4 rounded-lg border border-border bg-card">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                {stat.icon}
                {stat.label}
              </div>
              <div className={`text-xl font-bold font-mono ${stat.color}`}>{stat.value}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5 font-mono">{stat.sub}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

// ─── RESULT EXPANDED ──────────────────────────────────────────────
function ResultScreen({ analysis, onBack }: { analysis: Analysis; onBack: () => void }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border px-6 py-4 sticky top-0 bg-background/95 backdrop-blur z-10">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft size={16} />
            Dashboard
          </button>
          <div className="h-4 w-px bg-border" />
          <div className="text-xs font-mono text-muted-foreground">{analysis.time}</div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-5">
        {/* Synthesis */}
        <div className="p-5 rounded-xl border border-primary/25 bg-primary/8">
          <div className="flex items-center gap-2 text-xs font-mono text-primary mb-3">
            <Brain size={12} />
            SÍNTESE DO ORQUESTRADOR
          </div>
          <p className="text-foreground text-lg leading-relaxed">{analysis.synthesis}</p>
        </div>

        <div className="text-xs font-mono text-muted-foreground py-2 flex items-center gap-2">
          <Network size={11} />
          RACIOCÍNIO INDIVIDUAL DOS AGENTES
        </div>

        {/* Agent cards */}
        {[
          {
            key: "meteo",
            icon: <CloudSun size={15} className="text-primary" />,
            label: "Agente Meteorológico",
            badge: "METEO",
            badgeColor: "bg-primary/15 text-primary border-primary/25",
            borderColor: "border-primary/15",
            text: analysis.agents.meteo,
          },
          {
            key: "consumption",
            icon: <Zap size={15} className="text-blue-400" />,
            label: "Agente de Consumo",
            badge: "CONSUMO",
            badgeColor: "bg-blue-500/15 text-blue-400 border-blue-500/25",
            borderColor: "border-blue-500/15",
            text: analysis.agents.consumption,
          },
          {
            key: "storage",
            icon: <Battery size={15} className="text-accent" />,
            label: "Agente de Armazenamento",
            badge: "STORAGE",
            badgeColor: "bg-accent/15 text-accent border-accent/25",
            borderColor: "border-accent/15",
            text: analysis.agents.storage,
          },
        ].map((agent) => (
          <div key={agent.key} className={`p-5 rounded-xl border ${agent.borderColor} bg-card`}>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                {agent.icon}
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">{agent.label}</div>
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${agent.badgeColor}`}>
                  {agent.badge}
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{agent.text}</p>
          </div>
        ))}

        {/* Flow diagram */}
        <div className="p-5 rounded-xl border border-border bg-card">
          <div className="text-xs font-mono text-muted-foreground mb-4 flex items-center gap-1.5">
            <Cpu size={11} />
            FLUXO DE DECISÃO
          </div>
          <div className="flex items-center justify-between">
            {[
              { label: "METEO", color: "bg-primary" },
              { label: "CONSUMO", color: "bg-blue-500" },
              { label: "STORAGE", color: "bg-accent" },
            ].map((item, i) => (
              <div key={item.label} className="flex items-center gap-2">
                <div className={`${item.color} px-2.5 py-1 rounded text-[10px] font-mono font-bold text-background`}>
                  {item.label}
                </div>
                {i < 2 && <div className="text-muted-foreground text-xs">+</div>}
              </div>
            ))}
            <div className="text-muted-foreground text-xs mx-2">→</div>
            <div className="bg-yellow-400/15 border border-yellow-400/30 px-2.5 py-1 rounded text-[10px] font-mono font-bold text-yellow-300">
              SÍNTESE
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [config, setConfig] = useState<PropertyConfig | null>(null);
  const [analyses, setAnalyses] = useState<Analysis[]>(mockAnalyses);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(null);

  const handleOnboardingComplete = (cfg: PropertyConfig) => {
    setConfig(cfg);
    setScreen("dashboard");
  };

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      const newAnalysis: Analysis = {
        id: `a${Date.now()}`,
        time: "Agora",
        summary: "Geração excelente — acumule para a noite",
        agents: mockAnalyses[0].agents,
        synthesis: mockAnalyses[0].synthesis,
      };
      setAnalyses([newAnalysis, ...analyses]);
      setAnalyzing(false);
    }, 2800);
  };

  const handleOpenResult = (a: Analysis) => {
    setSelectedAnalysis(a);
    setScreen("result");
  };

  if (screen === "landing") {
    return <LandingPage onEnter={() => setScreen("onboarding")} />;
  }

  if (screen === "onboarding") {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  if (screen === "result" && selectedAnalysis) {
    return (
      <ResultScreen
        analysis={selectedAnalysis}
        onBack={() => setScreen("dashboard")}
      />
    );
  }

  return (
    <DashboardScreen
      config={config ?? { name: "Fazenda Demo", city: "Mossoró, RN", capacity: "8.5", storage: "12", consumption: "450", peakHour: "night" }}
      analyses={analyses}
      onAnalyze={handleAnalyze}
      onOpenResult={handleOpenResult}
      analyzing={analyzing}
    />
  );
}
