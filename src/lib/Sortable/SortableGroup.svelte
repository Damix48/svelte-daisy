<script lang="ts">
  import type { Snippet } from "svelte";
  import { sortableGroupContext } from "./context";
  import { SvelteMap } from "svelte/reactivity";
  import { useId } from "$lib/utils/useId";

  type SortableGroupProps = {
    children?: Snippet | undefined;
  };

  let { children }: SortableGroupProps = $props();

  const removeItemMap = new SvelteMap<string, (index: number) => any>();

  sortableGroupContext.set({ id: useId("sortable-group"), removeItemMap });
</script>

{@render children?.()}
