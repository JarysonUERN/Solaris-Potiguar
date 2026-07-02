import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Sun, CloudSun, Cloud, Brain, History, Layers, Cpu, MapPin,
  RefreshCw, Sparkles, ChevronRight, Zap, Battery
} from "lucide-react";
import ThemeToggle from "../components/ThemeToggle.js";
import type { PropertyConfig, Analysis } from "../types/index.js";
import { style } from "../styles/styles.js";
import homeIcon from "../assets/icons/home-1-svgrepo-com.svg";

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

const mockUser = {
  name: "João Silva",
  email: "demo@solaris.com",
};

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
  if (type === "sun") return <Sun size={size} className={style.textPrimary} />;
  if (type === "cloud-sun") return <CloudSun size={size} className={style.textYellow} />;
  return <Cloud size={size} className={style.textMuted} />;
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
    profile: "residencial",
  };

  const [analyses, setAnalyses] = useState<Analysis[]>(mockAnalyses);
  const [analyzing, setAnalyzing] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [userName, setUserName] = useState(mockUser.name);
  const [userEmail, setUserEmail] = useState(mockUser.email);
  const [userPassword, setUserPassword] = useState("");

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      const newAnalysis: Analysis = {
        id: `a${Date.now()}`,
        time: "Agora",
        summary: "Geração excelente — acumule para a noite",
        agents: mockAnalyses[0]!.agents,
        synthesis: mockAnalyses[0]!.synthesis,
      };
      setAnalyses([newAnalysis, ...analyses]);
      setAnalyzing(false);
    }, 2800);
  };

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={style.page}>
      <header className={style.header}>
        <div className={style.headerInner}>
          <div className={style.flexCenterGap3}>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="mr-1 flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card/80 transition-colors hover:border-primary/30 hover:bg-primary/10"
              aria-label="Voltar para a landing page"
            >
              <img src={homeIcon} alt="Ícone home" className="h-4 w-4" />
            </button>
            <ThemeToggle size={13} />
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
              <div className={style.subtitleHeader}>{userName}</div>
              <div className={style.textXs}>{userEmail}</div>
            </div>
          </div>

          <button
            onClick={() => setShowEditForm(!showEditForm)}
            className={`text-sm font-medium transition-colors ${
              showEditForm ? "text-muted-foreground" : "text-primary hover:text-primary/80"
            }`}
          >
            {showEditForm ? "Cancelar" : "Alterar informações"}
          </button>

          {showEditForm && (
            <div className="space-y-3">
              <div>
                <label className={style.label}>Nome</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className={style.input}
                />
              </div>
              <div>
                <label className={style.label}>Email</label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className={style.input}
                />
              </div>
              <div>
                <label className={style.label}>Nova senha</label>
                <input
                  type="password"
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value)}
                  className={style.input}
                  placeholder="Deixe vazio para manter"
                />
              </div>
              <button
                onClick={() => {
                  setShowEditForm(false);
                }}
                className={`${style.btnPrimarySm} w-full justify-center`}
              >
                Salvar alterações
              </button>
            </div>
          )}

          <div className="border-t border-border" />

          <button
            onClick={() => navigate("/onboarding")}
            className="text-sm text-muted-foreground hover:text-foreground border border-border rounded-lg px-4 py-2 transition-colors w-full text-center"
          >
            Refazer onboarding
          </button>
        </aside>

        <main className="flex-1 px-6 py-8 max-w-3xl space-y-6">
          <div className={style.card}>
            <div className={`${style.flexBetween} mb-4`}>
              <div className={style.textSectionLabel}>
                <CloudSun size={12} className={style.textPrimary} />
                CLIMA AGORA · {config.city.toUpperCase()}
              </div>
              <div className={style.forecastTime}>Open-Meteo API</div>
            </div>

            <div className="flex items-center gap-4 mb-5">
              <Sun size={40} className={style.textPrimary} />
              <div>
                <div className={style.text4xlMono}>{weatherData.temp}°</div>
                <div className={style.textSmMuted}>{weatherData.condition}</div>
              </div>
              <div className={style.gridStats}>
                <div className={style.textXs}>UV</div>
                <div className={style.textMonoFg}>{weatherData.uv}</div>
                <div className={style.textXs}>Vento</div>
                <div className={style.textMonoFg}>{weatherData.wind} km/h</div>
                <div className={style.textXs}>Umidade</div>
                <div className={style.textMonoFg}>{weatherData.humidity}%</div>
              </div>
            </div>

            <div className={style.gridCols6}>
              {weatherData.forecast.map((f) => (
                <div key={f.hour} className={style.flexCol}>
                  <div className={style.forecastTime}>{f.hour}</div>
                  <WeatherIcon type={f.icon} size={16} />
                  <div className={style.textMonoFg}>{f.temp}°</div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className={`${style.btnAnalyze} ${
              analyzing ? style.btnAnalyzeDisabled : style.btnAnalyzeActive
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
              className={style.cardResult}
              onClick={() => navigate("/result", { state: { analysis: analyses[0] } })}
            >
              <div className={`${style.flexBetween} mb-3`}>
                <div className={style.resultHeader}>
                  <Brain size={12} />
                  RECOMENDAÇÃO · {analyses[0]!.time}
                </div>
                <ChevronRight size={16} className={style.chevronIcon} />
              </div>
              <p className="text-foreground leading-relaxed">{analyses[0]!.synthesis}</p>
              <div className={`mt-3 ${style.analysisCard}`}>
                <Layers size={11} />
                Ver raciocínio dos 3 agentes
              </div>
            </div>
          )}

          {analyses.length > 1 && (
            <div>
              <div className={style.analysisHistoryHeader}>
                <History size={11} />
                ANÁLISES ANTERIORES
              </div>
              <div className={style.spaceY2}>
                {analyses.slice(1, 3).map((a) => (
                  <button
                    key={a.id}
                    onClick={() => navigate("/result", { state: { analysis: a } })}
                    className={style.cardHistory}
                  >
                    <div>
                      <div className={style.textResultMuted}>{a.time}</div>
                      <div className={style.textResultFg}>{a.summary}</div>
                    </div>
                    <ChevronRight size={14} className={style.btnBack} />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className={style.gridCols3}>
            {[
              { label: "Geração", value: "6,2 kW", sub: "atual", icon: <Sun size={13} className={style.textPrimary} />, color: "text-primary" },
              { label: "Consumo", value: "2,3 kW", sub: "atual", icon: <Zap size={13} className={style.textBlue} />, color: "text-blue-400" },
              { label: "Bateria", value: "67%", sub: "8,0 / 12 kWh", icon: <Battery size={13} className={style.textAccent} />, color: "text-accent" },
            ].map((stat) => (
              <div key={stat.label} className={style.cardSmall}>
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
    </div>
  );
}
