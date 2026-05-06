<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLButtonAttributes } from "svelte/elements";
import { mergeProps } from "svelte-toolbelt";
import { context } from "./context";

const c = context.get();

type ModalTriggerProps = {
  children?: Snippet | undefined;
};

let { children, onclick, ...restProps }: ModalTriggerProps & HTMLButtonAttributes = $props();

restProps = mergeProps(restProps, {
  onclick: (e: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) => {
    c.open = true;
    onclick?.(e);
  }
});
</script>

<button type="button" {...restProps}>{@render children?.()}</button>
