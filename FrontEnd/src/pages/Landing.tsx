import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sun, Sparkles, MapPin, Network, Zap, Battery,
  BarChart2, ArrowRight, Menu, X
} from "lucide-react";
import { style } from "../styles/styles.js";
import ThemeToggle from "../components/ThemeToggle.js";
import HeroCarousel from "../components/HeroCarousel.js";
import LandscapeCarousel from "../components/LandscapeCarousel.js";

export default function Landing() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const savedSession = localStorage.getItem("solaris-auth");
    setIsLoggedIn(Boolean(savedSession));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("solaris-auth");
    setIsLoggedIn(false);
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = heroRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal-on-scroll").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className={style.pageLanding}>
      <nav className={style.nav}>
        <div className={style.navInner}>
          <div className={style.navLogoContainer}>
            <ThemeToggle
              className={style.iconBoxNav}
              iconLight="text-primary-foreground"
              iconDark="text-primary-foreground"
              bgDark="bg-primary"
              bgLight="bg-blue-900"
            />
            <span className={style.navLogoText}> Solaris Potiguar</span>
          </div>

          <div className={style.navLinks}>
            <a href="#como-funciona" className={style.linkHover}>Como funciona</a>
            <a href="#agentes" className={style.linkHover}>Agentes</a>
            <a href="#beneficios" className={style.linkHover}>Benefícios</a>
          </div>

          <div className={style.navActions}>
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => navigate("/dashboard")}
                  className={style.btnOutline}
                >
                  Ir ao dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className={style.btnPrimarySm}
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className={style.btnOutline}
                >
                  Entrar
                </button>
                <button
                  onClick={() => navigate("/onboarding")}
                  className={style.btnPrimarySm}
                >
                  Começar grátis
                </button>
              </>
            )}
          </div>

          <button
            className={style.btnMobile}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {menuOpen && (
          <div className={style.mobileMenu}>
            <a href="#como-funciona" className={style.textSm} onClick={() => setMenuOpen(false)}>Como funciona</a>
            <a href="#agentes" className={style.textSm} onClick={() => setMenuOpen(false)}>Agentes</a>
            <a href="#beneficios" className={style.textSm} onClick={() => setMenuOpen(false)}>Benefícios</a>
            {isLoggedIn ? (
              <>
                <button onClick={() => navigate("/dashboard")} className={style.btnPrimaryFull}>
                  Ir ao dashboard
                </button>
                <button onClick={handleLogout} className={`${style.btnOutline} mt-2`}>
                  Sair
                </button>
              </>
            ) : (
              <button onClick={() => navigate("/onboarding")} className={style.btnPrimaryFull}>
                Começar grátis
              </button>
            )}
          </div>
        )}
      </nav>

      <section
        ref={heroRef}
        onMouseMove={handleMouseMove}
        className={style.heroSection + " " + style.glowContainer + " group"}
      >
        <div
          className={style.heroGlow}
          style={{
            background: "radial-gradient(circle at center, var(--glow-strong), transparent 70%)",
            top: `${mousePos.y - 25}%`,
            right: `${100 - mousePos.x - 25}%`,
            transition: "top 0.3s ease-out, right 0.3s ease-out",
          }}
        />
        <div
          className={style.heroGlowLeft}
          style={{
            background: "radial-gradient(circle at center, var(--glow), transparent 70%)",
            left: `${mousePos.x - 10}%`,
            bottom: `${100 - mousePos.y - 10}%`,
            transition: "left 0.4s ease-out, bottom 0.4s ease-out",
          }}
        />
        <div className={style.grid2}>
          <div>
            <div className={style.badge}>
              <Sparkles size={11} />
              Multi-agentes de IA · Rio Grande do Norte
            </div>

            <h1 className={style.titleHero}>
              Energia solar gerenciada por{" "}
              <span className={style.textPrimary}>inteligência</span>, não por dashboards
            </h1>

            <p className={style.textLgMuted}>
              Três agentes de IA analisam clima, consumo e armazenamento em tempo real. Você recebe uma recomendação direta em linguagem natural — sem gráficos, sem confusão.
            </p>

            <div className={style.flexColSmRow + " reveal-on-scroll opacity-0 translate-y-6 [&.revealed]:opacity-100 [&.revealed]:translate-y-0 transition-all duration-700"}>
              <button
                onClick={() => navigate("/onboarding")}
                className={style.btnAction}
              >
                Configurar minha propriedade
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
              <a
                href="#como-funciona"
                className={style.btnOutlineLg}
              >
                Ver como funciona
              </a>
            </div>

            <div className={style.statsRow + " reveal-on-scroll opacity-0 translate-y-6 [&.revealed]:opacity-100 [&.revealed]:translate-y-0 transition-all duration-700 delay-200"}>
              {[
                { value: "38+", label: "kWh analisados/dia" },
                { value: "3", label: "agentes ativos" },
                { value: "R$ 847", label: "economia/mês média" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className={style.textXlMono}>{stat.value}</div>
                  <div className={style.textXsMutedTop}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <HeroCarousel />
        </div>
      </section>

      <section id="como-funciona" className={style.section + " reveal-on-scroll opacity-0 translate-y-8 [&.revealed]:opacity-100 [&.revealed]:translate-y-0 transition-all duration-700"}>
        <div className={style.container}>
          <div className={style.titleSection}>
            <div className={style.textMonoTitle}>Processo</div>
            <h2 className={style.title + " " + style.floatAnimSlow}>Três passos, uma resposta</h2>
          </div>

          <div className={style.grid3 + " " + style.staggerGroup}>
            {[
              {
                step: "01",
                icon: <MapPin size={20} className={style.textPrimary} />,
                title: "Configure sua propriedade",
                desc: "Informe capacidade dos painéis, armazenamento em bateria e padrão de consumo. Feito uma vez, usado para sempre.",
              },
              {
                step: "02",
                icon: <Network size={20} className={style.textAccent} />,
                title: "Agentes analisam tudo",
                desc: "Clima em tempo real via Open-Meteo, consumo histórico e estado da bateria são processados simultaneamente por três IAs.",
              },
              {
                step: "03",
                icon: <Sparkles size={20} className={style.textYellow} />,
                title: "Recomendação em linguagem natural",
                desc: "Nada de gráfico. O orquestrador sintetiza tudo numa frase clara e acionável para você decidir agora.",
              },
            ].map((item) => (
              <div key={item.step} className={style.cardRelative + " " + style.glowCardHover + " " + style.glowCardActive}>
                <div className={style.textStep}>
                  {item.step}
                </div>
                <div className={style.iconBox}>
                  {item.icon}
                </div>
                <h3 className={style.subtitle}>{item.title}</h3>
                <p className={style.textSmMutedLeading}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="agentes" className={style.section + " reveal-on-scroll opacity-0 translate-y-8 [&.revealed]:opacity-100 [&.revealed]:translate-y-0 transition-all duration-700 delay-100"}>
        <div className={style.container}>
          <div className={style.grid2}>
            <div>
              <div className={style.textMonoTitle}>Multi-agentes</div>
              <h2 className={style.titleMd}>
                Três especialistas trabalhando em paralelo
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Cada agente tem uma especialidade distinta. O orquestrador ouve os três e entrega uma recomendação única — transparente e rastreável.
              </p>

              <div className={style.spaceY4 + " " + style.staggerGroup}>
                {[
                  {
                    icon: <Sun size={16} className={style.textPrimary} />,
                    name: "Agente Meteorológico",
                    desc: "Irradiância, temperatura, nuvens e previsão horária via Open-Meteo API",
                    color: "bg-primary/10 border-primary/20",
                  },
                  {
                    icon: <Zap size={16} className={style.textBlue} />,
                    name: "Agente de Consumo",
                    desc: "Padrão histórico, pico tarifário e demanda projetada para as próximas horas",
                    color: "bg-blue-500/10 border-blue-500/20",
                  },
                  {
                    icon: <Battery size={16} className={style.textAccent} />,
                    name: "Agente de Armazenamento",
                    desc: "Estado da bateria, taxa de carga/descarga e autonomia disponível",
                    color: "bg-accent/10 border-accent/20",
                  },
                  ].map((agent) => (
                  <div key={agent.name} className={style.agentCard(agent.color) + " " + style.glowCardHover}>
                    <div className={style.iconBoxSm}>
                      {agent.icon}
                    </div>
                    <div>
                      <div className={style.subtitleCard}>{agent.name}</div>
                      <div className={style.textXsMutedTop}>{agent.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className={style.cardAgent}>
                <div className={style.analysisHeader}>
                  <Network size={12} />
                  Raciocínio em tempo real
                </div>
                {[
                  { label: "METEO", color: "text-primary bg-primary/10", text: "Irradiância: 847 W/m² · UV: 9 · Nuvens às 16h" },
                  { label: "CONSUMO", color: "text-blue-400 bg-blue-500/10", text: "Demanda atual: 2,3 kW · Pico previsto 19h: 4,1 kW" },
                  { label: "STORAGE", color: "text-accent bg-accent/10", text: "Bateria: 67% · Autonomia noturna: garantida" },
                  { label: "SÍNTESE", color: "text-yellow-300 bg-yellow-400/10", text: "Geração excedente → carregar bateria agora → cobrir pico noturno sem rede" },
                ].map((row) => (
                  <div key={row.label} className={style.agentRow}>
                    <span className={style.rowLabel(row.color)}>
                      {row.label}
                    </span>
                    <span className="text-muted-foreground leading-relaxed">{row.text}</span>
                  </div>
                ))}
                <div className={style.recommendationBox}>
                  <p className={style.textSmLeading}>
                    "Mantenha as cargas ligadas agora. A bateria vai completar a carga antes do pôr do sol e cobrirá toda a noite — <span className="text-primary font-medium">economia de R$ 18,40</span>."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section id="beneficios" className={style.section + " reveal-on-scroll opacity-0 translate-y-8 [&.revealed]:opacity-100 [&.revealed]:translate-y-0 transition-all duration-700 delay-200"}>
        <div className={style.container}>
          <div className={style.titleSection}>
            <div className={style.textMonoTitle}>Por que Solaris Potiguar?</div>
          </div>
          <section className="py-6 px-6">
            <LandscapeCarousel />
          </section>
          <div className={style.titleSection}>
            <h2 className={style.title}>Feito para o sertão do RN</h2>
          </div>
          <div className={style.grid4 + " " + style.staggerGroup}>
            {[
              { icon: <Sun size={18} className={style.textPrimary} />, title: "Clima local", desc: "Dados de irradiância específicos para o semiárido nordestino" },
              { icon: <Zap size={18} className={style.textAccent} />, title: "Sem gráficos", desc: "Recomendação direta. O que fazer agora, em português claro" },
              { icon: <Battery size={18} className={style.textBlue} />, title: "Offline-first", desc: "Funciona mesmo com conexão instável no interior" },
              { icon: <BarChart2 size={18} className={style.textYellow} />, title: "Histórico", desc: "Acompanhe o padrão de decisões e a economia acumulada" },
            ].map((b) => (
              <div key={b.title} className={style.cardHover + " " + style.glowCardHover + " " + style.glowCardActive}>
                <div className={style.iconBoxLg}>
                  {b.icon}
                </div>
                <div className={style.subtitleCard}>{b.title}</div>
                <div className={style.textXsLeading}>{b.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={style.section + " reveal-on-scroll opacity-0 translate-y-8 [&.revealed]:opacity-100 [&.revealed]:translate-y-0 transition-all duration-700 delay-300"}>
        <div className={style.containerXs}>
          <div className={style.iconBoxPrimaryCircle + " " + style.floatAnim}>
            <Sun size={24} className={style.textPrimary} />
          </div>
          <h2 className={style.titleSm}>Pronto para gerenciar com inteligência?</h2>
          <p className={style.textLgMutedCenter}>
            Configure sua propriedade em menos de 2 minutos e receba sua primeira análise hoje.
          </p>
          <button
            onClick={() => navigate("/onboarding")}
            className={style.btnPrimaryLg}
          >
            Começar agora, gratuitamente
            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </section>

      <footer className={style.footer}>
        <div className={style.footerInner}>
          <div className={style.footerBrand}>
            <div className={style.iconBoxFooter}>
              <Sun size={10} className={style.textPrimary} />
            </div>
            <span className={style.footerLink}>Solaris Potiguar · Rio Grande do Norte</span>
          </div>
          <div className={style.footerLinks}>
            <span className={style.footerLink}>Clima: Open-Meteo API</span>
            <span className={style.footerLink}>IA: Multi-agent LLM</span>
            <span className={style.footerLink}>AMD Hackathon MVP 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
