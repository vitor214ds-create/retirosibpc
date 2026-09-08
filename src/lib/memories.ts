import { supabase } from "@/integrations/supabase/client";

export type MemoryComment = {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  authorName: string;
  authorAvatar: string | null;
};

export type Memory = {
  id: string;
  user_id: string;
  caption: string | null;
  created_at: string;
  imageUrl: string | null;
  imagePath: string;
  authorName: string;
  authorAvatar: string | null;
  likeCount: number;
  likedByMe: boolean;
  comments: MemoryComment[];
};

const SIGNED_TTL = 60 * 60 * 8;

async function signPaths(bucket: string, paths: string[]) {
  const map = new Map<string, string>();
  const unique = [...new Set(paths.filter(Boolean))];
  if (unique.length === 0) return map;
  const { data, error } = await supabase.storage.from(bucket).createSignedUrls(unique, SIGNED_TTL);
  if (error || !data) return map;
  data.forEach((entry) => {
    if (entry.signedUrl && entry.path) map.set(entry.path, entry.signedUrl);
  });
  return map;
}

/** Avatars may be a remote provider URL (Google) or a path inside the avatars bucket. */
export async function resolveAvatarUrls(values: (string | null)[]) {
  const paths = values.filter((v): v is string => !!v && !v.startsWith("http"));
  const signed = await signPaths("avatars", paths);
  const resolve = (value: string | null) =>
    !value ? null : value.startsWith("http") ? value : (signed.get(value) ?? null);
  return resolve;
}

export async function fetchMemories(currentUserId: string | null): Promise<Memory[]> {
  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, user_id, image_url, caption, created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  if (!posts || posts.length === 0) return [];

  const postIds = posts.map((p) => p.id);

  const [likesRes, commentsRes] = await Promise.all([
    supabase.from("likes").select("post_id, user_id").in("post_id", postIds),
    supabase
      .from("comments")
      .select("id, post_id, user_id, content, created_at")
      .in("post_id", postIds)
      .order("created_at", { ascending: true }),
  ]);

  const likes = likesRes.data ?? [];
  const comments = commentsRes.data ?? [];

  const authorIds = [
    ...new Set([...posts.map((p) => p.user_id), ...comments.map((c) => c.user_id)]),
  ];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, display_name, avatar_url")
    .in("id", authorIds);

  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));
  const resolveAvatar = await resolveAvatarUrls((profiles ?? []).map((p) => p.avatar_url));
  const imageMap = await signPaths(
    "memories",
    posts.map((p) => p.image_url),
  );

  return posts.map((post) => {
    const author = profileMap.get(post.user_id);
    const postLikes = likes.filter((l) => l.post_id === post.id);
    return {
      id: post.id,
      user_id: post.user_id,
      caption: post.caption,
      created_at: post.created_at,
      imageUrl: post.image_url.startsWith("http")
        ? post.image_url
        : (imageMap.get(post.image_url) ?? null),
      imagePath: post.image_url,
      authorName: author?.display_name ?? "Participante",
      authorAvatar: resolveAvatar(author?.avatar_url ?? null),
      likeCount: postLikes.length,
      likedByMe: !!currentUserId && postLikes.some((l) => l.user_id === currentUserId),
      comments: comments
        .filter((c) => c.post_id === post.id)
        .map((c) => {
          const commentAuthor = profileMap.get(c.user_id);
          return {
            id: c.id,
            content: c.content,
            created_at: c.created_at,
            user_id: c.user_id,
            authorName: commentAuthor?.display_name ?? "Participante",
            authorAvatar: resolveAvatar(commentAuthor?.avatar_url ?? null),
          };
        }),
    };
  });
}

export async function fetchStats() {
  const [postsCount, profilesCount] = await Promise.all([
    supabase.from("posts").select("id", { count: "exact", head: true }),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
  ]);
  return {
    memories: postsCount.count ?? 0,
    participants: profilesCount.count ?? 0,
  };
}

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

export function validateImage(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "Formato não aceito. Use JPG, PNG ou WEBP.";
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return "A imagem precisa ter no máximo 10 MB.";
  }
  return null;
}

export async function uploadImage(bucket: string, userId: string, file: File) {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) throw error;
  return path;
}

export async function deleteMemory(memory: Memory, currentUserId: string) {
  if (memory.user_id !== currentUserId) {
    throw new Error("Você só pode apagar as suas próprias memórias.");
  }

  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", memory.id)
    .eq("user_id", currentUserId);

  if (error) throw error;

  // O post já foi removido do banco. A limpeza do arquivo é best-effort
  // para não deixar a memória "ressuscitar" caso o storage falhe.
  if (memory.imagePath && !memory.imagePath.startsWith("http")) {
    const { error: storageError } = await supabase.storage
      .from("memories")
      .remove([memory.imagePath]);

    if (storageError) {
      console.warn("Não foi possível limpar a imagem do storage:", storageError);
    }
  }
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
