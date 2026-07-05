import { style } from "../styles/styles.js";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ChevronLeft, Brain, Network, CloudSun, Zap, Battery, Cpu
} from "lucide-react";
import type { AnalysisResponse } from "../types/index.js";
import { useLanguage } from "../i18n/index.js";
import LangSelector from "../components/LangSelector.js";

export default function Result() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
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
            {t("result.dashboard")}
          </button>
          <div className={style.divider} />
          <div className={style.textMonoXs}>{new Date(analysis.date).toLocaleString("pt-BR")}</div>
          <div className="ml-auto">
            <LangSelector />
          </div>
        </div>
      </header>

      <main className={style.containerSmSpaceY5}>
        <div className={style.cardPrimary}>
          <div className="flex items-center gap-2 text-xs font-mono text-primary mb-3">
            <Brain size={12} />
            {t("result.orchestrator")}
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
          {t("result.agents.title")}
        </div>

        {[
          {
            key: "meteo",
            icon: <CloudSun size={15} className={style.textPrimary} />,
            labelKey: "result.agent.meteo",
            badge: "METEO",
            badgeColor: "bg-primary/15 text-primary border-primary/25",
            borderColor: "border-primary/15",
            fallbackKey: "result.agent.meteo.fallback",
            text: genInsight,
          },
          {
            key: "consumption",
            icon: <Zap size={15} className={style.textBlue} />,
            labelKey: "result.agent.consumption",
            badge: "CONSUMO",
            badgeColor: "bg-blue-500/15 text-blue-400 border-blue-500/25",
            borderColor: "border-blue-500/15",
            fallbackKey: "result.agent.consumption.fallback",
            text: consInsight,
          },
          {
            key: "storage",
            icon: <Battery size={15} className={style.textAccent} />,
            labelKey: "result.agent.storage",
            badge: "STORAGE",
            badgeColor: "bg-accent/15 text-accent border-accent/25",
            borderColor: "border-accent/15",
            fallbackKey: "result.agent.storage.fallback",
            text: storInsight,
          },
        ].map((agent) => (
          <div key={agent.key} className={style.cardAgentResult(agent.borderColor)}>
            <div className="flex items-center gap-2.5 mb-3">
              <div className={style.iconBoxResultSm}>
                {agent.icon}
              </div>
              <div>
                <div className={style.subtitleCard}>{t(agent.labelKey)}</div>
                <span className={style.badgeAgent(agent.badgeColor)}>
                  {agent.badge}
                </span>
              </div>
            </div>
            <p className={style.textSmMutedLeading5}>
              {agent.text || t(agent.fallbackKey)}
            </p>
          </div>
        ))}

        <div className={style.flowBox}>
          <div className={style.flowHeader}>
            <Cpu size={11} />
            {t("result.flow")}
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
              {t("result.flow.synthesis")}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { labelKey: "result.stats.generation", value: `${analysis.energy.generation_kwh.toFixed(1)} kWh`, color: "text-primary" },
            { labelKey: "result.stats.consumption", value: `${analysis.energy.consumption_kwh.toFixed(1)} kWh`, color: "text-blue-400" },
            { labelKey: "result.stats.balance", value: `${analysis.energy.balance_kwh.toFixed(1)} kWh`, color: analysis.energy.balance_kwh >= 0 ? "text-green-400" : "text-red-400" },
          ].map((s) => (
            <div key={s.labelKey} className="p-3 rounded-lg border border-border bg-card text-center">
              <div className="text-xs text-muted-foreground font-mono mb-1">{t(s.labelKey)}</div>
              <div className={`text-lg font-bold font-mono ${s.color}`}>{s.value}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
