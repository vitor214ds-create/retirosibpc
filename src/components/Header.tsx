import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, User as UserIcon, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth, type Profile } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { resolveAvatarUrls } from "@/lib/memories";

export function useProfileAvatar(profile: Profile | null) {
  const { data } = useQuery({
    queryKey: ["avatar", profile?.avatar_url],
    enabled: !!profile?.avatar_url,
    queryFn: async () => {
      const resolve = await resolveAvatarUrls([profile!.avatar_url]);
      return resolve(profile!.avatar_url);
    },
  });
  return data ?? null;
}

export function Header() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const avatar = useProfileAvatar(profile);
  const initials = (profile?.display_name ?? "P").slice(0, 1).toUpperCase();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-deep-sea/40 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="group flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20 transition group-hover:bg-white/20">
            <Waves className="size-4 text-sand" />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-sm font-semibold tracking-tight text-white">
              Memórias do Retiro
            </span>
            <span className="block text-[10px] uppercase tracking-[0.22em] text-sand/70">
              SIBPC 2026
            </span>
          </span>
        </Link>

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 py-1 pl-1 pr-3 text-sm text-white transition hover:bg-white/20">
                <Avatar className="size-8">
                  {avatar ? <AvatarImage src={avatar} alt={profile?.display_name ?? ""} /> : null}
                  <AvatarFallback className="bg-primary text-xs text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden max-w-28 truncate sm:block">
                  {profile?.display_name ?? "Perfil"}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel className="truncate">
                {profile?.display_name ?? "Perfil"}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate({ to: "/perfil" })}>
                <UserIcon className="mr-2 size-4" /> Meu perfil
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () => {
                  await signOut();
                  navigate({ to: "/", replace: true });
                }}
              >
                <LogOut className="mr-2 size-4" /> Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            size="sm"
            onClick={() => navigate({ to: "/auth" })}
            className="rounded-full bg-white/95 px-5 text-deep-sea hover:bg-white"
          >
            Entrar
          </Button>
        )}
      </div>
    </header>
  );
}
