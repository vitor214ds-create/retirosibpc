import { BookOpen, Heart, Music2, Sparkles } from "lucide-react";
import { Reveal } from "@/components/Reveal";

export function FaithMessage() {
  return (
    <section className="relative overflow-hidden bg-deep-sea py-20 sm:py-24">
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(255,255,255,.12),transparent_36%),radial-gradient(circle_at_85%_80%,rgba(116,199,236,.16),transparent_38%)]"
        aria-hidden
      />
      <div className="absolute -left-20 top-10 size-56 rounded-full bg-primary/15 blur-3xl" aria-hidden />
      <div className="absolute -right-16 bottom-4 size-64 rounded-full bg-sand/10 blur-3xl" aria-hidden />

      <div className="relative mx-auto max-w-5xl px-5">
        <Reveal>
          <div className="mx-auto max-w-4xl rounded-[2rem] border border-white/15 bg-white/[0.08] p-6 text-center shadow-2xl backdrop-blur-xl sm:p-10 lg:p-12">
            <span className="mx-auto flex size-14 items-center justify-center rounded-full border border-sand/30 bg-sand/10">
              <Sparkles className="size-6 text-sand" />
            </span>

            <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.34em] text-sand/80">
              Uma mensagem para guardar no coração
            </p>

            <h2 className="mx-auto mt-4 max-w-3xl font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              Permita-se viver o extraordinário com Deus.
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-white/85 sm:text-lg sm:leading-9">
              Ele te ama e quer transformar a sua vida. Que essas memórias toquem o seu coração
              hoje e sempre, e que o seu espírito seja cheio do amor de Deus.
            </p>

            <div className="mx-auto mt-9 max-w-3xl rounded-3xl border border-sand/25 bg-black/10 px-5 py-6 sm:px-8">
              <div className="flex items-center justify-center gap-2 text-sand">
                <BookOpen className="size-5" />
                <span className="text-xs font-semibold uppercase tracking-[0.24em]">João 8:32</span>
              </div>
              <blockquote className="mt-4 font-display text-xl font-semibold italic leading-relaxed text-white sm:text-2xl">
                “E conhecereis a verdade, e a verdade vos libertará.”
              </blockquote>
            </div>

            <div className="mt-10 border-t border-white/10 pt-9">
              <div className="flex items-center justify-center gap-2">
                <Heart className="size-4 fill-sand/20 text-sand" />
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/65">
                  Trilha das nossas memórias
                </p>
                <Heart className="size-4 fill-sand/20 text-sand" />
              </div>

              <div className="mx-auto mt-5 max-w-2xl overflow-hidden rounded-3xl border border-white/15 bg-black/20 p-3 shadow-xl">
                <div className="mb-3 flex items-center gap-3 px-2 pt-1 text-left">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/10">
                    <Music2 className="size-5 text-sand" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">Santo Espírito</p>
                    <p className="text-xs text-white/55">Laura Souguellis • toque para ouvir</p>
                  </div>
                </div>

                <div className="aspect-video overflow-hidden rounded-2xl bg-black">
                  <iframe
                    className="h-full w-full"
                    src="https://www.youtube.com/embed/5CXcXE69SHY?rel=0"
                    title="Santo Espírito — Laura Souguellis"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </div>

              <p className="mx-auto mt-5 max-w-xl text-xs leading-relaxed text-white/45">
                Aperte o play, relembre cada momento e permita que essa memória também seja um
                encontro com Deus.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
