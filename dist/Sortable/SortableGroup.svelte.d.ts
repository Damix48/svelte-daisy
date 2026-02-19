import type { Snippet } from "svelte";
type SortableGroupProps = {
    children?: Snippet | undefined;
};
declare const SortableGroup: import("svelte").Component<SortableGroupProps, {}, "">;
type SortableGroup = ReturnType<typeof SortableGroup>;
export default SortableGroup;
