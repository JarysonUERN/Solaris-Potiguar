import { useLanguage } from "../i18n/index.js";

export default function LangSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 border border-border rounded-lg overflow-hidden text-xs font-medium">
      <button
        onClick={() => setLanguage("pt")}
        className={`px-2 py-1 transition-colors ${
          language === "pt"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        PT 🇧🇷
      </button>
      <button
        onClick={() => setLanguage("en")}
        className={`px-2 py-1 transition-colors ${
          language === "en"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
         EN 🇺🇸
      </button>
    </div>
  );
}
