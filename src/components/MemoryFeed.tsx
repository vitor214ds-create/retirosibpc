import { useMemo, useState } from "react";
import { Camera, ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import type { Memory } from "@/lib/memories";
import { MemoryCard } from "@/components/MemoryCard";
import { Reveal } from "@/components/Reveal";
import { useRetreatPhotos } from "@/lib/useRetreatPhotos";

type Filter = "todas" | "recentes" | "curtidas" | "minhas";

export function MemoryFeed({
  memories,
  isLoading,
  onShare,
  onRequireAuth,
}: {
  memories: Memory[];
  isLoading: boolean;
  onShare: () => void;
  onRequireAuth: () => void;
}) {
  const { user } = useAuth();
  const photos = useRetreatPhotos();
  const [filter, setFilter] = useState<Filter>("todas");

  const filters: { key: Filter; label: string }[] = [
    { key: "todas", label: "Todas" },
    { key: "recentes", label: "Mais recentes" },
    { key: "curtidas", label: "Mais curtidas" },
    ...(user ? [{ key: "minhas" as Filter, label: "Minhas memórias" }] : []),
  ];

  const list = useMemo(() => {
    let items = [...memories];
    if (filter === "minhas") items = items.filter((m) => m.user_id === user?.id);
    if (filter === "curtidas") items.sort((a, b) => b.likeCount - a.likeCount);
    return items;
  }, [memories, filter, user?.id]);

  return (
    <section id="feed" className="relative isolate overflow-hidden py-24">
      <div
        className="absolute inset-0 -z-30 bg-cover bg-center opacity-[0.08]"
        style={photos?.group ? { backgroundImage: `url("${photos.group}")` } : undefined}
        aria-hidden
      />
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,rgba(247,251,255,.98),rgba(235,246,252,.96),rgba(247,251,255,.99))]" aria-hidden />
      <div className="absolute left-1/2 top-0 -z-10 h-64 w-[52rem] -translate-x-1/2 rounded-full bg-primary/8 blur-3xl" aria-hidden />
      <div className="mx-auto max-w-2xl px-4">
        <Reveal>
          <div className="text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">
              O álbum
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold text-foreground sm:text-4xl">
              Nossas memórias
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Cada foto guarda um pedaço do que vivemos juntos.
            </p>
          </div>
        </Reveal>

        <div className="sticky top-16 z-30 -mx-4 mt-8 flex gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`shrink-0 rounded-full border px-4 py-2 text-xs font-medium transition ${
                filter === f.key
                  ? "border-primary bg-primary text-primary-foreground shadow-soft"
                  : "border-border bg-card/80 text-muted-foreground backdrop-blur hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
          <Button
            size="sm"
            onClick={onShare}
            className="ml-auto shrink-0 rounded-full bg-gradient-ocean px-4 text-xs text-primary-foreground"
          >
            <Camera className="mr-1.5 size-4" /> Compartilhar memória
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="size-7 animate-spin text-primary" />
          </div>
        ) : list.length === 0 ? (
          <EmptyState filter={filter} onShare={onShare} />
        ) : (
          <div className="mt-6 space-y-8">
            {list.map((memory, i) => (
              <Reveal key={memory.id} delay={Math.min(i, 4) * 80}>
                <MemoryCard memory={memory} onRequireAuth={onRequireAuth} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function EmptyState({ filter, onShare }: { filter: Filter; onShare: () => void }) {
  return (
    <div className="mt-8 overflow-hidden rounded-3xl border border-dashed border-primary/25 bg-card/70 px-6 py-16 text-center backdrop-blur">
      <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-gradient-ocean shadow-glow">
        <ImageIcon className="size-7 text-primary-foreground" />
      </span>
      <h3 className="mt-6 font-display text-xl font-semibold text-foreground">
        {filter === "minhas" ? "Você ainda não publicou memórias" : "O álbum está esperando"}
      </h3>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
        {filter === "minhas"
          ? "Escolha uma foto sua do retiro e conte a história por trás dela."
          : "Seja o primeiro a compartilhar uma foto do retiro e começar esse álbum coletivo."}
      </p>
      <Button onClick={onShare} className="mt-6 rounded-full px-6">
        <Camera className="mr-2 size-4" /> Compartilhar memória
      </Button>
    </div>
  );
}
