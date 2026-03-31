<script lang="ts">
import type { Snippet } from "svelte";
import type { Booleanish, ClassValue } from "svelte/elements";
import { context } from "./context";

type DropdownRootProps = {
  children?: Snippet | undefined;
  open?: boolean | undefined;
  id?: string;

  // HTML attributes
  class?: ClassValue | null | undefined;
  "aria-invalid"?: Booleanish | "grammar" | "spelling" | null | undefined;
};

const _id = $props.id();
let { children, open = $bindable(false), id = _id, "aria-invalid": ariaInvalid, class: className }: DropdownRootProps = $props();

const state = {
  get open() {
    return open;
  },
  set open(value) {
    open = value;
  },
  id
};

context.set(state);
</script>

<div class={`dropdown ${className ?? ""}`} style="anchor-scope: --popover; display: contents;" aria-invalid={ariaInvalid} class:validator={className?.includes("validator")}>
  {@render children?.()}
</div>
