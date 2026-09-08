import { useEffect, useRef } from "react";

const VIDEO_ID = "5CXcXE69SHY";

export function AmbientMusic() {
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const command = (func: string, args: unknown[] = []) => {
      frameRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: "command", func, args }),
        "https://www.youtube.com",
      );
    };

    const startMusic = () => {
      command("unMute");
      command("setVolume", [42]);
      command("playVideo");
    };

    // Tenta iniciar assim que o iframe estiver pronto.
    const timer = window.setTimeout(startMusic, 1200);

    // Navegadores modernos podem bloquear áudio com som sem gesto do usuário.
    // Nesse caso, o primeiro toque/clique/tecla inicia a trilha sem mostrar player.
    const unlock = () => {
      startMusic();
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
      window.removeEventListener("touchstart", unlock);
    };

    window.addEventListener("pointerdown", unlock, { passive: true });
    window.addEventListener("keydown", unlock);
    window.addEventListener("touchstart", unlock, { passive: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
      window.removeEventListener("touchstart", unlock);
    };
  }, []);

  return (
    <iframe
      ref={frameRef}
      src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&loop=1&playlist=${VIDEO_ID}&controls=0&disablekb=1&fs=0&playsinline=1&rel=0&enablejsapi=1&origin=${typeof window !== "undefined" ? window.location.origin : ""}`}
      title="Trilha ambiente do memorial"
      allow="autoplay; encrypted-media"
      aria-hidden="true"
      tabIndex={-1}
      className="pointer-events-none fixed -left-[9999px] top-0 h-px w-px opacity-0"
    />
  );
}
