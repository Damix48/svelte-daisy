<script lang="ts">
import type { HTMLInputAttributes } from "svelte/elements";
import { mergeProps } from "svelte-toolbelt";
import InputNumber from "$lib/InputNumber/InputNumber.svelte";
import type { InputNumberProps } from "$lib/InputNumber/types";
import { fieldContext, formContext } from "./context";

const { form, constraints, errors } = formContext.get();
const { name, id } = fieldContext.get();

type FormInputNumberProps = Omit<InputNumberProps, "value">;

let { ...restProps }: FormInputNumberProps & Omit<HTMLInputAttributes, "id" | "name" | "value" | "type"> = $props();

restProps = mergeProps($constraints[name] ?? {}, restProps, {
  class: "validator w-full"
});
</script>

<InputNumber bind:value={$form[name]} {id} {name} aria-invalid={$errors[name] ? "true" : undefined} {...restProps} />
