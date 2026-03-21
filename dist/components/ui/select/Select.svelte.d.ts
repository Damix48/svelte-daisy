import type { SelectProps } from "./types";
import type { HTMLInputAttributes } from "svelte/elements";
declare function $$render<TItem>(): {
    props: SelectProps<TItem> & Omit<HTMLInputAttributes, "id" | "type" | "value">;
    exports: {};
    bindings: "selected";
    slots: {};
    events: {};
};
declare class __sveltets_Render<TItem> {
    props(): ReturnType<typeof $$render<TItem>>['props'];
    events(): ReturnType<typeof $$render<TItem>>['events'];
    slots(): ReturnType<typeof $$render<TItem>>['slots'];
    bindings(): "selected";
    exports(): {};
}
interface $$IsomorphicComponent {
    new <TItem>(options: import('svelte').ComponentConstructorOptions<ReturnType<__sveltets_Render<TItem>['props']>>): import('svelte').SvelteComponent<ReturnType<__sveltets_Render<TItem>['props']>, ReturnType<__sveltets_Render<TItem>['events']>, ReturnType<__sveltets_Render<TItem>['slots']>> & {
        $$bindings?: ReturnType<__sveltets_Render<TItem>['bindings']>;
    } & ReturnType<__sveltets_Render<TItem>['exports']>;
    <TItem>(internal: unknown, props: ReturnType<__sveltets_Render<TItem>['props']> & {}): ReturnType<__sveltets_Render<TItem>['exports']>;
    z_$$bindings?: ReturnType<__sveltets_Render<any>['bindings']>;
}
declare const Select: $$IsomorphicComponent;
type Select<TItem> = InstanceType<typeof Select<TItem>>;
export default Select;
