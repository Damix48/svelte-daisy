import MagicString from "magic-string";
import type { Plugin } from "vite";

export function lucideSvelteImportOptimizer(): Plugin {
  return {
    name: "lucide-svelte-optimizer",
    enforce: "pre", // IMPORTANT
    transform(code, id) {
      // Only run on source files
      if (!id.endsWith(".ts") && !id.endsWith(".js") && !id.endsWith(".svelte")) {
        return;
      }

      const ms = new MagicString(code, { filename: id });

      ms.replace(/([ \t]*)import\s+\{([^}]+)\}\s+from\s+['"]@lucide\/svelte['"];?/g, (match, whitespace: string, importNames: string) => {
        const hasSemi = match.endsWith(";");

        const imports = importNames.split(",").map((v) => v.trim());

        const runtimeImports: string[] = [];

        for (const item of imports) {
          // Check if it starts with `type`
          const typeMatch = item.match(/^type\s+(\w+)(?:\s+as\s+(\w+))?$/);
          if (typeMatch) {
            // It's a type-only import, leave it as-is
            const [_, original, alias] = typeMatch;
            runtimeImports.push(`${whitespace}import { type ${original}${alias ? ` as ${alias} }` : ""} from '@lucide/svelte'${hasSemi ? ";" : ""}`);
          } else {
            // Runtime import → rewrite to icons path
            const [name, alias] = item.split(/\s+as\s+/).map((s) => s.trim());
            const path = name
              .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
              .replace(/([a-zA-Z])([0-9]+)/g, "$1-$2")
              .toLowerCase();
            runtimeImports.push(`${whitespace}import ${alias ? `${name} as ${alias}` : name} from '@lucide/svelte/icons/${path}'${hasSemi ? ";" : ""}`);
          }
        }

        return runtimeImports.join("\n");
      });

      if (ms.hasChanged()) {
        return {
          code: ms.toString(),
          map: ms.generateMap({ hires: true })
        };
      }
    }
  };
}
