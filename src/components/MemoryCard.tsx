import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, MessageCircle, MoreVertical, Share2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { deleteMemory, formatDate, type Memory } from "@/lib/memories";
import { Comments } from "@/components/Comments";

export function MemoryCard({
  memory,
  onRequireAuth,
}: {
  memory: Memory;
  onRequireAuth: () => void;
}) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [lightbox, setLightbox] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["memories"] });

  const toggleLike = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("auth");
      if (memory.likedByMe) {
        const { error } = await supabase
          .from("likes")
          .delete()
          .eq("post_id", memory.id)
          .eq("user_id", user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("likes")
          .insert({ post_id: memory.id, user_id: user.id });
        if (error) throw error;
      }
    },
    onSuccess: invalidate,
    onError: () => toast.error("Não foi possível curtir agora."),
  });

  const removePost = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Faça login novamente.");
      await deleteMemory(memory, user.id);
    },
    onSuccess: async () => {
      toast.success("Memória excluída.");
      await queryClient.invalidateQueries({ queryKey: ["memories"] });
      await queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
    onError: () => toast.error("Não foi possível excluir a memória."),
  });

  const share = async () => {
    const url = `${window.location.origin}/?memoria=${memory.id}`;
    const shareData = {
      title: "Memórias do Retiro SIBPC",
      text: memory.caption ?? "Uma memória do Retiro de Jovens SIBPC",
      url,
    };
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        /* usuário cancelou — cai no fallback */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copiado!");
    } catch {
      toast.error("Não foi possível copiar o link.");
    }
  };

  return (
    <article className="overflow-hidden rounded-3xl border border-border/70 bg-card/80 shadow-card backdrop-blur-sm transition hover:shadow-soft">
      <header className="flex items-center gap-3 px-4 py-3.5">
        <Avatar className="size-10">
          {memory.authorAvatar ? (
            <AvatarImage src={memory.authorAvatar} alt={memory.authorName} />
          ) : null}
          <AvatarFallback className="bg-primary/10 text-sm text-primary">
            {memory.authorName.slice(0, 1).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">{memory.authorName}</p>
          <p className="text-[11px] text-muted-foreground">{formatDate(memory.created_at)}</p>
        </div>
        {user?.id === memory.user_id && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                aria-label="Opções da memória"
                className="rounded-full p-2 text-muted-foreground transition hover:bg-secondary"
              >
                <MoreVertical className="size-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => {
                  const confirmed = window.confirm(
                    "Apagar esta memória? A foto, os comentários e as curtidas serão removidos definitivamente.",
                  );
                  if (confirmed) removePost.mutate();
                }}
                disabled={removePost.isPending}
              >
                <Trash2 className="mr-2 size-4" /> {removePost.isPending ? "Apagando..." : "Apagar memória"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </header>

      <button
        onClick={() => setLightbox(true)}
        className="group relative block w-full overflow-hidden bg-secondary/60"
      >
        {memory.imageUrl ? (
          <img
            src={memory.imageUrl}
            alt={memory.caption ?? "Memória do retiro"}
            loading="lazy"
            className="max-h-[70vh] w-full object-cover transition duration-700 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-72 items-center justify-center text-sm text-muted-foreground">
            Imagem indisponível
          </div>
        )}
      </button>

      <div className="space-y-3 px-4 py-4">
        <div className="flex items-center gap-1">
          <button
            onClick={() => (user ? toggleLike.mutate() : onRequireAuth())}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition hover:bg-secondary"
          >
            <Heart
              className={
                memory.likedByMe
                  ? "size-5 fill-destructive text-destructive"
                  : "size-5 text-muted-foreground"
              }
            />
            <span className="text-foreground">{memory.likeCount}</span>
          </button>
          <button
            onClick={() => setShowComments((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition hover:bg-secondary"
          >
            <MessageCircle className="size-5 text-muted-foreground" />
            <span className="text-foreground">{memory.comments.length}</span>
          </button>
          <button
            onClick={share}
            aria-label="Compartilhar"
            className="ml-auto rounded-full px-3 py-1.5 transition hover:bg-secondary"
          >
            <Share2 className="size-5 text-muted-foreground" />
          </button>
        </div>

        {memory.caption && (
          <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">
            <span className="font-semibold">{memory.authorName}</span> {memory.caption}
          </p>
        )}

        {(showComments || memory.comments.length > 0) && (
          <Comments
            postId={memory.id}
            comments={memory.comments}
            onRequireAuth={onRequireAuth}
          />
        )}
      </div>

      <Dialog open={lightbox} onOpenChange={setLightbox}>
        <DialogContent className="max-w-4xl border-none bg-transparent p-0 shadow-none">
          {memory.imageUrl && (
            <img
              src={memory.imageUrl}
              alt={memory.caption ?? "Memória do retiro"}
              className="max-h-[85svh] w-full rounded-2xl object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </article>
  );
}
