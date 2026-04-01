<script lang="ts">
  import type { HTMLTextareaAttributes } from "svelte/elements";
  import { mergeProps } from "svelte-toolbelt";
  import { fieldContext, formContext } from "./context";

  const { form, constraints, errors } = formContext.get();
  const { name, id } = fieldContext.get();

  type FormTextareaProps = {};
  let { ...restProps }: FormTextareaProps & Omit<HTMLTextareaAttributes, "id" | "name" | "value"> = $props();

  restProps = mergeProps($constraints[name] ?? {}, restProps, {
    class: "textarea validator w-full"
  });
</script>

<textarea bind:value={$form[name]} {id} {name} aria-invalid={$errors[name] ? "true" : undefined} {...restProps}></textarea>
