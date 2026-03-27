<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";
  import { mergeProps } from "svelte-toolbelt";
  import { context } from "./context";

  const c = context.get();

  type DropdownTriggerProps = {
    children?: Snippet | undefined;
  };

  let { children, ...restProps }: DropdownTriggerProps & Omit<HTMLButtonAttributes, "popovertarget" | "popover" | "popovertargetaction"> = $props();

  const _restProps = $derived(mergeProps(restProps, { class: "anchor-[--popover]" }));
</script>

<button type="button" popovertarget="popover-{c.id}" {..._restProps}>
  {@render children?.()}
</button>
