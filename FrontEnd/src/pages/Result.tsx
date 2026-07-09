import { style } from "../styles/styles.js";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ChevronLeft, Brain, Network, CloudSun, Zap, Battery, Cpu, MessageCircle
} from "lucide-react";
import type { AnalysisResponse } from "../types/index.js";
import { useLanguage } from "../i18n/index.js";
import LangSelector from "../components/LangSelector.js";
import SolarisP from "../assets/images/SolarisP.png";

export default function Result() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const analysis = (location.state as { analysis?: AnalysisResponse })?.analysis;

  if (!analysis) {
    navigate("/dashboard", { replace: true });
    return null;
  }

  const agentWeather = analysis.agents?.weather;
  const agentConsumption = analysis.agents?.consumption;
  const agentStorage = analysis.agents?.storage;
  const recommendation = analysis.recommendation;
  const simplified = analysis.simplified;

  const analysisDate = analysis.analysis_date || analysis.date || "";
  const genSummary = agentWeather?.summary || analysis.raw_data?.insights?.generation || "";
  const consSummary = agentConsumption?.consumption_profile
    ? `${agentConsumption.consumption_profile} · ${agentConsumption.recommended_operation_window}`
    : analysis.raw_data?.insights?.consumption || "";
  const storSummary = agentStorage?.battery_available !== undefined
    ? (agentStorage.battery_available ? `Battery ${agentStorage.battery_strategy} (${agentStorage.battery_capacity} kWh)` : "No battery")
    : analysis.raw_data?.insights?.storage || "";

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
          <img
            src={SolarisP}
            alt="Solaris Potiguar"
            className="h-8 w-auto object-contain"
          />
          <div className={style.divider} />
          <div className={style.textMonoXs}>{new Date(analysisDate).toLocaleString("pt-BR")}</div>
          <div className="ml-auto">
            <LangSelector />
          </div>
        </div>
      </header>

      <main className={style.containerSmSpaceY5}>
        {simplified?.simplified_text ? (
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-center gap-2 text-xs font-mono text-primary mb-2">
              <MessageCircle size={12} />
              {t("result.simplified")}
            </div>
            <p className="text-base text-foreground leading-relaxed">
              {simplified.simplified_text}
            </p>
          </div>
        ) : null}

        <div className={style.cardPrimary}>
          <div className="flex items-center gap-2 text-xs font-mono text-primary mb-3">
            <Brain size={12} />
            {t("result.orchestrator")}
          </div>
          <p className={style.textLgForeground}>{recommendation?.summary || analysis.insights?.executive_summary}</p>
          {recommendation?.recommendation ? (
            <div className="mt-3 space-y-1">
              {recommendation.recommendation.split("\n").filter(Boolean).map((r, i) => (
                <p key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  {r}
                </p>
              ))}
            </div>
          ) : null}
          {recommendation?.expected_benefit ? (
            <div className="mt-2 text-xs text-muted-foreground italic">
              {recommendation.expected_benefit}
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
            text: genSummary,
            reasoning: agentWeather?.reasoning,
            extra: agentWeather ? `${agentWeather.solar_conditions} · risk: ${agentWeather.weather_risk}` : "",
          },
          {
            key: "consumption",
            icon: <Zap size={15} className={style.textBlue} />,
            labelKey: "result.agent.consumption",
            badge: "CONSUMO",
            badgeColor: "bg-blue-500/15 text-blue-400 border-blue-500/25",
            borderColor: "border-blue-500/15",
            fallbackKey: "result.agent.consumption.fallback",
            text: consSummary,
            reasoning: agentConsumption?.reasoning,
            extra: agentConsumption ? `${agentConsumption.flexibility} · window: ${agentConsumption.recommended_operation_window}` : "",
          },
          {
            key: "storage",
            icon: <Battery size={15} className={style.textAccent} />,
            labelKey: "result.agent.storage",
            badge: "STORAGE",
            badgeColor: "bg-accent/15 text-accent border-accent/25",
            borderColor: "border-accent/15",
            fallbackKey: "result.agent.storage.fallback",
            text: storSummary,
            reasoning: agentStorage?.reasoning,
            extra: agentStorage?.battery_available ? `${agentStorage.battery_strategy} · ${agentStorage.battery_capacity} kWh` : "",
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
            {agent.reasoning && agent.reasoning.length > 0 && (
              <div className="mt-2 space-y-0.5">
                {agent.reasoning.map((r, i) => (
                  <p key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                    <span className="text-primary/60 mt-0.5">—</span>
                    {r}
                  </p>
                ))}
              </div>
            )}
            {agent.extra ? (
              <div className="mt-1.5 text-[10px] font-mono text-muted-foreground/60 uppercase tracking-wider">
                {agent.extra}
              </div>
            ) : null}
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
