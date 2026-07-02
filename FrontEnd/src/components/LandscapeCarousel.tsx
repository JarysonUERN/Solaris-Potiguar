import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";

import pontalNegra from "../assets/images/Praia-de-Ponta-negra-Horizontal-Alicio-2-1-1536x864.jpg";
import pontaDoMel from "../assets/images/ponta-do-mel-alvaro-B.bx_.jpg";
import forteReisMagos from "../assets/images/FortedosReismagos_Emprotur-830x468.jpg";

const slides = [
  {
    img: pontalNegra,
    location: "Praia de Ponta Negra · Natal/RN",
    alt: "Praia de Ponta Negra",
  },
  {
    img: pontaDoMel,
    location: "Ponta do Mel · Areia Branca/RN",
    alt: "Ponta do Mel",
  },
  {
    img: forteReisMagos,
    location: "Forte dos Reis Magos · Natal/RN",
    alt: "Forte dos Reis Magos",
  },
];

export default function LandscapeCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const current = slides[active]!;

  return (
    <div className="relative max-w-5xl mx-auto px-6 reveal-on-scroll opacity-0 translate-y-8 [&.revealed]:opacity-100 [&.revealed]:translate-y-0 transition-all duration-700">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setActive((prev) => (prev - 1 + slides.length) % slides.length)}
          className="w-10 h-10 rounded-full bg-background/60 backdrop-blur flex items-center justify-center hover:bg-background/80 hover:scale-110 hover:shadow-[var(--glow-card)] transition-all text-muted-foreground hover:text-foreground flex-shrink-0 active:scale-95 z-10"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="relative flex-1 overflow-hidden rounded-2xl border border-border shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.4)] transition-shadow duration-500">
          <img
            src={current.img}
            alt={current.alt}
            className="w-full h-80 md:h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute bottom-5 left-5 right-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur border border-white/10">
              <MapPin size={13} className="text-primary" />
              <span className="text-xs font-medium text-white/90">
                {current.location}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setActive((prev) => (prev + 1) % slides.length)}
          className="w-10 h-10 rounded-full bg-background/60 backdrop-blur flex items-center justify-center hover:bg-background/80 hover:scale-110 hover:shadow-[var(--glow-card)] transition-all text-muted-foreground hover:text-foreground flex-shrink-0 active:scale-95 z-10"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="flex justify-center gap-2 mt-4">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`rounded-full transition-all duration-300 ${
              i === active
                ? "w-6 h-2 bg-primary shadow-[0_0_8px_var(--glow-strong)]"
                : "w-2 h-2 bg-muted-foreground/40 hover:bg-muted-foreground/60 hover:scale-125"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
