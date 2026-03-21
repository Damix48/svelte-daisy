<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import { mergeProps } from "svelte-toolbelt";

  type ModalHeaderProps = {
    children?: Snippet | undefined;
  };

  let { children, ...restProps }: ModalHeaderProps & HTMLAttributes<HTMLDivElement> = $props();

  restProps = mergeProps(restProps, {
    class: "mb-4"
  });
</script>

<div {...restProps}>
  <h3 class="text-xl font-bold">
    {@render children?.()}
  </h3>
</div>
