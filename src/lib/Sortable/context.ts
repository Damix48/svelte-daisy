import { fromAST } from "effect/JSONSchema";
import { Context } from "runed";
import type { SvelteMap } from "svelte/reactivity";

export type SortableGroupContextType = {
  id: string;
  removeItemMap: SvelteMap<string, (index: number) => any>;

  // moveItem: (from: string, to: string, oldIndex: number, newIndex: number) => void;
};

export const sortableGroupContext = new Context<SortableGroupContextType>("sortable-group-context");
