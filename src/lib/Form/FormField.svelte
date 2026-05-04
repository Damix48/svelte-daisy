<script lang="ts">
import type { Snippet } from "svelte";
import { useId } from "../utils/useId";
import { fieldContext } from "./context";
import FormItem from "./FormItem.svelte";

type FormFieldProps = {
  name: string;
  children?: Snippet | undefined;
};

const { name, children }: FormFieldProps = $props();

const id = useId(name);

fieldContext.set({ name, id });
</script>

<FormItem> {@render children?.()} </FormItem>
