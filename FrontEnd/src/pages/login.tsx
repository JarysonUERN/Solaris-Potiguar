import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Lock, Mail, Eye, EyeOff, Sun, Moon } from "lucide-react";
import { style } from "../styles/styles.js";
import { useTheme } from "../hooks/useTheme.js";
import { login } from "../services/api.js";
import homeIcon from "../assets/icons/home-1-svgrepo-com.svg";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isLight, toggle } = useTheme();

  useEffect(() => {
    const savedSession = localStorage.getItem("solaris-auth");
    if (savedSession) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Informe seu e-mail e senha para continuar.");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await login(email.trim().toLowerCase(), password);

      localStorage.setItem(
        "solaris-auth",
        JSON.stringify({
          token: data.token,
          email: data.email,
          full_name: data.full_name,
        })
      );

      navigate("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao fazer login. Tente novamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={style.pageFlex}>
      <header className="border-b border-border px-6 py-4 flex items-center justify-center relative">
        <button
          onClick={() => navigate("/")}
          className="absolute left-6 flex items-center justify-center w-7 h-7 rounded-md hover:bg-secondary/50 transition-colors"
        >
          <img src={homeIcon} alt="Home" className="w-5 h-5" />
        </button>
        <button onClick={toggle} className={style.flexCenter}>
          <div className={style.iconBoxTiny}>
            {isLight ? <Moon size={12} className={style.textPrimary} /> : <Sun size={12} className={style.textPrimary} />}
          </div>
          <span className={style.logoText}>Solaris Potiguar</span>
        </button>
      </header>

      <div className={style.flexCenterFull}>
        <div className={style.containerLg}>
          <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
            <div className="mb-6 text-center">
              <div className={style.badge}>
                <Sun size={12} />
                Acesso seguro
              </div>
              <h1 className={style.title2xl}>Entrar na sua conta</h1>
              <p className={style.textSmMutedTop}>
                Acesse o painel para gerenciar sua propriedade.
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

            <p className="mt-6 text-center text-xs text-muted-foreground">
              Ainda não tem conta?{" "}
              <button
                onClick={() => navigate("/register")}
                className="font-medium text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
              >
                Criar cadastro
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
