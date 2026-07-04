import { style } from "../styles/styles.js";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ChevronLeft, Brain, Network, CloudSun, Zap, Battery, Cpu
} from "lucide-react";
import type { AnalysisResponse } from "../types/index.js";

export default function Result() {
  const navigate = useNavigate();
  const location = useLocation();
  const analysis = (location.state as { analysis?: AnalysisResponse })?.analysis;

  if (!analysis) {
    navigate("/dashboard", { replace: true });
    return null;
  }

  const genInsight = analysis.raw_data?.insights?.generation || "";
  const consInsight = analysis.raw_data?.insights?.consumption || "";
  const storInsight = analysis.raw_data?.insights?.storage || "";

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
          <div className={style.textMonoXs}>{new Date(analysis.date).toLocaleString("pt-BR")}</div>
        </div>
      </header>

      <main className={style.containerSmSpaceY5}>
        <div className={style.cardPrimary}>
          <div className="flex items-center gap-2 text-xs font-mono text-primary mb-3">
            <Brain size={12} />
            SÍNTESE DO ORQUESTRADOR
          </div>
          <p className={style.textLgForeground}>{analysis.insights.executive_summary}</p>
          {analysis.insights.recommendations ? (
            <div className="mt-3 space-y-1">
              {analysis.insights.recommendations.split("\n").filter(Boolean).map((r, i) => (
                <p key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  {r}
                </p>
              ))}
            </div>
          ) : null}
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
            text: genInsight || "Análise baseada em dados climáticos do Open-Meteo.",
          },
          {
            key: "consumption",
            icon: <Zap size={15} className={style.textBlue} />,
            label: "Agente de Consumo",
            badge: "CONSUMO",
            badgeColor: "bg-blue-500/15 text-blue-400 border-blue-500/25",
            borderColor: "border-blue-500/15",
            text: consInsight || "Análise baseada no perfil de consumo cadastrado.",
          },
          {
            key: "storage",
            icon: <Battery size={15} className={style.textAccent} />,
            label: "Agente de Armazenamento",
            badge: "STORAGE",
            badgeColor: "bg-accent/15 text-accent border-accent/25",
            borderColor: "border-accent/15",
            text: storInsight || "Análise baseada no estado atual da bateria.",
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

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Geração", value: `${analysis.energy.generation_kwh.toFixed(1)} kWh`, color: "text-primary" },
            { label: "Consumo", value: `${analysis.energy.consumption_kwh.toFixed(1)} kWh`, color: "text-blue-400" },
            { label: "Saldo", value: `${analysis.energy.balance_kwh.toFixed(1)} kWh`, color: analysis.energy.balance_kwh >= 0 ? "text-green-400" : "text-red-400" },
          ].map((s) => (
            <div key={s.label} className="p-3 rounded-lg border border-border bg-card text-center">
              <div className="text-xs text-muted-foreground font-mono mb-1">{s.label}</div>
              <div className={`text-lg font-bold font-mono ${s.color}`}>{s.value}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
