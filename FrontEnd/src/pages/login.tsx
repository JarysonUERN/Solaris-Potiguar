import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Lock, Mail, Eye, EyeOff, Sun } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle.js";
import { style } from "../styles/styles.js";

const mockCredentials = {
  email: "demo@solaris.com",
  password: "123456",
};

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const savedSession = localStorage.getItem("solaris-auth");
    if (savedSession) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Informe seu e-mail e senha para continuar.");
      return;
    }

    if (email.trim().toLowerCase() !== mockCredentials.email || password !== mockCredentials.password) {
      setError("Credenciais inválidas. Use demo@solaris.com / 123456.");
      return;
    }

    setIsSubmitting(true);

    const session = {
      email: email.trim().toLowerCase(),
      loggedAt: new Date().toISOString(),
    };

    localStorage.setItem("solaris-auth", JSON.stringify(session));

    window.setTimeout(() => {
      navigate("/dashboard");
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
                Acesso seguro · Mock local
              </div>
              <h1 className={style.title2xl}>Entrar na sua conta</h1>
              <p className={style.textSmMutedTop}>
                Acesse o painel com um fluxo de autenticação simulado para o MVP.
              </p>
            </div>

            <form className={style.spaceY4} onSubmit={handleSubmit}>
              <div>
                <label className={style.label}>E-mail</label>
                <div className="relative">
                  <Mail size={15} className={style.inputIconPos} />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="seu@email.com"
                    className={style.inputIcon}
                  />
                </div>
              </div>

              <div>
                <label className={style.label}>Senha</label>
                <div className="relative">
                  <Lock size={15} className={style.inputIconPos} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Digite sua senha"
                    className={style.inputIcon}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
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
                {isSubmitting ? "Entrando..." : "Entrar"}
                <ArrowRight size={16} />
              </button>
            </form>

            <div className="mt-6 rounded-lg border border-border bg-secondary/40 p-3 text-center text-sm text-muted-foreground">
              Credenciais de demo: <span className="font-medium text-foreground">demo@solaris.com</span> / <span className="font-medium text-foreground">123456</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


