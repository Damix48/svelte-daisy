<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";
  import { mergeProps } from "svelte-toolbelt";
  import { fieldContext, formContext } from "./context";

  const { form, constraints, errors } = formContext.get();
  const { name, id } = fieldContext.get();

  type FormCheckboxProps = {};
  let { ...restProps }: FormCheckboxProps & Omit<HTMLInputAttributes, "id" | "name" | "type" | "checked"> = $props();

  restProps = mergeProps($constraints[name] ?? {}, restProps, {
    class: "checkbox"
  });
</script>

<input type="checkbox" bind:checked={$form[name]} {id} {name} aria-invalid={$errors[name] ? "true" : undefined} {...restProps} />
