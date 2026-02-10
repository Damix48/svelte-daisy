import devtoolsJson from "vite-plugin-devtools-json";
import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import { lucideSvelteImportOptimizer } from "./vite/plugins/lucideSvelteImportOptimizer";

export default defineConfig({
  plugins: [lucideSvelteImportOptimizer(),tailwindcss(), sveltekit(), devtoolsJson()]
});
