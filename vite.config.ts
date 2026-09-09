// @lovable.dev/vite-tanstack-config já inclui TanStack Start, React,
// Tailwind, aliases, SSR e Nitro para o ambiente Lovable.
// No Vercel precisamos trocar explicitamente o preset do Nitro,
// caso contrário o build pode sair no formato Cloudflare e as rotas SSR retornarem 404.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const isVercel = Boolean(process.env.VERCEL);

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },

  // Lovable mantém o comportamento padrão no preview.
  // Vercel recebe um output Nitro compatível com Vercel Functions.
  nitro: isVercel
    ? {
        preset: "vercel",
      }
    : true,
});
