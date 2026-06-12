<script lang="ts">
import type { Snippet } from "svelte";
import { SvelteMap } from "svelte/reactivity";
import { useId } from "../utils/useId";
import { sortableGroupContext } from "./context";

type SortableGroupProps = {
  children?: Snippet | undefined;
};

let { children }: SortableGroupProps = $props();

const removeItemMap = new SvelteMap<string, (index: number) => any>();

sortableGroupContext.set({ id: useId("sortable-group"), removeItemMap });
</script>

{@render children?.()}
