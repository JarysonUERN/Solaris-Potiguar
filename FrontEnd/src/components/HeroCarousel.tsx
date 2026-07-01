import { useState, useEffect } from "react";
import { Brain, Sun, Battery, Zap, ChevronLeft, ChevronRight } from "lucide-react";
import { style } from "../styles/styles.js";

import orchestratorImg from "../assets/images/Orquestration.jpg";
import solarImg from "../assets/images/stock image 3.jpg";
import storageImg from "../assets/images/storage-agent.jpg";
import consumptionImg from "../assets/images/comsuption-agent.jpg";

interface Slide {
  icon: React.ReactNode;
  label: string;
  body: React.ReactNode;
  img: string;
  iconBg: string;
}

const slides: Slide[] = [
  {
    icon: <Brain size={14} className={style.textPrimary} />,
    label: "Orquestrador · agora",
    body: (
      <>
        "Condições excelentes. Mantenha as cargas ligadas agora — sua bateria vai carregar antes do anoitecer. Economia estimada hoje:{" "}
        <span className="text-primary font-semibold">R$ 18,40</span>."
      </>
    ),
    img: orchestratorImg,
    iconBg: style.iconBoxPrimary,
  },
  {
    icon: <Sun size={14} className="text-yellow-400" />,
    label: "Geração Solar · agora",
    body: '"Irradiância solar em 847 W/m². Nuvens esparsas previstas após 16h com redução estimada de 18%. Geração excedente disponível para armazenamento."',
    img: solarImg,
    iconBg: style.iconBoxYellow,
  },
  {
    icon: <Battery size={14} className={style.textAccent} />,
    label: "Armazenamento · agora",
    body: '"Bateria em 67% (8,0/12 kWh). Taxa de carga ideal. Capacidade suficiente para cobrir o pico noturno sem recorrer à rede."',
    img: storageImg,
    iconBg: style.iconBoxAccent,
  },
  {
    icon: <Zap size={14} className="text-blue-400" />,
    label: "Consumo · agora",
    body: '"Consumo atual 2,3 kW, 31% abaixo da geração. Pico noturno projetado 4,1 kW entre 19h-22h. Excedente direcionado para bateria."',
    img: consumptionImg,
    iconBg: style.iconBoxBlue,
  },
];

export default function HeroCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const current = slides[active]!;

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActive((prev) => (prev - 1 + slides.length) % slides.length)}
          className="w-8 h-8 rounded-full bg-background/60 backdrop-blur flex items-center justify-center hover:bg-background/80 transition-all text-muted-foreground hover:text-foreground flex-shrink-0"
        >
          <ChevronLeft size={14} />
        </button>
        <div className={style.cardBorderedRound + " relative overflow-hidden flex-1"}>
          <img
            src={current.img}
            alt=""
            className={style.heroImage}
          />
          <div className={style.heroGradient} />

          <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-card/90 backdrop-blur border border-border">
            <div className={style.flexStart}>
              <div className={current.iconBg}>
                {current.icon}
              </div>
              <div>
                <div className={style.textResultMuted}>{current.label}</div>
                <p className={style.textSmLeading}>{current.body}</p>
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={() => setActive((prev) => (prev + 1) % slides.length)}
          className="w-8 h-8 rounded-full bg-background/60 backdrop-blur flex items-center justify-center hover:bg-background/80 transition-all text-muted-foreground hover:text-foreground flex-shrink-0"
        >
          <ChevronRight size={14} />
        </button>
      </div>

      <div className="flex justify-center gap-2 mt-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`rounded-full transition-all ${
              i === active
                ? "w-6 h-2 bg-purple-500"
                : "w-2 h-2 bg-muted-foreground/40 hover:bg-muted-foreground/60"
            }`}
          />
        ))}
      </div>

      <div className={style.heroBlur} />
    </div>
  );
}
