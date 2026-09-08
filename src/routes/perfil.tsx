import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Camera, Heart, ImageIcon, Loader2, Save, Upload } from "lucide-react";
import { toast } from "sonner";

import { Header } from "@/components/Header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import {
  fetchMemories,
  resolveAvatarUrls,
  uploadImage,
  validateImage,
} from "@/lib/memories";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "Meu perfil — Memórias do Retiro SIBPC" },
      {
        name: "description",
        content: "Seu perfil e suas memórias do Retiro de Jovens SIBPC 2026.",
      },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", replace: true });
  }, [loading, user, navigate]);

  useEffect(() => {
    setName(profile?.display_name ?? "");
  }, [profile?.display_name]);

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  const { data: currentAvatar } = useQuery({
    queryKey: ["profile-avatar", profile?.avatar_url],
    enabled: !!profile?.avatar_url,
    queryFn: async () => {
      const resolve = await resolveAvatarUrls([profile!.avatar_url]);
      return resolve(profile!.avatar_url);
    },
  });

  const { data: memories = [], isLoading: memoriesLoading } = useQuery({
    queryKey: ["memories", user?.id ?? "profile"],
    enabled: !!user,
    queryFn: () => fetchMemories(user?.id ?? null),
  });

  const myMemories = useMemo(
    () => memories.filter((memory) => memory.user_id === user?.id),
    [memories, user?.id],
  );

  const likesReceived = useMemo(
    () => myMemories.reduce((total, memory) => total + memory.likeCount, 0),
    [myMemories],
  );

  const initials = (profile?.display_name || user?.email || "P").slice(0, 1).toUpperCase();

  const saveProfile = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Faça login novamente.");
      const displayName = name.trim();
      if (displayName.length < 2) throw new Error("Informe um nome com pelo menos 2 caracteres.");

      let avatarPath = profile?.avatar_url ?? null;
      if (avatarFile) {
        avatarPath = await uploadImage("avatars", user.id, avatarFile);
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: displayName,
          avatar_url: avatarPath,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;
    },
    onSuccess: async () => {
      toast.success("Perfil atualizado.");
      setAvatarFile(null);
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
      setAvatarPreview(null);
      await queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
      await queryClient.invalidateQueries({ queryKey: ["profile-avatar"] });
      await queryClient.invalidateQueries({ queryKey: ["avatar"] });
      await queryClient.invalidateQueries({ queryKey: ["memories"] });
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : "Não foi possível atualizar o perfil."),
  });

  const chooseAvatar = (file: File | undefined) => {
    if (!file) return;
    const error = validateImage(file);
    if (error) {
      toast.error(error);
      return;
    }
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-7 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Header />

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-24">
        <button
          onClick={() => navigate({ to: "/" })}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-2 text-sm text-muted-foreground backdrop-blur transition hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Voltar para o álbum
        </button>

        <section className="mt-6 overflow-hidden rounded-[2rem] border border-border bg-card shadow-card">
          <div className="relative h-40 bg-gradient-ocean sm:h-52">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,.22),transparent_42%)]" />
            <div className="absolute bottom-5 left-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/70">
                Memórias do Retiro SIBPC
              </p>
              <p className="mt-1 font-display text-xl font-semibold text-white">Do raso ao profundo</p>
            </div>
          </div>

          <div className="grid gap-8 px-5 pb-7 sm:px-8 lg:grid-cols-[280px_1fr]">
            <div className="-mt-16">
              <div className="rounded-[2rem] border border-border bg-card p-5 shadow-soft">
                <div className="flex flex-col items-center text-center">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="group relative rounded-full"
                    aria-label="Alterar foto do perfil"
                  >
                    <Avatar className="size-28 border-4 border-card shadow-card">
                      <AvatarImage
                        src={avatarPreview ?? currentAvatar ?? undefined}
                        alt={profile?.display_name ?? "Perfil"}
                      />
                      <AvatarFallback className="bg-primary text-3xl text-primary-foreground">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="absolute inset-0 flex items-center justify-center rounded-full bg-deep-sea/60 text-white opacity-0 transition group-hover:opacity-100">
                      <Camera className="size-6" />
                    </span>
                  </button>

                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => chooseAvatar(e.target.files?.[0])}
                  />

                  <h1 className="mt-4 font-display text-2xl font-bold text-foreground">
                    {profile?.display_name ?? "Participante"}
                  </h1>
                  <p className="mt-1 text-xs text-muted-foreground">{user.email}</p>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Na memória desde{" "}
                    {profile?.joined_at
                      ? new Date(profile.joined_at).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })
                      : "2026"}
                  </p>

                  <div className="mt-5 grid w-full grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-muted/60 px-3 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <ImageIcon className="size-4 text-primary" />
                        <span className="font-display text-2xl font-bold text-foreground">
                          {myMemories.length}
                        </span>
                      </div>
                      <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                        memórias
                      </p>
                    </div>
                    <div className="rounded-2xl bg-muted/60 px-3 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Heart className="size-4 text-primary" />
                        <span className="font-display text-2xl font-bold text-foreground">
                          {likesReceived}
                        </span>
                      </div>
                      <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                        curtidas
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 lg:pt-8">
              <div className="max-w-xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">
                  Seu perfil
                </p>
                <h2 className="mt-2 font-display text-2xl font-bold text-foreground">
                  Como você aparece nas memórias
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Seu nome e sua foto aparecem em tudo o que você publicar e comentar no álbum.
                </p>

                <label className="mt-6 block">
                  <span className="mb-2 block text-sm font-medium text-foreground">Nome</span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={80}
                    className="h-11 w-full rounded-xl border border-input bg-background px-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                    placeholder="Seu nome"
                  />
                </label>

                <div className="mt-4 flex flex-wrap gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full"
                    onClick={() => fileRef.current?.click()}
                  >
                    <Upload className="mr-2 size-4" />
                    Alterar foto
                  </Button>
                  <Button
                    type="button"
                    className="rounded-full px-6"
                    disabled={saveProfile.isPending}
                    onClick={() => saveProfile.mutate()}
                  >
                    {saveProfile.isPending ? (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 size-4" />
                    )}
                    Salvar perfil
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">
              Seu álbum
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-foreground">
              Minhas memórias
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              As fotos que você compartilhou com todo mundo.
            </p>
          </div>

          {memoriesLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="size-7 animate-spin text-primary" />
            </div>
          ) : myMemories.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-dashed border-primary/25 bg-card/70 px-6 py-14 text-center">
              <ImageIcon className="mx-auto size-9 text-primary" />
              <h3 className="mt-4 font-display text-xl font-semibold text-foreground">
                Sua primeira memória ainda está esperando
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                Volte para o álbum e compartilhe uma foto especial do retiro.
              </p>
              <Button onClick={() => navigate({ to: "/" })} className="mt-5 rounded-full">
                <Camera className="mr-2 size-4" />
                Ir para o álbum
              </Button>
            </div>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {myMemories.map((memory) => (
                <article
                  key={memory.id}
                  className="group overflow-hidden rounded-3xl border border-border bg-card shadow-soft"
                >
                  <div className="aspect-square overflow-hidden bg-muted">
                    {memory.imageUrl ? (
                      <img
                        src={memory.imageUrl}
                        alt={memory.caption || "Memória do Retiro SIBPC"}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <ImageIcon className="size-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    {memory.caption ? (
                      <p className="line-clamp-2 text-sm leading-relaxed text-foreground">
                        {memory.caption}
                      </p>
                    ) : (
                      <p className="text-sm italic text-muted-foreground">Uma memória sem legenda.</p>
                    )}
                    <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Heart className="size-3.5" />
                        {memory.likeCount}
                      </span>
                      <span>{memory.comments.length} comentários</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
