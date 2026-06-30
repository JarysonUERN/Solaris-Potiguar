import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Sun, CloudSun, Cloud, Brain, History, Layers, Cpu, MapPin,
  RefreshCw, Sparkles, ChevronRight, Zap, Battery
} from "lucide-react";
import ThemeToggle from "../components/ThemeToggle.js";
import type { PropertyConfig, Analysis } from "../types/index.js";

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

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const savedConfig = (location.state as { config?: PropertyConfig })?.config;

  const config: PropertyConfig = savedConfig ?? {
    name: "Fazenda Demo",
    city: "Mossoró, RN",
    capacity: "8.5",
    storage: "12",
    consumption: "450",
    peakHour: "night",
  };

  const [analyses, setAnalyses] = useState<Analysis[]>(mockAnalyses);
  const [analyzing, setAnalyzing] = useState(false);

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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
          <ThemeToggle size={13} />
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

        <button
          onClick={handleAnalyze}
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

        {analyses.length > 0 && (
          <div
            className="p-5 rounded-xl border border-primary/20 bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors group"
            onClick={() => navigate("/result", { state: { analysis: analyses[0] } })}
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
                  onClick={() => navigate("/result", { state: { analysis: a } })}
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
