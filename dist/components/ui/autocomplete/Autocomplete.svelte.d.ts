import type { HTMLInputAttributes } from "svelte/elements";
import type { Snippet } from "svelte";
declare function $$render<TItem>(): {
    props: {
        items?: TItem[];
        search?: ((query: string) => Promise<TItem[]>) | ((query: string) => TItem[]);
        debounce?: number;
        value?: string;
        onItemSelected?: (item: TItem) => void;
        itemToString?: (item: TItem) => string;
        itemToId?: (item: TItem) => string | number;
        itemTemplate?: Snippet<[TItem]>;
        placeholder?: string;
        minSearchLength?: number;
    } & Omit<HTMLInputAttributes, "id" | "type" | "value">;
    exports: {};
    bindings: "value";
    slots: {};
    events: {};
};
declare class __sveltets_Render<TItem> {
    props(): ReturnType<typeof $$render<TItem>>['props'];
    events(): ReturnType<typeof $$render<TItem>>['events'];
    slots(): ReturnType<typeof $$render<TItem>>['slots'];
    bindings(): "value";
    exports(): {};
}
interface $$IsomorphicComponent {
    new <TItem>(options: import('svelte').ComponentConstructorOptions<ReturnType<__sveltets_Render<TItem>['props']>>): import('svelte').SvelteComponent<ReturnType<__sveltets_Render<TItem>['props']>, ReturnType<__sveltets_Render<TItem>['events']>, ReturnType<__sveltets_Render<TItem>['slots']>> & {
        $$bindings?: ReturnType<__sveltets_Render<TItem>['bindings']>;
    } & ReturnType<__sveltets_Render<TItem>['exports']>;
    <TItem>(internal: unknown, props: ReturnType<__sveltets_Render<TItem>['props']> & {}): ReturnType<__sveltets_Render<TItem>['exports']>;
    z_$$bindings?: ReturnType<__sveltets_Render<any>['bindings']>;
}
declare const Autocomplete: $$IsomorphicComponent;
type Autocomplete<TItem> = InstanceType<typeof Autocomplete<TItem>>;
export default Autocomplete;
