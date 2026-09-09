import { useEffect, useState } from "react";

export type DeviceMode = "mobile" | "tablet" | "desktop";

export type DeviceProfile = {
  mode: DeviceMode;
  isTouch: boolean;
  isPortrait: boolean;
  isCompact: boolean;
};

function readProfile(): DeviceProfile {
  if (typeof window === "undefined") {
    return { mode: "desktop", isTouch: false, isPortrait: false, isCompact: false };
  }

  const width = window.innerWidth;
  const mode: DeviceMode = width < 768 ? "mobile" : width < 1100 ? "tablet" : "desktop";
  const isTouch =
    window.matchMedia("(pointer: coarse)").matches ||
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0;
  const isPortrait = window.matchMedia("(orientation: portrait)").matches;

  return {
    mode,
    isTouch,
    isPortrait,
    isCompact: mode !== "desktop",
  };
}

export function useDeviceProfile() {
  const [profile, setProfile] = useState<DeviceProfile>(() => readProfile());

  useEffect(() => {
    const update = () => setProfile(readProfile());
    const orientation = window.matchMedia("(orientation: portrait)");
    const pointer = window.matchMedia("(pointer: coarse)");

    window.addEventListener("resize", update, { passive: true });
    orientation.addEventListener("change", update);
    pointer.addEventListener("change", update);

    return () => {
      window.removeEventListener("resize", update);
      orientation.removeEventListener("change", update);
      pointer.removeEventListener("change", update);
    };
  }, []);

  return profile;
}
