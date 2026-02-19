import { Context } from "runed";
import { SvelteMap } from "svelte/reactivity";
export type SortableGroupContextType = {
    id: string;
    removeItemMap: SvelteMap<string, (index: number) => any>;
};
export declare const sortableGroupContext: Context<SortableGroupContextType>;
