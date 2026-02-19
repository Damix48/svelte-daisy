import type { HTMLInputAttributes } from "svelte/elements";
declare function $$render<TItem>(): {
    props: Omit<SelectProps<TItem>, "selectedItem" | "selectedItems"> & Omit<HTMLInputAttributes, "id" | "name" | "type" | "value">;
    exports: {};
    bindings: "";
    slots: {};
    events: {};
};
declare class __sveltets_Render<TItem> {
    props(): ReturnType<typeof $$render<TItem>>['props'];
    events(): ReturnType<typeof $$render<TItem>>['events'];
    slots(): ReturnType<typeof $$render<TItem>>['slots'];
    bindings(): "";
    exports(): {};
}
interface $$IsomorphicComponent {
    new <TItem>(options: import('svelte').ComponentConstructorOptions<ReturnType<__sveltets_Render<TItem>['props']>>): import('svelte').SvelteComponent<ReturnType<__sveltets_Render<TItem>['props']>, ReturnType<__sveltets_Render<TItem>['events']>, ReturnType<__sveltets_Render<TItem>['slots']>> & {
        $$bindings?: ReturnType<__sveltets_Render<TItem>['bindings']>;
    } & ReturnType<__sveltets_Render<TItem>['exports']>;
    <TItem>(internal: unknown, props: ReturnType<__sveltets_Render<TItem>['props']> & {}): ReturnType<__sveltets_Render<TItem>['exports']>;
    z_$$bindings?: ReturnType<__sveltets_Render<any>['bindings']>;
}
declare const FormSelect: $$IsomorphicComponent;
type FormSelect<TItem> = InstanceType<typeof FormSelect<TItem>>;
export default FormSelect;
