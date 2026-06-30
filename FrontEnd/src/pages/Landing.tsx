import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sun, Sparkles, MapPin, Brain, Network, Zap, Battery,
  BarChart2, ArrowRight, Menu, X
} from "lucide-react";
import ThemeToggle from "../components/ThemeToggle.js";

export default function Landing() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ThemeToggle
              className="w-7 h-7 rounded-md flex items-center justify-center"
              iconLight="text-primary-foreground"
              iconDark="text-primary-foreground"
              bgDark="bg-primary"
              bgLight="bg-blue-900"
            />
            <span className="font-semibold text-foreground tracking-tight"> Solaris Potiguar</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#como-funciona" className="hover:text-foreground transition-colors">Como funciona</a>
            <a href="#agentes" className="hover:text-foreground transition-colors">Agentes</a>
            <a href="#beneficios" className="hover:text-foreground transition-colors">Benefícios</a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate("/onboarding")}
              className="text-sm px-4 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all"
            >
              Entrar
            </button>
            <button
              onClick={() => navigate("/onboarding")}
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
            <button onClick={() => navigate("/onboarding")} className="mt-2 w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium">
              Começar grátis
            </button>
          </div>
        )}
      </nav>

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
                onClick={() => navigate("/onboarding")}
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

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden border border-border bg-card">
              <img
                src="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=500&fit=crop&auto=format"
                alt="Painéis solares em propriedade rural com céu azul"
                className="w-full h-64 object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />

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

            <div className="absolute -top-8 -right-8 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          </div>
        </div>
      </section>

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
                icon: <Network size={20} className="text-accent" />,
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
                    icon: <Sun size={16} className="text-primary" />,
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

      <section id="beneficios" className="py-20 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="text-xs font-mono text-primary mb-3 uppercase tracking-widest">Por que Solaris Potiguar?</div>
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
            onClick={() => navigate("/onboarding")}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all group"
          >
            Começar agora, gratuitamente
            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </section>

      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-primary/15 flex items-center justify-center">
              <Sun size={10} className="text-primary" />
            </div>
            <span>Solaris Potiguar · Rio Grande do Norte</span>
          </div>
          <div className="flex gap-6">
            <span>Clima: Open-Meteo API</span>
            <span>IA: Multi-agent LLM</span>
            <span>AMD Hackathon MVP 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
