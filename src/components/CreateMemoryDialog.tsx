import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { uploadImage, validateImage } from "@/lib/memories";

export function CreateMemoryDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const queryClient = useQueryClient();

  const reset = () => {
    setFile(null);
    setPreview(null);
    setCaption("");
    setProgress(0);
  };

  const pick = (selected: File | undefined) => {
    if (!selected) return;
    const problem = validateImage(selected);
    if (problem) {
      toast.error(problem);
      return;
    }
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const publish = useMutation({
    mutationFn: async () => {
      if (!user || !file) throw new Error("missing");
      setProgress(25);
      const path = await uploadImage("memories", user.id, file);
      setProgress(75);
      const { error } = await supabase.from("posts").insert({
        user_id: user.id,
        image_url: path,
        caption: caption.trim() ? caption.trim() : null,
      });
      if (error) throw error;
      setProgress(100);
    },
    onSuccess: async () => {
      toast.success("Memória publicada. Obrigado por guardar esse momento!");
      await queryClient.invalidateQueries({ queryKey: ["memories"] });
      await queryClient.invalidateQueries({ queryKey: ["stats"] });
      reset();
      onOpenChange(false);
    },
    onError: () => {
      setProgress(0);
      toast.error("Não foi possível publicar a memória. Tente novamente.");
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!publish.isPending) {
          if (!next) reset();
          onOpenChange(next);
        }
      }}
    >
      <DialogContent className="max-h-[92svh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Compartilhar memória</DialogTitle>
          <DialogDescription>
            Escolha uma foto do retiro e conte o que aquele momento significou.
          </DialogDescription>
        </DialogHeader>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => pick(e.target.files?.[0])}
        />

        {preview ? (
          <div className="relative overflow-hidden rounded-2xl border border-border">
            <img src={preview} alt="Pré-visualização" className="max-h-80 w-full object-cover" />
            <button
              type="button"
              onClick={reset}
              disabled={publish.isPending}
              aria-label="Remover imagem"
              className="absolute right-3 top-3 rounded-full bg-black/50 p-2 text-white backdrop-blur transition hover:bg-black/70"
            >
              <X className="size-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border bg-gradient-soft px-6 py-12 text-center transition hover:border-primary"
          >
            <span className="flex size-12 items-center justify-center rounded-full bg-primary/10">
              <ImagePlus className="size-6 text-primary" />
            </span>
            <span className="text-sm font-medium text-foreground">Selecionar foto</span>
            <span className="text-xs text-muted-foreground">JPG, PNG ou WEBP • até 10 MB</span>
          </button>
        )}

        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          maxLength={600}
          rows={3}
          placeholder="Conte a história dessa foto..."
          className="w-full resize-none rounded-2xl border border-input bg-background/70 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/25"
        />

        {publish.isPending && <Progress value={progress} className="h-1.5" />}

        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={publish.isPending}
            className="rounded-full"
          >
            Cancelar
          </Button>
          <Button
            onClick={() => publish.mutate()}
            disabled={!file || publish.isPending}
            className="rounded-full px-6"
          >
            {publish.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
            Publicar memória
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
