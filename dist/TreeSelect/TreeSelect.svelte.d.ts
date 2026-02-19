import type { TreeSelectProps } from "./types";
declare function $$render<TItem extends {
    children?: TItem[];
}>(): {
    props: TreeSelectProps<TItem>;
    exports: {};
    bindings: "selectedItem" | "selectedItems" | "selectedIds";
    slots: {};
    events: {};
};
declare class __sveltets_Render<TItem extends {
    children?: TItem[];
}> {
    props(): ReturnType<typeof $$render<TItem>>['props'];
    events(): ReturnType<typeof $$render<TItem>>['events'];
    slots(): ReturnType<typeof $$render<TItem>>['slots'];
    bindings(): "selectedItem" | "selectedItems" | "selectedIds";
    exports(): {};
}
interface $$IsomorphicComponent {
    new <TItem extends {
        children?: TItem[];
    }>(options: import('svelte').ComponentConstructorOptions<ReturnType<__sveltets_Render<TItem>['props']>>): import('svelte').SvelteComponent<ReturnType<__sveltets_Render<TItem>['props']>, ReturnType<__sveltets_Render<TItem>['events']>, ReturnType<__sveltets_Render<TItem>['slots']>> & {
        $$bindings?: ReturnType<__sveltets_Render<TItem>['bindings']>;
    } & ReturnType<__sveltets_Render<TItem>['exports']>;
    <TItem extends {
        children?: TItem[];
    }>(internal: unknown, props: ReturnType<__sveltets_Render<TItem>['props']> & {}): ReturnType<__sveltets_Render<TItem>['exports']>;
    z_$$bindings?: ReturnType<__sveltets_Render<any>['bindings']>;
}
declare const TreeSelect: $$IsomorphicComponent;
type TreeSelect<TItem extends {
    children?: TItem[];
}> = InstanceType<typeof TreeSelect<TItem>>;
export default TreeSelect;
