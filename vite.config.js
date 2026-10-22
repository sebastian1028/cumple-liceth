import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// La página se publica en https://sebastian1028.github.io/cumple-liseth/
export default defineConfig({
  base: "/cumple-liseth/",
  plugins: [react()],
});
