import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Send, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { formatDate, type MemoryComment } from "@/lib/memories";

export function Comments({
  postId,
  comments,
  onRequireAuth,
}: {
  postId: string;
  comments: MemoryComment[];
  onRequireAuth: () => void;
}) {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const queryClient = useQueryClient();
  const [showAll, setShowAll] = useState(false);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["memories"] });

  const addComment = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("auth");
      const { error } = await supabase
        .from("comments")
        .insert({ post_id: postId, user_id: user.id, content: text.trim() });
      if (error) throw error;
    },
    onSuccess: () => {
      setText("");
      invalidate();
    },
    onError: () => toast.error("Não foi possível enviar sua lembrança."),
  });

  const removeComment = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("comments").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Comentário removido.");
      invalidate();
    },
    onError: () => toast.error("Não foi possível remover o comentário."),
  });

  const visible = showAll ? comments : comments.slice(-3);

  return (
    <div className="space-y-3">
      {comments.length > 3 && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="text-xs font-medium text-primary hover:underline"
        >
          Ver todos os {comments.length} comentários
        </button>
      )}

      <ul className="space-y-3">
        {visible.map((c) => (
          <li key={c.id} className="group flex gap-3">
            <Avatar className="size-8 shrink-0">
              {c.authorAvatar ? <AvatarImage src={c.authorAvatar} alt={c.authorName} /> : null}
              <AvatarFallback className="bg-secondary text-[11px] text-secondary-foreground">
                {c.authorName.slice(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1 rounded-2xl rounded-tl-sm bg-secondary/60 px-3.5 py-2.5">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-xs font-semibold text-foreground">{c.authorName}</p>
                <span className="shrink-0 text-[10px] text-muted-foreground">
                  {formatDate(c.created_at)}
                </span>
              </div>
              <p className="mt-1 whitespace-pre-line break-words text-sm text-foreground/90">
                {c.content}
              </p>
            </div>
            {user?.id === c.user_id && (
              <button
                onClick={() => removeComment.mutate(c.id)}
                aria-label="Excluir comentário"
                className="mt-1 text-muted-foreground opacity-0 transition hover:text-destructive group-hover:opacity-100"
              >
                <Trash2 className="size-4" />
              </button>
            )}
          </li>
        ))}
      </ul>

      {user ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (text.trim().length === 0) return;
            addComment.mutate();
          }}
          className="flex items-center gap-2"
        >
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={500}
            placeholder="Escreva uma lembrança..."
            className="h-10 flex-1 rounded-full border border-input bg-background/70 px-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/25"
          />
          <Button
            type="submit"
            size="icon"
            disabled={addComment.isPending || text.trim().length === 0}
            className="size-10 shrink-0 rounded-full"
          >
            <Send className="size-4" />
          </Button>
        </form>
      ) : (
        <button
          onClick={onRequireAuth}
          className="w-full rounded-full border border-dashed border-border py-2.5 text-xs font-medium text-muted-foreground transition hover:border-primary hover:text-primary"
        >
          Entre para escrever uma lembrança
        </button>
      )}
    </div>
  );
}
