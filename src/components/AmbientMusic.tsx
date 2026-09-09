import { useEffect, useRef } from "react";

const VIDEO_ID = "5CXcXE69SHY";

export function AmbientMusic() {
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    let unlocked = false;
    let retries = 0;

    const command = (func: string, args: unknown[] = []) => {
      frameRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: "command", func, args }),
        "https://www.youtube.com",
      );
    };

    // Autoplay permitido pelos navegadores: inicia mudo imediatamente.
    const startMuted = () => {
      command("mute");
      command("setVolume", [42]);
      command("playVideo");
    };

    // Assim que existe um gesto do visitante, libera o som sem mostrar player.
    const unlockSound = () => {
      if (unlocked) return;
      unlocked = true;
      command("playVideo");
      command("setVolume", [42]);
      command("unMute");

      window.removeEventListener("pointerdown", unlockSound);
      window.removeEventListener("keydown", unlockSound);
      window.removeEventListener("touchstart", unlockSound);
    };

    const tryAutoplay = () => {
      startMuted();
      retries += 1;
      if (retries < 5) window.setTimeout(tryAutoplay, 900);
    };

    const initialTimer = window.setTimeout(tryAutoplay, 350);

    window.addEventListener("pointerdown", unlockSound, { passive: true });
    window.addEventListener("keydown", unlockSound);
    window.addEventListener("touchstart", unlockSound, { passive: true });

    return () => {
      window.clearTimeout(initialTimer);
      window.removeEventListener("pointerdown", unlockSound);
      window.removeEventListener("keydown", unlockSound);
      window.removeEventListener("touchstart", unlockSound);
    };
  }, []);

  return (
    <iframe
      ref={frameRef}
      onLoad={() => {
        frameRef.current?.contentWindow?.postMessage(
          JSON.stringify({ event: "command", func: "playVideo", args: [] }),
          "https://www.youtube.com",
        );
      }}
      src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&mute=1&loop=1&playlist=${VIDEO_ID}&controls=0&disablekb=1&fs=0&playsinline=1&rel=0&enablejsapi=1&modestbranding=1&origin=${typeof window !== "undefined" ? window.location.origin : ""}`}
      title="Trilha ambiente do memorial"
      allow="autoplay; encrypted-media"
      aria-hidden="true"
      tabIndex={-1}
      className="pointer-events-none fixed -left-[10000px] top-0 h-px w-px opacity-0"
    />
  );
}
