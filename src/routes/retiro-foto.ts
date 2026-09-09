import { createFileRoute } from "@tanstack/react-router";
import { RETREAT_BACKGROUND } from "@/assets/retreat-background";

export const Route = createFileRoute("/retiro-foto")({
  server: {
    handlers: {
      GET: async () => {
        const base64 = RETREAT_BACKGROUND.split(",")[1];
        if (!base64) {
          return new Response("Imagem indisponível", { status: 404 });
        }

        const bytes = Buffer.from(base64, "base64");

        return new Response(bytes, {
          headers: {
            "Content-Type": "image/jpeg",
            "Cache-Control": "public, max-age=31536000, immutable",
            "Content-Length": String(bytes.byteLength),
          },
        });
      },
    },
  },
});
