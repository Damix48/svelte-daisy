<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";
  import { context } from "./context";
  import { mergeProps } from "svelte-toolbelt";

  const c = context.get();

  type ModalTriggerProps = {
    children?: Snippet | undefined;
  };

  let { children, ...restProps }: ModalTriggerProps & HTMLButtonAttributes = $props();

  restProps = mergeProps(restProps, {
    onclick: () => {
      c.open = true;
    }
  });
</script>

<button type="button" {...restProps}>
  {@render children?.()}
</button>
