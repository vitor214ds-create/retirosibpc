import { useEffect } from "react";

const VIDEO_ID = "J2rTdu7vqTE";
const PLAYER_HOST_ID = "retreat-ambient-music-singleton";
const PLAYER_TARGET_ID = "retreat-ambient-music-target";

type YouTubePlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  mute: () => void;
  unMute: () => void;
  setVolume: (volume: number) => void;
  getPlayerState: () => number;
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

type AmbientState = {
  initialized: boolean;
  player: YouTubePlayer | null;
  ready: boolean;
  unlocked: boolean;
  pauseReasons: Set<string>;
  activeVideos: Set<HTMLVideoElement>;
  embeddedVideoOpen: boolean;
  observer: MutationObserver | null;
};

declare global {
  interface Window {
    YT?: YouTubeNamespace;
    onYouTubeIframeAPIReady?: () => void;
    __retreatAmbientMusic?: AmbientState;
  }
}

function getAmbientState(): AmbientState {
  if (!window.__retreatAmbientMusic) {
    window.__retreatAmbientMusic = {
      initialized: false,
      player: null,
      ready: false,
      unlocked: false,
      pauseReasons: new Set<string>(),
      activeVideos: new Set<HTMLVideoElement>(),
      embeddedVideoOpen: false,
      observer: null,
    };
  }
  return window.__retreatAmbientMusic;
}

function isPaused(state: AmbientState) {
  return state.pauseReasons.size > 0;
}

function playAmbient(state: AmbientState) {
  if (!state.player || !state.ready || isPaused(state)) return;

  state.player.setVolume(45);
  state.player.playVideo();

  if (state.unlocked) {
    state.player.unMute();
  } else {
    state.player.mute();
  }
}

function pauseAmbient(state: AmbientState, reason: string) {
  state.pauseReasons.add(reason);
  state.player?.pauseVideo();
}

function resumeAmbient(state: AmbientState, reason: string) {
  state.pauseReasons.delete(reason);
  if (!isPaused(state)) playAmbient(state);
}

function hasOpenEmbeddedVideo() {
  const dialogs = Array.from(
    document.querySelectorAll<HTMLElement>(
      '[role="dialog"][data-state="open"], [data-state="open"][role="dialog"]',
    ),
  );

  return dialogs.some((dialog) =>
    Boolean(
      dialog.querySelector(
        'video, iframe[src*="youtube.com"], iframe[src*="youtu.be"], iframe[src*="vimeo.com"]',
      ),
    ),
  );
}

function ensurePlayerHost() {
  let host = document.getElementById(PLAYER_HOST_ID);

  if (!host) {
    host = document.createElement("div");
    host.id = PLAYER_HOST_ID;
    host.setAttribute("aria-hidden", "true");
    host.style.position = "fixed";
    host.style.left = "-10000px";
    host.style.top = "0";
    host.style.width = "1px";
    host.style.height = "1px";
    host.style.overflow = "hidden";
    host.style.opacity = "0";
    host.style.pointerEvents = "none";

    const target = document.createElement("div");
    target.id = PLAYER_TARGET_ID;
    host.appendChild(target);
    document.body.appendChild(host);
  }

  return host;
}

function setupGlobalListeners(state: AmbientState) {
  const unlock = () => {
    state.unlocked = true;

    if (!isPaused(state) && state.player && state.ready) {
      state.player.setVolume(45);
      state.player.unMute();
      state.player.playVideo();
    }
  };

  const onVideoPlay = (event: Event) => {
    const video = event.target;
    if (!(video instanceof HTMLVideoElement)) return;
    state.activeVideos.add(video);
    pauseAmbient(state, "native-video");
  };

  const onVideoStop = (event: Event) => {
    const video = event.target;
    if (!(video instanceof HTMLVideoElement)) return;
    state.activeVideos.delete(video);

    if (state.activeVideos.size === 0) {
      resumeAmbient(state, "native-video");
    }
  };

  const syncEmbeddedVideo = () => {
    const open = hasOpenEmbeddedVideo();
    if (open === state.embeddedVideoOpen) return;

    state.embeddedVideoOpen = open;
    if (open) pauseAmbient(state, "embedded-video");
    else resumeAmbient(state, "embedded-video");
  };

  const onFullscreenChange = () => {
    const element = document.fullscreenElement;
    const containsVideo =
      !!element &&
      (element.tagName === "VIDEO" ||
        Boolean(element.querySelector?.('video, iframe[src*="youtube"], iframe[src*="vimeo"]')));

    if (containsVideo) pauseAmbient(state, "fullscreen-video");
    else resumeAmbient(state, "fullscreen-video");
  };

  const onCustomOpen = () => pauseAmbient(state, "custom-video");
  const onCustomClose = () => resumeAmbient(state, "custom-video");

  document.addEventListener("play", onVideoPlay, true);
  document.addEventListener("pause", onVideoStop, true);
  document.addEventListener("ended", onVideoStop, true);
  document.addEventListener("fullscreenchange", onFullscreenChange);

  window.addEventListener("retreat:video-open", onCustomOpen);
  window.addEventListener("retreat:video-close", onCustomClose);

  // Um único conjunto de listeners. O primeiro gesto apenas DESMUTA o player existente;
  // nunca cria um segundo player.
  window.addEventListener("pointerdown", unlock, { passive: true });
  window.addEventListener("touchstart", unlock, { passive: true });
  window.addEventListener("keydown", unlock);

  state.observer = new MutationObserver(syncEmbeddedVideo);
  state.observer.observe(document.body, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ["data-state", "open", "class"],
  });

  syncEmbeddedVideo();
}

function createYouTubePlayer(state: AmbientState) {
  if (state.player || !window.YT?.Player) return;

  ensurePlayerHost();

  state.player = new window.YT.Player(PLAYER_TARGET_ID, {
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
        state.ready = true;
        target.setVolume(45);

        // Autoplay permitido pelos navegadores: começa mudo.
        // Se o domínio tiver permissão para som, o primeiro gesto não cria outra música:
        // apenas desmuta esta mesma instância.
        target.mute();
        if (!isPaused(state)) target.playVideo();
      },
      onStateChange: ({ target, data }) => {
        if (!window.YT) return;

        if (data === window.YT.PlayerState.ENDED && !isPaused(state)) {
          target.playVideo();
        }
      },
      onError: () => {
        // O memorial continua utilizável caso o provedor externo falhe.
      },
    },
  });
}

function initializeAmbientMusic() {
  const state = getAmbientState();

  // É a trava que impede React StrictMode, navegação ou remount de criar duas músicas.
  if (state.initialized) {
    playAmbient(state);
    return;
  }

  state.initialized = true;

  // Limpa vestígios de implementações anteriores antes de criar o singleton.
  document
    .querySelectorAll(
      '#retreat-ambient-music-player, iframe[title="Trilha ambiente do memorial"]',
    )
    .forEach((node) => node.remove());

  setupGlobalListeners(state);
  ensurePlayerHost();

  if (window.YT?.Player) {
    createYouTubePlayer(state);
    return;
  }

  const previousReady = window.onYouTubeIframeAPIReady;
  window.onYouTubeIframeAPIReady = () => {
    previousReady?.();
    createYouTubePlayer(state);
  };

  if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    document.head.appendChild(script);
  }
}

export function AmbientMusic() {
  useEffect(() => {
    initializeAmbientMusic();
  }, []);

  return null;
}

export function notifyRetreatVideoOpened() {
  const state = getAmbientState();
  pauseAmbient(state, "custom-video");
}

export function notifyRetreatVideoClosed() {
  const state = getAmbientState();
  resumeAmbient(state, "custom-video");
}
