<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import { mergeProps } from "svelte-toolbelt";
  import { fieldContext } from "./context";

  type FormLabelProps = {
    children?: Snippet | undefined;
  };
  let { children, ...restProps }: FormLabelProps & Omit<HTMLAttributes<HTMLLabelElement>, "for"> = $props();

  const { id } = fieldContext.get();

  restProps = mergeProps(restProps, { class: "label" });
</script>

<label for={id} {...restProps}>
  {@render children?.()}
</label>
