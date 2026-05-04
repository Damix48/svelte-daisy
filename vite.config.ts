import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import devtoolsJson from "vite-plugin-devtools-json";
import { lucideSvelteImportOptimizer } from "./vite/plugins/lucideSvelteImportOptimizer";

export default defineConfig({
  plugins: [lucideSvelteImportOptimizer(), tailwindcss(), sveltekit(), devtoolsJson()]
});
