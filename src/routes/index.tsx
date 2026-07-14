import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import {
  Calendar,
  MapPin,
  Wallet,
  QrCode,
  AlertTriangle,
  MessageCircle,
  ClipboardCheck,
  CreditCard,
  Send,
  CheckCircle2,
  Copy,
  Waves as WavesIcon,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Waves } from "@/components/Waves";
import { Reveal } from "@/components/Reveal";
import { Bubbles } from "@/components/Bubbles";
import heroBeach from "@/assets/hero-beach.jpg";
import { toast, Toaster } from "sonner";

export const Route = createFileRoute("/")({
  component: Index,
});

const WHATSAPP_NUMBER = "27997214070";
const WHATSAPP_MSG = encodeURIComponent(
  "Olá, gostaria de tirar uma dúvida sobre o Retiro de Jovens.",
);
const PIX_KEY = "27 99702-8644";

type FormState = {
  nome: string;
  cpf: string;
  telefone: string;
  idade: string;
  nascimento: string;
  sexo: string;
  cidade: string;
  estado: string;
  restricao: "nao" | "sim";
  restricaoDesc: string;
  alergia: "nao" | "sim";
  alergiaDesc: string;
  emergNome: string;
  emergTel: string;
  obs: string;
  verdade: boolean;
  ciente: boolean;
};

const empty: FormState = {
  nome: "", cpf: "", telefone: "", idade: "", nascimento: "", sexo: "",
  cidade: "", estado: "", restricao: "nao", restricaoDesc: "",
  alergia: "nao", alergiaDesc: "", emergNome: "", emergTel: "", obs: "",
  verdade: false, ciente: false,
};

function Index() {
  const [form, setForm] = useState<FormState>(empty);
  const [sent, setSent] = useState(false);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.verdade || !form.ciente) {
      toast.error("Confirme as declarações antes de enviar.");
      return;
    }
    setSent(true);
    setTimeout(() => document.getElementById("sucesso")?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const copyPix = () => {
    navigator.clipboard.writeText(PIX_KEY);
    toast.success("Chave Pix copiada!");
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Toaster position="top-center" richColors />

      {/* HERO */}
      <section className="relative isolate min-h-[100svh] flex items-center justify-center text-white">
        <div className="absolute inset-0 -z-10">
          <img
            src={heroBeach}
            alt="Praia ao pôr do sol"
            width={1920}
            height={1080}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.25_0.12_245/0.55)] via-[oklch(0.35_0.14_245/0.35)] to-[oklch(0.2_0.1_245/0.85)]" />
        </div>
        <Bubbles count={18} />

        <div className="relative z-10 mx-auto max-w-4xl px-6 py-24 text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-medium backdrop-blur-md">
              <Sparkles className="size-3.5" /> Juventude SIB PC · 05 a 07 · Setembro
            </span>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="mt-6 font-display text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
              <span className="inline-block float-y">🌊</span> Retiro de<br />
              <span className="bg-gradient-to-r from-white via-[color:var(--color-primary-glow)] to-white bg-clip-text text-transparent">
                Jovens 2026
              </span>
            </h1>
          </Reveal>
          <Reveal delay={240}>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">
              Três dias para viver experiências que vão além do que podemos imaginar.
              Venha fortalecer sua fé, criar amizades e viver momentos inesquecíveis na presença de Deus.
            </p>
          </Reveal>
          <Reveal delay={360}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#inscricao"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-display font-semibold text-primary shadow-glow transition-all hover:-translate-y-0.5 hover:shadow-2xl"
              >
                Quero me Inscrever
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#info"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-8 py-4 font-display font-medium text-white backdrop-blur-md transition-colors hover:bg-white/20"
              >
                Saber mais
              </a>
            </div>
          </Reveal>

          <Reveal delay={520}>
            <div className="mt-16 grid grid-cols-3 gap-4 text-center text-white/90 sm:gap-8">
              {[
                { k: "3", l: "Dias" },
                { k: "1", l: "Praia" },
                { k: "∞", l: "Memórias" },
              ].map((s) => (
                <div key={s.l} className="rounded-2xl border border-white/20 bg-white/5 p-4 backdrop-blur-sm">
                  <div className="font-display text-3xl font-bold">{s.k}</div>
                  <div className="text-xs uppercase tracking-widest opacity-80">{s.l}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="absolute bottom-0 left-0 right-0 text-background">
          <Waves />
        </div>
      </section>

      {/* INFO CARDS */}
      <section id="info" className="relative py-24 bg-gradient-soft">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">Sobre o retiro</p>
              <h2 className="mt-3 font-display text-4xl font-bold text-deep-sea sm:text-5xl">
                Tudo o que você precisa saber
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                Um tempo separado para descansar, adorar a Deus e criar memórias que ficam para sempre.
              </p>
            </div>
          </Reveal>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <Calendar className="size-6" />,
                title: "Data",
                lines: ["05, 06 e 07", "de Setembro"],
              },
              {
                icon: <MapPin className="size-6" />,
                title: "Local",
                lines: ["Praia Costa Dourada", "Casa de Jedeias e Fabrícia"],
              },
              {
                icon: <Wallet className="size-6" />,
                title: "Valor",
                lines: ["R$ 150,00", "Incluso tudo"],
              },
              {
                icon: <QrCode className="size-6" />,
                title: "Pagamento",
                lines: ["Pix · 27 99702-8644", "Envie o comprovante à Líder Eduarda"],
              },
            ].map((c, i) => (
              <Reveal key={c.title} delay={i * 90}>
                <div className="group h-full rounded-3xl border border-border bg-card p-7 shadow-card transition-all hover:-translate-y-2 hover:shadow-glow">
                  <div className="mb-5 inline-flex size-12 items-center justify-center rounded-2xl bg-gradient-ocean text-white shadow-soft transition-transform group-hover:scale-110">
                    {c.icon}
                  </div>
                  <h3 className="font-display text-xl font-semibold text-deep-sea">{c.title}</h3>
                  <div className="mt-2 space-y-0.5">
                    {c.lines.map((l) => (
                      <p key={l} className="text-sm text-muted-foreground">{l}</p>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Pix quick card */}
          <Reveal>
            <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/5 via-primary-glow/10 to-primary/5 p-6 sm:flex-row">
              <div className="flex items-center gap-4">
                <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                  <QrCode className="size-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">Chave Pix</p>
                  <p className="font-display text-lg font-semibold text-deep-sea">{PIX_KEY}</p>
                </div>
              </div>
              <button
                onClick={copyPix}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition-all hover:-translate-y-0.5 hover:bg-primary/90"
              >
                <Copy className="size-4" /> Copiar chave
              </button>
            </div>
          </Reveal>

          {/* Warning */}
          <Reveal>
            <div className="mt-8 flex items-start gap-4 rounded-3xl border-2 border-warning/60 bg-warning/20 p-6 shadow-card">
              <div className="mt-0.5 inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-warning text-warning-foreground">
                <AlertTriangle className="size-6" />
              </div>
              <div>
                <p className="font-display text-lg font-bold text-warning-foreground">Atenção</p>
                <p className="mt-1 text-sm leading-relaxed text-warning-foreground/90">
                  Todos os menores de idade somente poderão participar mediante autorização
                  assinada pelo responsável legal.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="relative py-24 bg-background">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal>
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">Passo a passo</p>
              <h2 className="mt-3 font-display text-4xl font-bold text-deep-sea sm:text-5xl">Como funciona</h2>
            </div>
          </Reveal>

          <div className="relative mt-16 grid gap-6 md:grid-cols-4">
            <div className="absolute left-0 right-0 top-8 hidden h-0.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent md:block" />
            {[
              { n: "1", t: "Faça sua inscrição", d: "Preencha o formulário abaixo." },
              { n: "2", t: "Pague via PIX", d: "R$ 150,00 · chave 27 99702-8644." },
              { n: "3", t: "Envie o comprovante", d: "Para a Líder Eduarda no WhatsApp." },
              { n: "4", t: "Confirmação", d: "Aguarde a confirmação da vaga." },
            ].map((s, i) => (
              <Reveal key={s.n} delay={i * 120}>
                <div className="relative rounded-3xl border border-border bg-card p-6 text-center shadow-card transition-all hover:-translate-y-1 hover:shadow-glow">
                  <div className="mx-auto mb-4 inline-flex size-16 items-center justify-center rounded-full bg-gradient-ocean font-display text-2xl font-bold text-white shadow-glow">
                    {s.n}
                  </div>
                  <h3 className="font-display text-lg font-semibold text-deep-sea">{s.t}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FORMULÁRIO */}
      <section id="inscricao" className="relative py-24 bg-gradient-soft">
        <div className="mx-auto max-w-3xl px-6">
          {sent ? (
            <div id="sucesso" className="relative overflow-hidden rounded-[2rem] border border-primary/20 bg-card p-10 text-center shadow-glow">
              <div className="pointer-events-none absolute -top-20 left-1/2 size-80 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
              <div className="relative">
                <div className="mx-auto inline-flex size-20 items-center justify-center rounded-full bg-gradient-ocean text-white shadow-glow float-y">
                  <CheckCircle2 className="size-10" />
                </div>
                <h2 className="mt-6 font-display text-3xl font-bold text-deep-sea sm:text-4xl">
                  Inscrição enviada com sucesso!
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                  Agora basta realizar o pagamento via <strong className="text-primary">PIX</strong> e
                  enviar o comprovante para a <strong className="text-primary">Líder Eduarda</strong>.
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <button
                    onClick={copyPix}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/30 bg-background px-6 py-3 font-medium text-primary transition-all hover:-translate-y-0.5 hover:bg-primary/5"
                  >
                    <Copy className="size-4" /> Copiar chave Pix
                  </button>
                  <a
                    href={`https://wa.me/55${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-soft transition-all hover:-translate-y-0.5 hover:bg-primary/90"
                  >
                    <MessageCircle className="size-4" /> Enviar comprovante
                  </a>
                </div>

                <button
                  onClick={() => { setSent(false); setForm(empty); }}
                  className="mt-6 text-sm text-muted-foreground underline-offset-4 hover:underline"
                >
                  Fazer outra inscrição
                </button>
              </div>
            </div>
          ) : (
            <Reveal>
              <div className="rounded-[2rem] border border-border bg-card p-8 shadow-card sm:p-10">
                <div className="mb-8 text-center">
                  <p className="text-sm font-semibold uppercase tracking-widest text-primary">Inscrição</p>
                  <h2 className="mt-2 font-display text-3xl font-bold text-deep-sea sm:text-4xl">
                    Garanta sua vaga
                  </h2>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Preencha com atenção. Todos os campos são importantes.
                  </p>
                </div>

                <form onSubmit={submit} className="space-y-5">
                  <Field label="Nome completo" required>
                    <input required value={form.nome} onChange={(e) => set("nome", e.target.value)} className={inputCls} />
                  </Field>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="CPF" required>
                      <input required value={form.cpf} onChange={(e) => set("cpf", e.target.value)} className={inputCls} placeholder="000.000.000-00" />
                    </Field>
                    <Field label="Telefone" required>
                      <input required type="tel" value={form.telefone} onChange={(e) => set("telefone", e.target.value)} className={inputCls} placeholder="(27) 99999-9999" />
                    </Field>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-3">
                    <Field label="Idade" required>
                      <input required type="number" min={1} value={form.idade} onChange={(e) => set("idade", e.target.value)} className={inputCls} />
                    </Field>
                    <Field label="Data de nascimento" required>
                      <input required type="date" value={form.nascimento} onChange={(e) => set("nascimento", e.target.value)} className={inputCls} />
                    </Field>
                    <Field label="Sexo" required>
                      <select required value={form.sexo} onChange={(e) => set("sexo", e.target.value)} className={inputCls}>
                        <option value="">Selecione</option>
                        <option value="F">Feminino</option>
                        <option value="M">Masculino</option>
                      </select>
                    </Field>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-[1fr_120px]">
                    <Field label="Cidade" required>
                      <input required value={form.cidade} onChange={(e) => set("cidade", e.target.value)} className={inputCls} />
                    </Field>
                    <Field label="Estado" required>
                      <input required maxLength={2} value={form.estado} onChange={(e) => set("estado", e.target.value.toUpperCase())} className={inputCls} placeholder="ES" />
                    </Field>
                  </div>

                  <RadioGroup
                    label="Possui alguma restrição alimentar?"
                    value={form.restricao}
                    onChange={(v) => set("restricao", v as "nao" | "sim")}
                  />
                  {form.restricao === "sim" && (
                    <Field label="Descreva a restrição">
                      <textarea rows={2} value={form.restricaoDesc} onChange={(e) => set("restricaoDesc", e.target.value)} className={inputCls} />
                    </Field>
                  )}

                  <RadioGroup
                    label="Possui alguma alergia?"
                    value={form.alergia}
                    onChange={(v) => set("alergia", v as "nao" | "sim")}
                  />
                  {form.alergia === "sim" && (
                    <Field label="Descreva a alergia">
                      <textarea rows={2} value={form.alergiaDesc} onChange={(e) => set("alergiaDesc", e.target.value)} className={inputCls} />
                    </Field>
                  )}

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Contato de emergência" required>
                      <input required value={form.emergNome} onChange={(e) => set("emergNome", e.target.value)} className={inputCls} placeholder="Nome do responsável" />
                    </Field>
                    <Field label="Telefone do responsável" required>
                      <input required type="tel" value={form.emergTel} onChange={(e) => set("emergTel", e.target.value)} className={inputCls} placeholder="(27) 99999-9999" />
                    </Field>
                  </div>

                  <Field label="Observações">
                    <textarea rows={3} value={form.obs} onChange={(e) => set("obs", e.target.value)} className={inputCls} />
                  </Field>

                  <div className="space-y-3 rounded-2xl border border-border bg-background/60 p-5">
                    <label className="flex cursor-pointer items-start gap-3 text-sm">
                      <input type="checkbox" checked={form.verdade} onChange={(e) => set("verdade", e.target.checked)} className="mt-0.5 size-4 rounded accent-[color:var(--color-primary)]" />
                      <span>Declaro que todas as informações são verdadeiras.</span>
                    </label>
                    <label className="flex cursor-pointer items-start gap-3 text-sm">
                      <input type="checkbox" checked={form.ciente} onChange={(e) => set("ciente", e.target.checked)} className="mt-0.5 size-4 rounded accent-[color:var(--color-primary)]" />
                      <span>Estou ciente de que menores de idade somente participarão mediante autorização assinada pelo responsável.</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-ocean px-8 py-4 font-display text-base font-semibold text-white shadow-glow transition-all hover:-translate-y-0.5 hover:shadow-2xl"
                  >
                    <Send className="size-4 transition-transform group-hover:translate-x-1" />
                    Enviar Inscrição
                  </button>
                </form>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* GALERIA */}
      <section className="relative py-24 bg-background">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">Momentos</p>
              <h2 className="mt-3 font-display text-4xl font-bold text-deep-sea sm:text-5xl">Galeria</h2>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                As melhores memórias do retiro aparecerão aqui em breve.
              </p>
            </div>
          </Reveal>

          <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="group relative aspect-square overflow-hidden rounded-3xl border border-border bg-gradient-ocean shadow-card">
                  <div className="absolute inset-0 flex items-center justify-center text-white/80 transition-transform duration-500 group-hover:scale-110">
                    <WavesIcon className="size-10 opacity-60" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <span className="absolute bottom-3 left-3 text-xs font-medium text-white/90 opacity-0 transition-opacity group-hover:opacity-100">
                    Em breve
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative bg-gradient-hero pt-24 pb-10 text-white">
        <div className="absolute left-0 right-0 top-0 -translate-y-[1px] rotate-180 text-background">
          <Waves />
        </div>
        <Bubbles count={10} />

        <div className="relative mx-auto max-w-5xl px-6 text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs backdrop-blur">
              <WavesIcon className="size-3.5" /> Juventude SIB PC
            </div>
            <h3 className="mt-6 font-display text-3xl font-bold sm:text-4xl">Retiro de Jovens 2026</h3>
            <p className="mt-3 text-white/85">Praia Costa Dourada · 05, 06 e 07 de Setembro</p>

            <blockquote className="mx-auto mt-10 max-w-2xl border-l-2 border-white/40 pl-6 text-left italic text-white/90">
              "Grandes coisas fez o Senhor por nós, e por isso estamos alegres."
              <footer className="mt-2 text-sm not-italic text-white/70">— Salmos 126:3</footer>
            </blockquote>

            <div className="mt-12 border-t border-white/15 pt-6 text-xs text-white/70">
              Feito com fé para a Juventude · © 2026
            </div>
          </Reveal>
        </div>
      </footer>

      {/* WhatsApp float */}
      <a
        href={`https://wa.me/55${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`}
        target="_blank"
        rel="noreferrer"
        className="group fixed bottom-6 right-6 z-50 inline-flex items-center gap-3 rounded-full bg-[#25D366] px-4 py-3 font-medium text-white shadow-glow transition-all hover:-translate-y-1 hover:shadow-2xl sm:px-5"
        aria-label="Falar com a responsável no WhatsApp"
      >
        <span className="relative inline-flex">
          <span className="absolute inset-0 animate-ping rounded-full bg-white/40" />
          <MessageCircle className="relative size-5" />
        </span>
        <span className="hidden text-sm sm:inline">Falar com a Responsável</span>
      </a>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground shadow-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-deep-sea">
        {label} {required && <span className="text-primary">*</span>}
      </span>
      {children}
    </label>
  );
}

function RadioGroup({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <span className="mb-2 block text-sm font-medium text-deep-sea">{label}</span>
      <div className="grid grid-cols-2 gap-3">
        {[
          { v: "nao", l: "Não" },
          { v: "sim", l: "Sim" },
        ].map((o) => (
          <button
            key={o.v}
            type="button"
            onClick={() => onChange(o.v)}
            className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
              value === o.v
                ? "border-primary bg-primary text-primary-foreground shadow-soft"
                : "border-border bg-background text-foreground hover:border-primary/50"
            }`}
          >
            {o.l}
          </button>
        ))}
      </div>
    </div>
  );
}
