import { style } from "../styles/styles.js";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ChevronLeft, Brain, Network, CloudSun, Zap, Battery, Cpu
} from "lucide-react";
import type { Analysis } from "../types/index.js";

export default function Result() {
  const navigate = useNavigate();
  const location = useLocation();
  const analysis = (location.state as { analysis?: Analysis })?.analysis;

  if (!analysis) {
    navigate("/dashboard", { replace: true });
    return null;
  }

  return (
    <div className={style.page}>
      <header className={style.headerSticky}>
        <div className={style.headerInnerGap3}>
          <button
            onClick={() => navigate("/dashboard")}
            className={style.btnBackResult}
          >
            <ChevronLeft size={16} />
            Dashboard
          </button>
          <div className={style.divider} />
          <div className={style.textMonoXs}>{analysis.time}</div>
        </div>
      </header>

      <main className={style.containerSmSpaceY5}>
        <div className={style.cardPrimary}>
          <div className="flex items-center gap-2 text-xs font-mono text-primary mb-3">
            <Brain size={12} />
            SÍNTESE DO ORQUESTRADOR
          </div>
          <p className={style.textLgForeground}>{analysis.synthesis}</p>
        </div>

        <div className={style.agentHeaderMuted}>
          <Network size={11} />
          RACIOCÍNIO INDIVIDUAL DOS AGENTES
        </div>

        {[
          {
            key: "meteo",
            icon: <CloudSun size={15} className={style.textPrimary} />,
            label: "Agente Meteorológico",
            badge: "METEO",
            badgeColor: "bg-primary/15 text-primary border-primary/25",
            borderColor: "border-primary/15",
            text: analysis.agents.meteo,
          },
          {
            key: "consumption",
            icon: <Zap size={15} className={style.textBlue} />,
            label: "Agente de Consumo",
            badge: "CONSUMO",
            badgeColor: "bg-blue-500/15 text-blue-400 border-blue-500/25",
            borderColor: "border-blue-500/15",
            text: analysis.agents.consumption,
          },
          {
            key: "storage",
            icon: <Battery size={15} className={style.textAccent} />,
            label: "Agente de Armazenamento",
            badge: "STORAGE",
            badgeColor: "bg-accent/15 text-accent border-accent/25",
            borderColor: "border-accent/15",
            text: analysis.agents.storage,
          },
        ].map((agent) => (
          <div key={agent.key} className={style.cardAgentResult(agent.borderColor)}>
            <div className="flex items-center gap-2.5 mb-3">
              <div className={style.iconBoxResultSm}>
                {agent.icon}
              </div>
              <div>
                <div className={style.subtitleCard}>{agent.label}</div>
                <span className={style.badgeAgent(agent.badgeColor)}>
                  {agent.badge}
                </span>
              </div>
            </div>
            <p className={style.textSmMutedLeading5}>{agent.text}</p>
          </div>
        ))}

        <div className={style.flowBox}>
          <div className={style.flowHeader}>
            <Cpu size={11} />
            FLUXO DE DECISÃO
          </div>
          <div className={style.flowRow}>
            {[
              { label: "METEO", color: "bg-primary" },
              { label: "CONSUMO", color: "bg-blue-500" },
              { label: "STORAGE", color: "bg-accent" },
            ].map((item, i) => (
              <div key={item.label} className={style.flowItem}>
                <div className={style.flowBadge(item.color)}>
                  {item.label}
                </div>
                {i < 2 && <div className={style.flowPlus}>+</div>}
              </div>
            ))}
            <div className={style.flowArrow}>→</div>
            <div className={style.flowSynthesis}>
              SÍNTESE
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
