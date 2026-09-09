import { Camera, ChevronDown, Heart, MapPin, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { useRetreatPhotos } from "@/lib/useRetreatPhotos";
import { useDeviceProfile } from "@/lib/useDeviceProfile";

export function HeroMemory({
  stats,
  onShare,
}: {
  stats: { memories: number; participants: number } | undefined;
  onShare: () => void;
}) {
  const photos = useRetreatPhotos();
  const device = useDeviceProfile();

  return (
    <section
      data-device={device.mode}
      className="relative isolate min-h-[100svh] overflow-hidden bg-deep-sea"
    >
      {photos?.group ? (
        <img
          src={photos.group}
          alt=""
          aria-hidden
          fetchPriority="high"
          className="absolute inset-0 -z-30 h-full w-full object-cover object-[center_44%] md:object-center"
        />
      ) : null}

      <div
        className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,rgba(4,20,39,.78)_0%,rgba(5,27,51,.60)_34%,rgba(5,25,47,.77)_72%,rgba(4,18,35,.98)_100%)] lg:bg-[linear-gradient(90deg,rgba(4,19,37,.95)_0%,rgba(6,31,56,.84)_42%,rgba(7,36,64,.48)_72%,rgba(4,19,37,.72)_100%)]"
        aria-hidden
      />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_20%,rgba(100,181,246,.20),transparent_28%),radial-gradient(circle_at_82%_75%,rgba(255,235,180,.10),transparent_30%)]" />

      <div className="mx-auto grid min-h-[100svh] max-w-7xl items-center gap-8 px-4 pb-20 pt-24 sm:px-6 sm:pt-28 lg:grid-cols-[1.08fr_.92fr] lg:gap-14 lg:px-8 lg:pb-24">
        <div className="relative z-10 text-center lg:text-left">
          <Reveal>
            <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/20 bg-black/20 px-3.5 py-2 text-[9px] font-semibold uppercase tracking-[0.24em] text-sand shadow-lg backdrop-blur-xl sm:px-4 sm:text-[10px] sm:tracking-[0.3em]">
              <Sparkles className="size-3.5 shrink-0" />
              <span className="truncate">Retiro de Jovens • SIBPC • 2026</span>
            </span>
          </Reveal>

          <Reveal delay={100}>
            <h1 className="mx-auto mt-6 max-w-4xl font-display text-[clamp(3.15rem,14vw,5.6rem)] font-extrabold leading-[.92] tracking-[-0.055em] text-white drop-shadow-[0_16px_50px_rgba(0,0,0,.5)] sm:mt-7 lg:mx-0 lg:text-[clamp(5rem,7vw,7.4rem)]">
              Memórias
              <span className="block bg-gradient-to-r from-sand via-white to-primary-glow bg-clip-text text-transparent">
                do Retiro
              </span>
            </h1>
          </Reveal>

          <Reveal delay={180}>
            <p className="mx-auto mt-5 max-w-2xl text-balance text-[15px] leading-7 text-white/82 sm:text-lg sm:leading-8 lg:mx-0 lg:max-w-xl lg:text-xl">
              Alguns dias passam. O que Deus fez em nós permanece. Um lugar para guardar fotos,
              histórias, sorrisos e tudo aquilo que marcou o nosso coração.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mx-auto mt-6 flex max-w-xl flex-wrap items-center justify-center gap-2 text-[10px] text-white/72 sm:text-xs lg:mx-0 lg:justify-start">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/20 px-3 py-2 backdrop-blur-xl sm:px-4">
                <MapPin className="size-3.5 text-sand sm:size-4" />
                Costa Dourada
              </span>
              <span className="rounded-full border border-white/15 bg-black/20 px-3 py-2 backdrop-blur-xl sm:px-4">
                05 • 06 • 07 de setembro
              </span>
              <span className="rounded-full border border-white/15 bg-black/20 px-3 py-2 backdrop-blur-xl sm:px-4">
                Do raso ao profundo
              </span>
            </div>
          </Reveal>

          <Reveal delay={300}>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Button
                size="lg"
                onClick={onShare}
                className="h-13 w-full rounded-full bg-white px-7 text-deep-sea shadow-[0_18px_45px_rgba(0,0,0,.24)] transition active:scale-[.98] hover:-translate-y-0.5 hover:bg-sand sm:w-auto"
              >
                <Camera className="mr-2 size-5" />
                Compartilhar uma memória
              </Button>
              <a
                href="#feed"
                className="inline-flex h-13 w-full items-center justify-center rounded-full border border-white/25 bg-white/10 px-7 text-sm font-medium text-white backdrop-blur-xl transition active:scale-[.98] hover:bg-white/15 sm:w-auto"
              >
                Explorar memórias
              </a>
            </div>
          </Reveal>

          <Reveal delay={360}>
            <div className="mx-auto mt-7 grid max-w-md grid-cols-2 gap-2.5 sm:gap-3 lg:mx-0">
              <StatCard
                icon={<Heart className="size-4 text-sand" />}
                value={stats?.memories ?? 0}
                label="memórias"
              />
              <StatCard
                icon={<Users className="size-4 text-sand" />}
                value={stats?.participants ?? 0}
                label="participantes"
              />
            </div>
          </Reveal>

          {device.mode !== "desktop" && (
            <Reveal delay={420}>
              <PlaqueMemoryCard imageUrl={photos?.plaque ?? null} compact />
            </Reveal>
          )}
        </div>

        {device.mode === "desktop" && (
          <Reveal delay={260}>
            <PlaqueMemoryCard imageUrl={photos?.plaque ?? null} />
          </Reveal>
        )}
      </div>

      <a
        href="#mensagem"
        className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-white/45 transition hover:text-white/80 sm:flex"
      >
        <span className="text-[9px] uppercase tracking-[0.28em]">Continue</span>
        <ChevronDown className="size-5 animate-bounce" />
      </a>
    </section>
  );
}

function PlaqueMemoryCard({
  imageUrl,
  compact = false,
}: {
  imageUrl: string | null;
  compact?: boolean;
}) {
  return (
    <div
      className={
        compact
          ? "relative mx-auto mt-9 w-full max-w-[340px]"
          : "relative mx-auto w-full max-w-[455px]"
      }
    >
      <div className="absolute -inset-4 rounded-[2rem] bg-primary/15 blur-2xl" />
      <div
        className={
          compact
            ? "relative overflow-hidden rounded-[1.75rem] border border-white/20 bg-white/10 p-2.5 shadow-[0_24px_60px_rgba(0,0,0,.38)] backdrop-blur-xl"
            : "relative rotate-[1.5deg] overflow-hidden rounded-[2.4rem] border border-white/20 bg-white/10 p-3 shadow-[0_38px_95px_rgba(0,0,0,.46)] backdrop-blur-xl transition duration-500 hover:rotate-0 hover:scale-[1.012]"
        }
      >
        <div className={compact ? "relative aspect-[4/5] overflow-hidden rounded-[1.35rem]" : "relative aspect-[4/5] overflow-hidden rounded-[1.9rem]"}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Placa do Retiro de Jovens SIBPC — Do raso ao profundo"
              className="h-full w-full object-cover object-center"
              loading="eager"
              decoding="async"
            />
          ) : (
            <div className="h-full w-full bg-gradient-hero" />
          )}

          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(3,20,38,.22)_63%,rgba(3,18,34,.88)_100%)]" />

          <div className="absolute inset-x-3 bottom-3 rounded-2xl border border-white/15 bg-deep-sea/72 px-4 py-3.5 text-left shadow-xl backdrop-blur-xl sm:inset-x-5 sm:bottom-5 sm:px-5 sm:py-4">
            <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-sand/80 sm:text-[10px]">
              Uma lembrança que fica
            </p>
            <p className="mt-1 font-display text-base font-semibold text-white sm:text-lg">
              Do raso ao profundo
            </p>
            <p className="mt-1 text-[11px] text-white/65 sm:text-xs">Ezequiel 47:5</p>
          </div>
        </div>
      </div>
    </div>
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
    <div className="rounded-2xl border border-white/15 bg-black/15 px-3 py-3.5 text-center shadow-lg backdrop-blur-xl sm:px-4 sm:py-4 lg:text-left">
      <div className="flex items-center justify-center gap-2 lg:justify-start">
        {icon}
        <span className="font-display text-xl font-bold text-white sm:text-2xl">{value}</span>
      </div>
      <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-white/58 sm:text-[10px]">
        {label}
      </p>
    </div>
  );
}
