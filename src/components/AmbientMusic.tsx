import { useEffect, useRef } from "react";

const VIDEO_ID = "J2rTdu7vqTE";
const PLAYER_ELEMENT_ID = "retreat-ambient-music-player";

type YouTubePlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  mute: () => void;
  unMute: () => void;
  setVolume: (volume: number) => void;
  getPlayerState: () => number;
  destroy: () => void;
};

type YouTubePlayerEvent = {
  target: YouTubePlayer;
  data?: number;
};

type YouTubeNamespace = {
  Player: new (
    elementId: string,
    options: {
      videoId: string;
      width: number;
      height: number;
      playerVars: Record<string, string | number>;
      events: {
        onReady: (event: YouTubePlayerEvent) => void;
        onStateChange: (event: YouTubePlayerEvent) => void;
        onError: () => void;
      };
    },
  ) => YouTubePlayer;
  PlayerState: {
    PLAYING: number;
    PAUSED: number;
    ENDED: number;
  };
};

declare global {
  interface Window {
    YT?: YouTubeNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

export function AmbientMusic() {
  const playerRef = useRef<YouTubePlayer | null>(null);

  useEffect(() => {
    let destroyed = false;
    let userUnlockedAudio = false;
    const pauseReasons = new Set<string>();
    const activeNativeVideos = new Set<HTMLVideoElement>();

    const shouldBePaused = () => pauseReasons.size > 0;

    const tryStartWithSound = () => {
      const player = playerRef.current;
      if (!player || shouldBePaused()) return;

      try {
        player.setVolume(45);
        player.unMute();
        player.playVideo();
      } catch {
        // O primeiro gesto do usuário tenta novamente.
      }
    };

    const startAutoplay = () => {
      const player = playerRef.current;
      if (!player || shouldBePaused()) return;

      // Primeiro tenta tocar com som. Navegadores que já deram permissão ao domínio
      // reproduzem imediatamente. Se a política bloquear, o primeiro gesto libera.
      player.setVolume(45);
      player.playVideo();
      player.unMute();

      window.setTimeout(() => {
        if (!destroyed && !shouldBePaused()) {
          player.playVideo();
          player.unMute();
        }
      }, 350);
    };

    const pauseAmbient = (reason: string) => {
      pauseReasons.add(reason);
      playerRef.current?.pauseVideo();
    };

    const resumeAmbient = (reason: string) => {
      pauseReasons.delete(reason);
      if (shouldBePaused()) return;

      const player = playerRef.current;
      if (!player) return;

      player.setVolume(45);
      if (userUnlockedAudio) player.unMute();
      player.playVideo();
    };

    const unlockAudio = () => {
      userUnlockedAudio = true;
      tryStartWithSound();
    };

    const handleNativePlay = (event: Event) => {
      const target = event.target;
      if (!(target instanceof HTMLVideoElement)) return;
      activeNativeVideos.add(target);
      pauseAmbient("native-video");
    };

    const handleNativeStop = (event: Event) => {
      const target = event.target;
      if (!(target instanceof HTMLVideoElement)) return;
      activeNativeVideos.delete(target);
      if (activeNativeVideos.size === 0) resumeAmbient("native-video");
    };

    const hasOpenEmbeddedVideo = () => {
      const openDialogs = Array.from(
        document.querySelectorAll<HTMLElement>(
          '[role="dialog"][data-state="open"], [data-state="open"][role="dialog"]',
        ),
      );

      return openDialogs.some((dialog) =>
        Boolean(
          dialog.querySelector(
            'video, iframe[src*="youtube.com"], iframe[src*="youtu.be"], iframe[src*="vimeo.com"]',
          ),
        ),
      );
    };

    let embeddedVideoOpen = false;
    const syncEmbeddedVideos = () => {
      const next = hasOpenEmbeddedVideo();
      if (next === embeddedVideoOpen) return;
      embeddedVideoOpen = next;

      if (next) pauseAmbient("embedded-video-dialog");
      else resumeAmbient("embedded-video-dialog");
    };

    const observer = new MutationObserver(syncEmbeddedVideos);
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["data-state", "open", "class"],
    });

    const handleFullscreenChange = () => {
      const fullscreen = document.fullscreenElement;
      if (
        fullscreen &&
        (fullscreen.tagName === "VIDEO" ||
          Boolean(fullscreen.querySelector?.("video, iframe")))
      ) {
        pauseAmbient("fullscreen-video");
      } else {
        resumeAmbient("fullscreen-video");
      }
    };

    const handleVideoOpen = () => pauseAmbient("custom-video");
    const handleVideoClose = () => resumeAmbient("custom-video");

    document.addEventListener("play", handleNativePlay, true);
    document.addEventListener("pause", handleNativeStop, true);
    document.addEventListener("ended", handleNativeStop, true);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    window.addEventListener("retreat:video-open", handleVideoOpen);
    window.addEventListener("retreat:video-close", handleVideoClose);

    // Fallback exigido pelos navegadores que bloqueiam autoplay com som.
    window.addEventListener("pointerdown", unlockAudio, { passive: true });
    window.addEventListener("touchstart", unlockAudio, { passive: true });
    window.addEventListener("keydown", unlockAudio);

    const createPlayer = () => {
      if (destroyed || playerRef.current || !window.YT?.Player) return;

      playerRef.current = new window.YT.Player(PLAYER_ELEMENT_ID, {
        videoId: VIDEO_ID,
        width: 1,
        height: 1,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          loop: 1,
          playlist: VIDEO_ID,
          playsinline: 1,
          rel: 0,
          modestbranding: 1,
          iv_load_policy: 3,
        },
        events: {
          onReady: ({ target }) => {
            target.setVolume(45);
            startAutoplay();
          },
          onStateChange: ({ target, data }) => {
            if (!window.YT) return;

            if (data === window.YT.PlayerState.ENDED && !shouldBePaused()) {
              target.playVideo();
            }

            if (
              data === window.YT.PlayerState.PLAYING &&
              !shouldBePaused() &&
              userUnlockedAudio
            ) {
              target.setVolume(45);
              target.unMute();
            }
          },
          onError: () => {
            // Mantém a página funcional mesmo se o player externo falhar.
          },
        },
      });
    };

    if (window.YT?.Player) {
      createPlayer();
    } else {
      const existing = document.querySelector<HTMLScriptElement>(
        'script[src="https://www.youtube.com/iframe_api"]',
      );

      const previousReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previousReady?.();
        createPlayer();
      };

      if (!existing) {
        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        script.async = true;
        document.head.appendChild(script);
      }
    }

    syncEmbeddedVideos();

    return () => {
      destroyed = true;
      observer.disconnect();

      document.removeEventListener("play", handleNativePlay, true);
      document.removeEventListener("pause", handleNativeStop, true);
      document.removeEventListener("ended", handleNativeStop, true);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);

      window.removeEventListener("retreat:video-open", handleVideoOpen);
      window.removeEventListener("retreat:video-close", handleVideoClose);

      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);

      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed -left-[10000px] top-0 h-px w-px overflow-hidden opacity-0"
    >
      <div id={PLAYER_ELEMENT_ID} />
    </div>
  );
}

export function notifyRetreatVideoOpened() {
  window.dispatchEvent(new Event("retreat:video-open"));
}

export function notifyRetreatVideoClosed() {
  window.dispatchEvent(new Event("retreat:video-close"));
}
