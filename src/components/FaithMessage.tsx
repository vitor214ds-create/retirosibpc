import { BookOpen, Heart, Sparkles } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { RETREAT_BACKGROUND } from "@/assets/retreat-background";

export function FaithMessage() {
  return (
    <section id="mensagem" className="relative isolate overflow-hidden py-24 sm:py-28">
      <div
        className="absolute inset-0 -z-30 bg-cover bg-center bg-fixed opacity-55"
        style={{ backgroundImage: `url("${RETREAT_BACKGROUND}")` }}
        aria-hidden
      />
      <div
        className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,rgba(8,28,51,.96)_0%,rgba(10,44,78,.90)_46%,rgba(7,29,54,.97)_100%)]"
        aria-hidden
      />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,.12),transparent_30%),radial-gradient(circle_at_80%_80%,rgba(120,205,255,.16),transparent_34%)]" />

      <div className="relative mx-auto max-w-6xl px-5">
        <Reveal>
          <div className="mx-auto max-w-5xl overflow-hidden rounded-[2.25rem] border border-white/15 bg-white/[0.08] p-6 text-center shadow-[0_30px_80px_rgba(0,0,0,.28)] backdrop-blur-2xl sm:p-10 lg:p-14">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full border border-sand/35 bg-sand/10 shadow-[0_0_50px_rgba(255,227,153,.12)]">
              <Sparkles className="size-7 text-sand" />
            </div>

            <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.36em] text-sand/75">
              Uma mensagem para guardar no coração
            </p>

            <h2 className="mx-auto mt-5 max-w-4xl font-display text-3xl font-extrabold leading-[1.08] text-white sm:text-5xl lg:text-6xl">
              Permita-se viver o
              <span className="block bg-gradient-to-r from-sand via-white to-primary-glow bg-clip-text text-transparent">
                extraordinário com Deus.
              </span>
            </h2>

            <p className="mx-auto mt-7 max-w-3xl text-base leading-8 text-white/85 sm:text-xl sm:leading-9">
              Ele te ama e quer transformar a sua vida. Que essas memórias toquem o seu coração
              hoje e sempre, e que o seu espírito seja cheio do amor de Deus.
            </p>

            <div className="mx-auto mt-10 max-w-3xl rounded-[1.75rem] border border-sand/25 bg-black/15 px-6 py-7 shadow-inner sm:px-9">
              <div className="flex items-center justify-center gap-2 text-sand">
                <BookOpen className="size-5" />
                <span className="text-xs font-semibold uppercase tracking-[0.26em]">João 8:32</span>
              </div>
              <blockquote className="mt-4 font-display text-xl font-semibold italic leading-relaxed text-white sm:text-3xl">
                “E conhecereis a verdade, e a verdade vos libertará.”
              </blockquote>
            </div>

            <div className="mx-auto mt-10 flex max-w-2xl items-center justify-center gap-3 text-white/55">
              <Heart className="size-4 fill-sand/15 text-sand" />
              <p className="text-xs font-medium uppercase tracking-[0.22em]">
                Que cada lembrança seja também um encontro com Deus
              </p>
              <Heart className="size-4 fill-sand/15 text-sand" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
