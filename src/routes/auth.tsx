import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Waves } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Entrar — Memórias do Retiro SIBPC" },
      {
        name: "description",
        content:
          "Entre ou crie sua conta para publicar fotos e lembranças no álbum do Retiro de Jovens SIBPC 2026.",
      },
      { property: "og:title", content: "Entrar — Memórias do Retiro SIBPC" },
      {
        property: "og:description",
        content: "Acesse sua conta para compartilhar memórias do Retiro de Jovens SIBPC.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

const PUBLIC_AUTH_ORIGIN = "https://retirosibpc.lovable.app";

function getAllowedAuthOrigin() {
  if (typeof window === "undefined") return PUBLIC_AUTH_ORIGIN;
  return window.location.hostname.endsWith(".vercel.app")
    ? PUBLIC_AUTH_ORIGIN
    : window.location.origin;
}

function AuthPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [sentConfirmation, setSentConfirmation] = useState(false);

  useEffect(() => {
    if (user) navigate({ to: "/", replace: true });
  }, [user, navigate]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("provider") === "google" && !user && !busy) {
      void (async () => {
        setBusy(true);
        try {
          const result = await lovable.auth.signInWithOAuth("google", {
            redirect_uri: PUBLIC_AUTH_ORIGIN,
          });
          if (result.error) {
            toast.error("Não foi possível entrar com o Google.");
          }
        } finally {
          setBusy(false);
        }
      })();
    }
    // Executa apenas na entrada da rota para evitar reiniciar o OAuth.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: getAllowedAuthOrigin(),
            data: { full_name: name.trim() || email.split("@")[0] },
          },
        });
        if (error) throw error;
        if (!data.session) {
          setSentConfirmation(true);
          return;
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Não foi possível concluir. Tente novamente.",
      );
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    // O broker OAuth do Lovable só aceita origens autorizadas.
    // Em Vercel, iniciamos o login no domínio público autorizado
    // para evitar "redirect_uri is not allowed".
    if (window.location.hostname.endsWith(".vercel.app")) {
      window.location.assign(`${PUBLIC_AUTH_ORIGIN}/auth?provider=google`);
      return;
    }

    setBusy(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: getAllowedAuthOrigin(),
      });
      if (result.error) {
        toast.error("Não foi possível entrar com o Google.");
        return;
      }
      if (result.redirected) return;
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16">
      <div
        className="absolute inset-0 -z-20 bg-deep-sea bg-cover bg-center"
        style={{ backgroundImage: "url('/retiro-grupo.jpg')" }}
        aria-hidden
      />
      <div
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,oklch(0.2_0.08_250/0.88)_0%,oklch(0.28_0.11_245/0.8)_100%)]"
        aria-hidden
      />

      <div className="w-full max-w-md rounded-3xl border border-white/15 bg-white/10 p-7 backdrop-blur-2xl">
        <div className="text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25">
            <Waves className="size-5 text-sand" />
          </span>
          <h1 className="mt-5 font-display text-2xl font-bold text-white">
            {sentConfirmation
              ? "Confirme seu e-mail"
              : mode === "login"
                ? "Bem-vindo de volta"
                : "Criar minha conta"}
          </h1>
          <p className="mt-2 text-sm text-white/70">
            {sentConfirmation
              ? "Enviamos um link de confirmação para o seu e-mail. Abra a mensagem para ativar sua conta."
              : "Memórias do Retiro SIBPC • Do raso ao profundo"}
          </p>
        </div>

        {!sentConfirmation && (
          <>
            <form onSubmit={submit} className="mt-7 space-y-3">
              {mode === "signup" && (
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  autoComplete="name"
                  className="h-11 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm text-white placeholder:text-white/50 outline-none focus:border-sand/60"
                />
              )}
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-mail"
                autoComplete="email"
                className="h-11 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm text-white placeholder:text-white/50 outline-none focus:border-sand/60"
              />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                className="h-11 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm text-white placeholder:text-white/50 outline-none focus:border-sand/60"
              />
              <Button
                type="submit"
                disabled={busy}
                className="h-11 w-full rounded-xl bg-white text-deep-sea hover:bg-white/90"
              >
                {busy && <Loader2 className="mr-2 size-4 animate-spin" />}
                {mode === "login" ? "Entrar" : "Criar conta"}
              </Button>
            </form>

            <div className="my-5 flex items-center gap-3 text-[11px] uppercase tracking-widest text-white/50">
              <span className="h-px flex-1 bg-white/20" /> ou <span className="h-px flex-1 bg-white/20" />
            </div>

            <button
              onClick={google}
              disabled={busy}
              className="flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-white/25 bg-white/10 text-sm font-medium text-white transition hover:bg-white/20"
            >
              <svg className="size-4" viewBox="0 0 24 24" aria-hidden>
                <path
                  fill="#FFC107"
                  d="M43.6 20.1H24v7.9h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20c11 0 19.5-8 19.5-20 0-1.3-.1-2.6-.4-3.9z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.1-11.3-8l-6.5 5C9.6 39.6 16.2 44 24 44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.6 20.1H24v7.9h11.3c-.8 2.3-2.3 4.2-4.1 5.6l6.2 5.2C40.9 35.5 43.5 30.4 43.5 24c0-1.3-.1-2.6-.4-3.9z"
                />
              </svg>
              Entrar com Google
            </button>

            <p className="mt-6 text-center text-xs text-white/70">
              {mode === "login" ? "Ainda não tem conta?" : "Já tem uma conta?"}{" "}
              <button
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                className="font-semibold text-sand hover:underline"
              >
                {mode === "login" ? "Criar agora" : "Entrar"}
              </button>
            </p>
          </>
        )}

        <button
          onClick={() => navigate({ to: "/" })}
          className="mt-6 w-full text-center text-xs text-white/50 hover:text-white/80"
        >
          Voltar para as memórias
        </button>
      </div>
    </div>
  );
}
