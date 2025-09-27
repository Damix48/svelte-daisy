<script lang="ts" generics="T">
  import { onMount, type Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import Sortable from "sortablejs";
  import { sortableGroupContext } from "./context";
  import { useId } from "$lib/utils/useId";

  const c = sortableGroupContext.getOr(undefined);
  const id = useId("sortable-list");

  type SortableListProps = {
    children?: Snippet | undefined;
    items: T[];
  };

  let { items = $bindable([]), children, ...restProp }: SortableListProps & HTMLAttributes<HTMLDivElement> = $props();

  let div: HTMLDivElement | undefined = $state(undefined);

  onMount(() => {
    if (!div) return;

    const sortable = Sortable.create(div, { revertDOM: true, animation: 150, group: c?.id, onUpdate, onAdd });

    c?.removeItemMap.set(id, removeItem);

    return () => {
      sortable.destroy();
      c?.removeItemMap.delete(id);
    };
  });

  const onUpdate = (event: Sortable.SortableEvent) => {
    items.splice(event.newIndex!, 0, items.splice(event.oldIndex!, 1)[0]);
  };

  const onAdd = ({ from, to, oldIndex, newIndex }: Sortable.SortableEvent) => {
    if (!c) return;

    const removeItem = c.removeItemMap.get(from.getAttribute("data-sortable-list-id")!);
    const removed = removeItem?.(oldIndex!);

    items.splice(newIndex!, 0, removed);
  };

  const removeItem = (index: number) => {
    const [removed] = items.splice(index, 1);

    return removed;
  };
</script>

<div bind:this={div} {...restProp} data-sortable-list-id={id}>
  {@render children?.()}
</div>
