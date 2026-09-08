import { Camera, ChevronDown, Heart, MapPin, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { RETREAT_BACKGROUND } from "@/assets/retreat-background";

export function HeroMemory({
  stats,
  onShare,
}: {
  stats: { memories: number; participants: number } | undefined;
  onShare: () => void;
}) {
  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden">
      <div
        className="absolute inset-0 -z-30 scale-[1.03] bg-deep-sea bg-cover bg-[center_42%]"
        style={{ backgroundImage: `url("${RETREAT_BACKGROUND}")` }}
        aria-hidden
      />
      <div
        className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(5,22,42,.93)_0%,rgba(8,34,61,.80)_42%,rgba(9,39,70,.48)_70%,rgba(5,22,42,.76)_100%)]"
        aria-hidden
      />
      <div
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(5,22,42,.22)_0%,rgba(5,22,42,.08)_45%,rgba(5,22,42,.94)_100%)]"
        aria-hidden
      />
      <div className="absolute -left-28 top-28 size-72 rounded-full bg-primary/20 blur-3xl" aria-hidden />
      <div className="absolute right-0 top-1/4 size-80 rounded-full bg-sand/10 blur-3xl" aria-hidden />

      <div className="mx-auto grid min-h-[100svh] max-w-7xl items-center gap-10 px-5 pb-24 pt-28 lg:grid-cols-[1.15fr_.85fr] lg:px-8">
        <div className="text-center lg:text-left">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-sand shadow-lg backdrop-blur-xl">
              <Sparkles className="size-3.5" />
              Retiro de Jovens • SIBPC • 2026
            </span>
          </Reveal>

          <Reveal delay={120}>
            <h1 className="mt-7 font-display text-5xl font-extrabold leading-[.98] tracking-tight text-white drop-shadow-[0_14px_45px_rgba(0,0,0,.45)] sm:text-7xl lg:text-8xl">
              Memórias
              <span className="block bg-gradient-to-r from-sand via-white to-primary-glow bg-clip-text text-transparent">
                do Retiro
              </span>
            </h1>
          </Reveal>

          <Reveal delay={220}>
            <p className="mx-auto mt-6 max-w-2xl text-balance text-base leading-8 text-white/82 sm:text-xl lg:mx-0">
              Alguns dias passam. O que Deus fez em nós permanece. Um lugar para guardar fotos,
              histórias, sorrisos e tudo aquilo que marcou o nosso coração.
            </p>
          </Reveal>

          <Reveal delay={300}>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3 text-xs text-white/70 lg:justify-start">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/15 px-4 py-2 backdrop-blur">
                <MapPin className="size-4 text-sand" />
                Costa Dourada
              </span>
              <span className="rounded-full border border-white/15 bg-black/15 px-4 py-2 backdrop-blur">
                05 • 06 • 07 de setembro
              </span>
              <span className="rounded-full border border-white/15 bg-black/15 px-4 py-2 backdrop-blur">
                Do raso ao profundo
              </span>
            </div>
          </Reveal>

          <Reveal delay={380}>
            <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Button
                size="lg"
                onClick={onShare}
                className="h-13 rounded-full bg-white px-8 text-deep-sea shadow-[0_18px_45px_rgba(0,0,0,.22)] transition hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-sand"
              >
                <Camera className="mr-2 size-5" />
                Compartilhar uma memória
              </Button>
              <a
                href="#feed"
                className="inline-flex h-13 items-center justify-center rounded-full border border-white/25 bg-white/8 px-8 text-sm font-medium text-white backdrop-blur-xl transition hover:bg-white/15"
              >
                Explorar memórias
              </a>
            </div>
          </Reveal>

          <Reveal delay={460}>
            <div className="mx-auto mt-10 grid max-w-lg grid-cols-2 gap-3 lg:mx-0">
              <StatCard
                icon={<Heart className="size-4 text-sand" />}
                value={stats?.memories ?? 0}
                label="memórias publicadas"
              />
              <StatCard
                icon={<Users className="size-4 text-sand" />}
                value={stats?.participants ?? 0}
                label="participantes"
              />
            </div>
          </Reveal>
        </div>

        <Reveal delay={300}>
          <div className="relative mx-auto hidden w-full max-w-md lg:block">
            <div className="absolute -inset-5 rounded-[2.5rem] bg-white/8 blur-xl" />
            <div className="relative rotate-[2deg] overflow-hidden rounded-[2.25rem] border border-white/20 bg-white/10 p-3 shadow-[0_35px_90px_rgba(0,0,0,.42)] backdrop-blur-xl transition duration-500 hover:rotate-0 hover:scale-[1.015]">
              <div
                className="aspect-[4/5] rounded-[1.7rem] bg-cover bg-center"
                style={{ backgroundImage: `url("${RETREAT_BACKGROUND}")` }}
              />
              <div className="absolute inset-x-8 bottom-8 rounded-2xl border border-white/15 bg-deep-sea/70 px-5 py-4 backdrop-blur-xl">
                <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-sand/75">
                  Uma lembrança que fica
                </p>
                <p className="mt-1 font-display text-lg font-semibold text-white">
                  Do raso ao profundo
                </p>
                <p className="mt-1 text-xs text-white/60">Ezequiel 47:5</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      <a
        href="#mensagem"
        className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-white/50 transition hover:text-white/80"
      >
        <span className="text-[9px] uppercase tracking-[0.28em]">Continue</span>
        <ChevronDown className="size-5 animate-bounce" />
      </a>
    </section>
  );
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 text-center shadow-lg backdrop-blur-xl lg:text-left">
      <div className="flex items-center justify-center gap-2 lg:justify-start">
        {icon}
        <span className="font-display text-2xl font-bold text-white">{value}</span>
      </div>
      <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-white/60">{label}</p>
    </div>
  );
}
