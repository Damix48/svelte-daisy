<script lang="ts">
import { Calendar as CalendarIcon } from "@lucide/svelte";
import type { ClassValue } from "svelte/elements";
import { useDropdown } from "../dropdown/context";

const c = useDropdown();

let {
  value = $bindable(""),
  placeholder = "",
  oninput,
  onblur,
  onkeydown,
  onfocus,
  disabled = false,
  class: className = ""
}: {
  value?: string;
  placeholder?: string;
  oninput?: (e: Event) => void;
  onblur?: (e: FocusEvent) => void;
  onkeydown?: (e: KeyboardEvent) => void;
  onfocus?: (e: FocusEvent) => void;
  disabled?: boolean;
  class?: ClassValue;
} = $props();
</script>

<div class="input inline-flex items-center overflow-hidden anchor-[--popover] {className}">
  <input
    type="text"
    bind:value
    {placeholder}
    {disabled}
    class="min-w-0 truncate bg-transparent outline-none border-0 p-0"
    role="combobox"
    aria-haspopup="dialog"
    aria-expanded={c.open}
    aria-controls="popover-{c.id}"
    {oninput}
    {onblur}
    onkeydown={(e) => {
      if (e.key === "ArrowDown" && e.altKey) {
        c.open = true;
      }
      onkeydown?.(e);
    }}
    {onfocus}
  >
  <button type="button" class="self-stretch flex items-center justify-end min-w-11 ps-4 disabled:opacity-40 focus-visible:outline-0" {disabled} popovertarget="popover-{c.id}">
    <CalendarIcon size={16} class="text-(--input-color)" />
  </button>
</div>
