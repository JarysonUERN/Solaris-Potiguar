import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, CreditCard, Check, ArrowRight, Sun } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle.js";
import { style } from "../styles/styles.js";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [hasWhatsApp, setHasWhatsApp] = useState(true);
  const [email, setEmail] = useState("");
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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!name.trim() || !cpf.trim() || !phone.trim() || !email.trim()) {
      setError("Preencha todos os campos para continuar.");
      return;
    }

    if (cpf.replace(/\D/g, "").length !== 11) {
      setError("Informe um CPF válido com 11 dígitos.");
      return;
    }

    if (phone.replace(/\D/g, "").length < 10) {
      setError("Informe um telefone válido com DDD.");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setError("Informe um e-mail válido.");
      return;
    }

    setIsSubmitting(true);

    const user = {
      name: name.trim(),
      cpf: cpf.replace(/\D/g, ""),
      phone: phone.replace(/\D/g, ""),
      email: email.trim().toLowerCase(),
      registeredAt: new Date().toISOString(),
    };

    localStorage.setItem("solaris-auth", JSON.stringify(user));

    window.setTimeout(() => {
      navigate("/onboarding");
    }, 400);
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
        <ThemeToggle size={13} />
      </header>

      <div className={style.flexCenterFull}>
        <div className={style.containerLg}>
          <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
            <div className="mb-6 text-center">
              <div className={style.badge}>
                <Sun size={12} />
                Cadastro · Mock local
              </div>
              <h1 className={style.title2xl}>Criar sua conta</h1>
              <p className={style.textSmMutedTop}>
                Preencha seus dados para começar a usar o Solaris Potiguar.
              </p>
            </div>

            <form className={style.spaceY4} onSubmit={handleSubmit}>
              <div>
                <label className={style.label}>Nome completo</label>
                <div className="relative">
                  <User size={15} className={style.inputIconPos} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Maria Silva"
                    className={style.inputIcon}
                  />
                </div>
              </div>

              <div>
                <label className={style.label}>CPF</label>
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
                <label className={style.label}>Telefone</label>
                <div className="relative">
                  <Phone size={15} className={style.inputIconPos} />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                    placeholder="(84) 00000-0000"
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
                    Este número possui WhatsApp?
                  </span>
                </label>
              </div>

              <div>
                <label className={style.label}>E-mail</label>
                <div className="relative">
                  <Mail size={15} className={style.inputIconPos} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
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
                {isSubmitting ? "Criando conta..." : "Criar conta e configurar"}
                <ArrowRight size={16} />
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              Já tem conta?{" "}
              <button
                onClick={() => navigate("/login")}
                className="font-medium text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
              >
                Fazer login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
