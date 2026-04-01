<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import { mergeProps } from "svelte-toolbelt";

  type ModalFooterProps = {
    children?: Snippet | undefined;
  };

  let { children, ...restProps }: ModalFooterProps & HTMLAttributes<HTMLDivElement> = $props();

  restProps = mergeProps(restProps, {
    class: "modal-action"
  });
</script>

<div {...restProps}>
  {@render children?.()}
</div>
