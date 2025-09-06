<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";
  import { mergeProps } from "svelte-toolbelt";
  import { formContext } from "./context";

  const { submitting } = formContext.get();

  type FormButtonProps = {
    children?: Snippet | undefined;
  };
  let { children, ...restProps }: FormButtonProps & Omit<HTMLButtonAttributes, "type"> = $props();

  restProps = mergeProps(restProps, { class: "btn btn-primary" });
</script>

<button type="submit" disabled={$submitting} {...restProps}>
  {@render children?.()}
</button>
