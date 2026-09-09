import { useEffect, useState } from "react";
import { RETREAT_GROUP_BASE64, RETREAT_PLAQUE_BASE64 } from "@/assets/retreat-photo-data";

function makeObjectUrl(base64: string) {
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return URL.createObjectURL(new Blob([bytes], { type: "image/jpeg" }));
}

export function useRetreatPhotos() {
  const [urls, setUrls] = useState<{ group: string; plaque: string } | null>(null);

  useEffect(() => {
    const group = makeObjectUrl(RETREAT_GROUP_BASE64);
    const plaque = makeObjectUrl(RETREAT_PLAQUE_BASE64);
    setUrls({ group, plaque });

    return () => {
      URL.revokeObjectURL(group);
      URL.revokeObjectURL(plaque);
    };
  }, []);

  return urls;
}
