<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";
  import { mergeProps } from "svelte-toolbelt";
  import { fieldContext, formContext } from "./context";

  const { form, constraints, errors } = formContext.get();
  const { name, id } = fieldContext.get();

  type FormInputProps = {};
  let { ...restProps }: FormInputProps & Omit<HTMLInputAttributes, "id" | "name" | "value"> = $props();

  restProps = mergeProps($constraints[name] ?? {}, restProps, {
    class: "input validator w-full"
  });
</script>

<input bind:value={$form[name]} {id} {name} aria-invalid={$errors[name] ? "true" : undefined} {...restProps} />
