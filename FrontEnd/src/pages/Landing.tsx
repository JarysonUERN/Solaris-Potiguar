import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sun, Sparkles, MapPin, Network, Zap, Battery,
  BarChart2, ArrowRight, Menu, X
} from "lucide-react";
import { style } from "../styles/styles.js";
import { useLanguage } from "../i18n/index.js";
import ThemeToggle from "../components/ThemeToggle.js";
import HeroCarousel from "../components/HeroCarousel.js";
import LandscapeCarousel from "../components/LandscapeCarousel.js";
import LangSelector from "../components/LangSelector.js";

export default function Landing() {
  const navigate = useNavigate();
  const { t } = useLanguage();
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
            <a href="#como-funciona" className={style.linkHover}>{t("nav.links.how")}</a>
            <a href="#agentes" className={style.linkHover}>{t("nav.links.agents")}</a>
            <a href="#beneficios" className={style.linkHover}>{t("nav.links.benefits")}</a>
          </div>

          <div className={style.navActions}>
            <LangSelector />
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => navigate("/dashboard")}
                  className={style.btnOutline}
                >
                  {t("nav.auth.dashboard")}
                </button>
                <button
                  onClick={handleLogout}
                  className={style.btnPrimarySm}
                >
                  {t("nav.auth.logout")}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className={style.btnOutline}
                >
                  {t("nav.auth.login")}
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className={style.btnPrimarySm}
                >
                  {t("nav.auth.signup")}
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
            <a href="#como-funciona" className={style.textSm} onClick={() => setMenuOpen(false)}>{t("nav.links.how")}</a>
            <a href="#agentes" className={style.textSm} onClick={() => setMenuOpen(false)}>{t("nav.links.agents")}</a>
            <a href="#beneficios" className={style.textSm} onClick={() => setMenuOpen(false)}>{t("nav.links.benefits")}</a>
            <div className="flex justify-center">
              <LangSelector />
            </div>
            {isLoggedIn ? (
              <>
                <button onClick={() => navigate("/dashboard")} className={style.btnPrimaryFull}>
                  {t("nav.auth.dashboard")}
                </button>
                <button onClick={handleLogout} className={`${style.btnOutline} mt-2`}>
                  {t("nav.auth.logout")}
                </button>
              </>
            ) : (
              <button onClick={() => navigate("/register")} className={style.btnPrimaryFull}>
                {t("nav.auth.signup")}
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
              {t("hero.badge")}
            </div>

            <h1 className={style.titleHero}>
              {t("hero.title.prefix")}
              <span className={style.textPrimary}>{t("hero.title.highlight")}</span>{t("hero.title.suffix")}
            </h1>

            <p className={style.textLgMuted}>
              {t("hero.subtitle")}
            </p>

            <div className={style.flexColSmRow + " reveal-on-scroll opacity-0 translate-y-6 [&.revealed]:opacity-100 [&.revealed]:translate-y-0 transition-all duration-700"}>
              <button
                onClick={() => navigate(isLoggedIn ? "/onboarding" : "/register")}
                className={style.btnAction}
              >
                {t("hero.cta.setup")}
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
              <a
                href="#como-funciona"
                className={style.btnOutlineLg}
              >
                {t("hero.cta.how")}
              </a>
            </div>

            <div className={style.statsRow + " reveal-on-scroll opacity-0 translate-y-6 [&.revealed]:opacity-100 [&.revealed]:translate-y-0 transition-all duration-700 delay-200"}>
              {[
                { value: "38+", labelKey: "hero.stat.kwh" },
                { value: "3", labelKey: "hero.stat.agents" },
                { value: "R$ 847", labelKey: "hero.stat.savings" },
              ].map((stat) => (
                <div key={stat.labelKey}>
                  <div className={style.textXlMono}>{stat.value}</div>
                  <div className={style.textXsMutedTop}>{t(stat.labelKey)}</div>
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
            <div className={style.textMonoTitle}>{t("process.label")}</div>
            <h2 className={style.title + " " + style.floatAnimSlow}>{t("process.title")}</h2>
          </div>

          <div className={style.grid3 + " " + style.staggerGroup}>
            {[
              {
                step: "01",
                icon: <MapPin size={20} className={style.textPrimary} />,
                titleKey: "process.step1.title",
                descKey: "process.step1.desc",
              },
              {
                step: "02",
                icon: <Network size={20} className={style.textAccent} />,
                titleKey: "process.step2.title",
                descKey: "process.step2.desc",
              },
              {
                step: "03",
                icon: <Sparkles size={20} className={style.textYellow} />,
                titleKey: "process.step3.title",
                descKey: "process.step3.desc",
              },
            ].map((item) => (
              <div key={item.step} className={style.cardRelative + " " + style.glowCardHover + " " + style.glowCardActive}>
                <div className={style.textStep}>
                  {item.step}
                </div>
                <div className={style.iconBox}>
                  {item.icon}
                </div>
                <h3 className={style.subtitle}>{t(item.titleKey)}</h3>
                <p className={style.textSmMutedLeading}>{t(item.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="agentes" className={style.section + " reveal-on-scroll opacity-0 translate-y-8 [&.revealed]:opacity-100 [&.revealed]:translate-y-0 transition-all duration-700 delay-100"}>
        <div className={style.container}>
          <div className={style.grid2}>
            <div>
              <div className={style.textMonoTitle}>{t("agents.label")}</div>
              <h2 className={style.titleMd}>
                {t("agents.title")}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                {t("agents.desc")}
              </p>

              <div className={style.spaceY4 + " " + style.staggerGroup}>
                {[
                  {
                    icon: <Sun size={16} className={style.textPrimary} />,
                    nameKey: "agents.meteo.name",
                    descKey: "agents.meteo.desc",
                    color: "bg-primary/10 border-primary/20",
                  },
                  {
                    icon: <Zap size={16} className={style.textBlue} />,
                    nameKey: "agents.consumption.name",
                    descKey: "agents.consumption.desc",
                    color: "bg-blue-500/10 border-blue-500/20",
                  },
                  {
                    icon: <Battery size={16} className={style.textAccent} />,
                    nameKey: "agents.storage.name",
                    descKey: "agents.storage.desc",
                    color: "bg-accent/10 border-accent/20",
                  },
                  ].map((agent) => (
                  <div key={agent.nameKey} className={style.agentCard(agent.color) + " " + style.glowCardHover}>
                    <div className={style.iconBoxSm}>
                      {agent.icon}
                    </div>
                    <div>
                      <div className={style.subtitleCard}>{t(agent.nameKey)}</div>
                      <div className={style.textXsMutedTop}>{t(agent.descKey)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className={style.cardAgent}>
                <div className={style.analysisHeader}>
                  <Network size={12} />
                  {t("agents.reasoning")}
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
                    {t("agents.recommendation.prefix")}<span className="text-primary font-medium">{t("agents.recommendation.highlight")}</span>{t("agents.recommendation.suffix")}
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
            <div className={style.textMonoTitle}>{t("benefits.label")}</div>
          </div>
          <section className="py-6 px-6">
            <LandscapeCarousel />
          </section>
          <div className={style.titleSection}>
            <h2 className={style.title}>{t("benefits.title")}</h2>
          </div>
          <div className={style.grid4 + " " + style.staggerGroup}>
            {[
              { icon: <Sun size={18} className={style.textPrimary} />, titleKey: "benefits.climate.title", descKey: "benefits.climate.desc" },
              { icon: <Zap size={18} className={style.textAccent} />, titleKey: "benefits.nographs.title", descKey: "benefits.nographs.desc" },
              { icon: <Battery size={18} className={style.textBlue} />, titleKey: "benefits.offline.title", descKey: "benefits.offline.desc" },
              { icon: <BarChart2 size={18} className={style.textYellow} />, titleKey: "benefits.history.title", descKey: "benefits.history.desc" },
            ].map((b) => (
              <div key={b.titleKey} className={style.cardHover + " " + style.glowCardHover + " " + style.glowCardActive}>
                <div className={style.iconBoxLg}>
                  {b.icon}
                </div>
                <div className={style.subtitleCard}>{t(b.titleKey)}</div>
                <div className={style.textXsLeading}>{t(b.descKey)}</div>
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
          <h2 className={style.titleSm}>{t("cta.title")}</h2>
          <p className={style.textLgMutedCenter}>
            {t("cta.desc")}
          </p>
          <button
            onClick={() => navigate(isLoggedIn ? "/onboarding" : "/register")}
            className={style.btnPrimaryLg}
          >
            {t("cta.button")}
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
            <span className={style.footerLink}>{t("footer.brand")}</span>
          </div>
          <div className={style.footerLinks}>
            <span className={style.footerLink}>{t("footer.climate")}</span>
            <span className={style.footerLink}>{t("footer.ai")}</span>
            <span className={style.footerLink}>{t("footer.event")}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
