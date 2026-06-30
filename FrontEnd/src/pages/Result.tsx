import { useLocation, useNavigate } from "react-router-dom";
import {
  ChevronLeft, Brain, Network, CloudSun, Zap, Battery, Cpu
} from "lucide-react";
import type { Analysis } from "../types";

export default function Result() {
  const navigate = useNavigate();
  const location = useLocation();
  const analysis = (location.state as { analysis?: Analysis })?.analysis;

  if (!analysis) {
    navigate("/dashboard", { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border px-6 py-4 sticky top-0 bg-background/95 backdrop-blur z-10">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard")}
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
