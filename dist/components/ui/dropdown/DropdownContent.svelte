<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { mergeProps } from "svelte-toolbelt";
import { context } from "./context";

const c = context.get();

let popoverRef: HTMLDivElement;

type DropdownContentProps = {
  children?: Snippet | undefined;
};

let { children, popover, ...restProps }: DropdownContentProps & Omit<HTMLAttributes<HTMLDivElement>, "id" | "popovertarget" | "popovertargetaction" | "ontoggle" | "onclose"> =
  $props();

restProps = mergeProps(restProps, {
  class: "dropdown dropdown-auto-move position-anchor-[--popover]"
});

$effect(() => {
  const isOpen = popoverRef?.matches(':popover-open');
  if (c.open && !isOpen) {
    popoverRef.showPopover();
  } else if (!c.open && isOpen) {
    popoverRef.hidePopover();
  }
});
</script>

<div
  bind:this={popoverRef}
  id="popover-{c.id}"
  popover={popover ?? "auto"}
  ontoggle={({ newState }) => {
    const shouldBeOpen = newState === "open";
    if (c.open !== shouldBeOpen) {
      c.open = shouldBeOpen;
    }
  }}
  {...restProps}
>
  {@render children?.()}
</div>
