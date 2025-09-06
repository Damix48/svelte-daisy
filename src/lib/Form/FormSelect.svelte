<script lang="ts" generics="TItem">
  import { mergeProps } from "svelte-toolbelt";
  import Select from "../Select/Select.svelte";
  import type { SelectProps } from "../Select/types";
  import { fieldContext, formContext } from "./context";
  import type { HTMLInputAttributes } from "svelte/elements";

  const { form, constraints, errors, tainted } = formContext.get();
  const { name, id } = fieldContext.get();

  type FormSelectProps = Omit<SelectProps<TItem>, "selectedItem" | "selectedItems">;

  let { items, itemToId, itemToString, ...restProps }: FormSelectProps & Omit<HTMLInputAttributes, "id" | "name" | "value" | "type"> = $props();

  const isValid = $derived((!$errors[name] || $errors[name][0] === undefined) && $tainted?.[name]);

  const _restProps = $derived(
    mergeProps($constraints[name] ?? {}, restProps, {
      class: `validator ${isValid ? "valid" : ""}`
    })
  );
</script>

<Select
  {items}
  {itemToId}
  {itemToString}
  {..._restProps}
  aria-invalid={$errors[name] && $errors[name][0] !== undefined ? "true" : undefined}
  bind:selectedItem={() => items?.find((x) => itemToId!(x) === $form[name]), (v) => ($form[name] = itemToId!(v!))}
  bind:selectedItems={() => items?.filter((x) => $form[name].includes(itemToId!(x))), (v) => ($form[name] = v?.map((x) => itemToId!(x)))}
/>
