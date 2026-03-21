<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import { mergeProps } from "svelte-toolbelt";

  type ModalBodyProps = {
    children?: Snippet | undefined;
  };

  let { children, ...restProps }: ModalBodyProps & HTMLAttributes<HTMLDivElement> = $props();

  restProps = mergeProps(restProps, {
    class: "modal-body"
  });
</script>

<div {...restProps}>
  {@render children?.()}
</div>
