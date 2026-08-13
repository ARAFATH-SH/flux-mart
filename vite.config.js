import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  base: "/flux-mart/",

  server: {
    port: 8080,
    open: true,
  },
});