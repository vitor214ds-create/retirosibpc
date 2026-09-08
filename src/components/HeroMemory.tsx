import { Camera, Heart, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";

export function HeroMemory({
  stats,
  onShare,
}: {
  stats: { memories: number; participants: number } | undefined;
  onShare: () => void;
}) {
  return (
    <section className="relative isolate flex min-h-[92svh] items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 -z-20 bg-deep-sea bg-cover bg-center"
        style={{ backgroundImage: "url('/retiro-sibpc-memoria-bg.jpeg')" }}
        aria-hidden
      />
      <div
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,oklch(0.22_0.09_250/0.82)_0%,oklch(0.28_0.11_245/0.66)_45%,oklch(0.18_0.07_250/0.92)_100%)]"
        aria-hidden
      />

      <div className="mx-auto w-full max-w-4xl px-5 pt-24 pb-20 text-center">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-sand/30 bg-white/10 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.28em] text-sand backdrop-blur-md">
            Retiro de Jovens • SIBPC • 2026
          </span>
        </Reveal>

        <Reveal delay={120}>
          <h1 className="mt-7 font-display text-4xl font-extrabold leading-[1.05] text-white drop-shadow-[0_10px_40px_rgba(0,0,0,0.45)] sm:text-6xl md:text-7xl">
            Memórias do
            <span className="block bg-gradient-to-r from-sand via-white to-primary-glow bg-clip-text text-transparent">
              Retiro SIBPC
            </span>
          </h1>
        </Reveal>

        <Reveal delay={220}>
          <p className="mx-auto mt-6 max-w-xl text-balance text-base leading-relaxed text-white/85 sm:text-lg">
            Alguns dias passam. O que Deus fez em nós permanece.
          </p>
        </Reveal>

        <Reveal delay={320}>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              onClick={onShare}
              className="h-12 rounded-full bg-white px-7 text-deep-sea shadow-glow transition hover:scale-[1.02] hover:bg-white"
            >
              <Camera className="mr-2 size-5" /> Compartilhar uma memória
            </Button>
            <a
              href="#feed"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/30 bg-white/5 px-7 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/15"
            >
              Ver o álbum
            </a>
          </div>
        </Reveal>

        <Reveal delay={420}>
          <div className="mx-auto mt-12 grid max-w-md grid-cols-2 gap-3">
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

        <Reveal delay={520}>
          <p className="mt-12 font-display text-xs uppercase tracking-[0.42em] text-sand/80">
            Do raso ao profundo
          </p>
          <p className="mx-auto mt-3 max-w-md text-xs italic leading-relaxed text-white/60">
            “Mediu ainda mais mil, e me fez passar pelas águas, que me chegavam aos lombos.” —
            Ezequiel 47:5
          </p>
        </Reveal>
      </div>
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
    <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 text-center backdrop-blur-md">
      <div className="flex items-center justify-center gap-2">
        {icon}
        <span className="font-display text-2xl font-bold text-white">{value}</span>
      </div>
      <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-white/70">{label}</p>
    </div>
  );
}
