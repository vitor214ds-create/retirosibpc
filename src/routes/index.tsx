import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Header } from "@/components/Header";
import { HeroMemory } from "@/components/HeroMemory";
import { MemoryFeed } from "@/components/MemoryFeed";
import { CreateMemoryDialog } from "@/components/CreateMemoryDialog";
import { Waves } from "@/components/Waves";
import { useAuth } from "@/lib/auth";
import { fetchMemories, fetchStats } from "@/lib/memories";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Memórias do Retiro SIBPC — Retiro de Jovens 2026" },
      {
        name: "description",
        content:
          "O álbum digital do Retiro de Jovens SIBPC 2026. Compartilhe fotos, lembranças e comentários: alguns dias passam, o que Deus fez em nós permanece.",
      },
      { property: "og:title", content: "Memórias do Retiro SIBPC" },
      {
        property: "og:description",
        content:
          "Fotos e lembranças do Retiro de Jovens SIBPC 2026. Do raso ao profundo — Ezequiel 47:5.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [createOpen, setCreateOpen] = useState(false);

  const { data: memories, isLoading } = useQuery({
    queryKey: ["memories", user?.id ?? "anon"],
    queryFn: () => fetchMemories(user?.id ?? null),
  });

  const { data: stats } = useQuery({ queryKey: ["stats"], queryFn: fetchStats });

  const requireAuth = () => navigate({ to: "/auth" });
  const handleShare = () => (user ? setCreateOpen(true) : requireAuth());

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroMemory stats={stats} onShare={handleShare} />
        <MemoryFeed
          memories={memories ?? []}
          isLoading={isLoading}
          onShare={handleShare}
          onRequireAuth={requireAuth}
        />
      </main>

      <footer className="relative overflow-hidden bg-deep-sea pt-20 pb-12 text-center">
        <Waves className="top-0 rotate-180" color="oklch(0.94 0.04 220)" />
        <div className="relative mx-auto max-w-xl px-6">
          <p className="font-display text-xs uppercase tracking-[0.42em] text-sand/80">
            Do raso ao profundo
          </p>
          <p className="mt-6 font-display text-lg italic leading-relaxed text-white/90">
            “Grandes coisas fez o Senhor por nós, e por isso estamos alegres.”
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-sand/70">Salmos 126:3</p>
          <p className="mt-10 text-[11px] text-white/50">
            Memórias do Retiro SIBPC • Retiro de Jovens • 2026
          </p>
        </div>
      </footer>

      <CreateMemoryDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
