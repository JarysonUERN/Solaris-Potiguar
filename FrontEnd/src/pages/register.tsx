import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, CreditCard, Lock, Check, ArrowRight, Sun } from "lucide-react";
import { style } from "../styles/styles.js";
import { useLanguage } from "../i18n/index.js";
import LangSelector from "../components/LangSelector.js";
import { register as apiRegister, login } from "../services/api.js";

export default function Register() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [hasWhatsApp, setHasWhatsApp] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatCpf = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    return digits
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    return digits
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!name.trim() || !cpf.trim() || !phone.trim() || !email.trim() || !password.trim()) {
      setError(t("register.error.required"));
      return;
    }

    if (password.length < 6) {
      setError(t("register.error.password_length"));
      return;
    }

    if (cpf.replace(/\D/g, "").length !== 11) {
      setError(t("register.error.cpf"));
      return;
    }

    if (phone.replace(/\D/g, "").length < 10) {
      setError(t("register.error.phone"));
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setError(t("register.error.email"));
      return;
    }

    setIsSubmitting(true);

    try {
      await apiRegister({
        full_name: name.trim(),
        cpf: cpf.replace(/\D/g, ""),
        phone: phone.replace(/\D/g, ""),
        has_whatsapp: hasWhatsApp,
        email: email.trim().toLowerCase(),
        password,
      });

      const auth = await login(email.trim().toLowerCase(), password);

      localStorage.setItem(
        "solaris-auth",
        JSON.stringify({
          token: auth.token,
          email: auth.email,
          full_name: auth.full_name,
        })
      );

      navigate("/onboarding");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("register.error.generic")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={style.pageFlex}>
      <header className={style.headerFlexBetween}>
        <button onClick={() => navigate("/")} className={style.flexCenter}>
          <div className={style.iconBoxTiny}>
            <Sun size={12} className={style.textPrimary} />
          </div>
          <span className={style.logoText}>Solaris Potiguar</span>
        </button>
        <div className="flex items-center gap-2">
          <LangSelector />
          <div style={{ width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ display: "none" }} />
          </div>
        </div>
      </header>

      <div className={style.flexCenterFull}>
        <div className={style.containerLg}>
          <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
            <div className="mb-6 text-center">
              <div className={style.badge}>
                <Sun size={12} />
                {t("register.badge")}
              </div>
              <h1 className={style.title2xl}>{t("register.title")}</h1>
              <p className={style.textSmMutedTop}>
                {t("register.subtitle")}
              </p>
            </div>

            <form className={style.spaceY4} onSubmit={handleSubmit}>
              <div>
                <label className={style.label}>{t("register.label.name")}</label>
                <div className="relative">
                  <User size={15} className={style.inputIconPos} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t("register.placeholder.name")}
                    className={style.inputIcon}
                  />
                </div>
              </div>

              <div>
                <label className={style.label}>{t("register.label.cpf")}</label>
                <div className="relative">
                  <CreditCard size={15} className={style.inputIconPos} />
                  <input
                    type="text"
                    value={cpf}
                    onChange={(e) => setCpf(formatCpf(e.target.value))}
                    placeholder="000.000.000-00"
                    className={style.inputIcon}
                    maxLength={14}
                  />
                </div>
              </div>

              <div>
                <label className={style.label}>{t("register.label.phone")}</label>
                <div className="relative">
                  <Phone size={15} className={style.inputIconPos} />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                    placeholder={t("register.placeholder.phone")}
                    className={style.inputIcon}
                    maxLength={15}
                  />
                </div>
                <label className="mt-2 flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={hasWhatsApp}
                    onChange={(e) => setHasWhatsApp(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="w-4 h-4 rounded border border-border bg-secondary flex items-center justify-center peer-checked:bg-primary peer-checked:border-primary transition-all">
                    {hasWhatsApp && (
                      <Check size={10} className="text-primary-foreground" />
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground transition-colors">
                    {t("register.label.whatsapp")}
                  </span>
                </label>
              </div>

              <div>
                <label className={style.label}>{t("register.label.email")}</label>
                <div className="relative">
                  <Mail size={15} className={style.inputIconPos} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("register.placeholder.email")}
                    className={style.inputIcon}
                  />
                </div>
              </div>

              <div>
                <label className={style.label}>{t("register.label.password")}</label>
                <div className="relative">
                  <Lock size={15} className={style.inputIconPos} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t("register.placeholder.password")}
                    className={style.inputIcon}
                  />
                </div>
              </div>

              {error ? (
                <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`${style.btnNext} w-full justify-center ${isSubmitting ? "bg-secondary text-muted-foreground cursor-not-allowed" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}
              >
                {isSubmitting ? t("register.button.submitting") : t("register.button")}
                <ArrowRight size={16} />
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              {t("register.footer.text")}{" "}
              <button
                onClick={() => navigate("/login")}
                className="font-medium text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
              >
                {t("register.footer.link")}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
