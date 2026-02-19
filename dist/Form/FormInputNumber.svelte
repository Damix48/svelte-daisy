<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";
  import { mergeProps } from "svelte-toolbelt";
  import { fieldContext, formContext } from "./context";
  import type { InputNumberProps } from "../InputNumber/types";
  import InputNumber from "../InputNumber/InputNumber.svelte";

  const { form, constraints, errors } = formContext.get();
  const { name, id } = fieldContext.get();

  type FormInputNumberProps = Omit<InputNumberProps, "value">;

  let { ...restProps }: FormInputNumberProps & Omit<HTMLInputAttributes, "id" | "name" | "value" | "type"> = $props();

  restProps = mergeProps($constraints[name] ?? {}, restProps, {
    class: "validator w-full"
  });
</script>

<InputNumber bind:value={$form[name]} {id} {name} aria-invalid={$errors[name] ? "true" : undefined} {...restProps} />
