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

  let { children, ...restProps }: DropdownContentProps & Omit<HTMLAttributes<HTMLDivElement>, "id" | "popovertarget" | "popover" | "popovertargetaction" | "ontoggle" | "onclose"> =
    $props();

  restProps = mergeProps(restProps, {
    class: "position-anchor-[--popover] popover-dropdown popover-dropdown-auto-position"
  });

  $effect(() => {
    if (c.open) popoverRef.showPopover();
    else popoverRef.hidePopover();
  });
</script>

<div
  bind:this={popoverRef}
  id="popover-{c.id}"
  popover="auto"
  ontoggle={({ newState }) => {
    c.open = newState === "open";
  }}
  {...restProps}
>
  {@render children?.()}
</div>
