import { Context } from "runed";
import { SvelteMap } from "svelte/reactivity";
import { fromAST } from "effect/JSONSchema";

export type SortableGroupContextType = {
  id: string;
  removeItemMap: SvelteMap<string, (index: number) => any>;

  // moveItem: (from: string, to: string, oldIndex: number, newIndex: number) => void;
};

export const sortableGroupContext = new Context<SortableGroupContextType>("sortable-group-context");
