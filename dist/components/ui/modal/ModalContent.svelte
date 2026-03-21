<script lang="ts">
import { X } from "@lucide/svelte";
import { context } from "./context";
import type { ModalContentProps } from "./types";

const c = context.get();

let { outsideBehavior = "close", showCloseButton = true, position, class: className, children }: ModalContentProps = $props();

let dialogRef: HTMLDialogElement;
let modalPositionClass = $derived.by(() => {
  switch (position) {
    case "top":
      return "modal-top";
    case "middle":
      return "modal-middle";
    case "bottom":
      return "modal-bottom";
    case "start":
      return "modal-start";
    case "end":
      return "modal-end";
    default:
      return "";
  }
});

$effect(() => {
  if (!dialogRef) return;
  if (c.open) {
    if (!dialogRef.open) {
      if (outsideBehavior === "interact" || outsideBehavior === "close-interact") {
        dialogRef.showPopover();
      } else {
        dialogRef.showModal();
      }
    }
  } else {
    if (dialogRef.open) {
      if (outsideBehavior === "interact" || outsideBehavior === "close-interact") {
        dialogRef.hidePopover();
      } else {
        dialogRef.close();
      }
    }
  }
});

const onclose = () => {
  c.open = false;
};

const ontoggle = (e: ToggleEvent) => {
  if (outsideBehavior === "interact" || outsideBehavior === "close-interact") {
    if (e.newState === "open") {
      c.open = true;
    } else if (e.newState === "closed") {
      c.open = false;
    }
  }
};

const close = () => {
  dialogRef.hidePopover();
};
</script>

<dialog
  bind:this={dialogRef}
  class="modal {modalPositionClass}"
  {onclose}
  popover={outsideBehavior === "interact" ? "manual" : outsideBehavior === "close-interact" ? "auto" : undefined}
  {ontoggle}
>
  <div class="modal-box {className}">
    {#if showCloseButton && outsideBehavior !== "interact"}
      <form method="dialog">
        <button type="submit" class="btn btn-sm btn-circle btn-ghost absolute top-2 right-2"><X size={18} /></button>
      </form>
    {/if}
    {#if showCloseButton && outsideBehavior === "interact" || outsideBehavior === "close-interact"}
      <button type="button" class="btn btn-sm btn-circle btn-ghost absolute top-2 right-2" onclick={close}><X size={18} /></button>
    {/if}
    {@render children?.()}
  </div>
  {#if outsideBehavior === "close"}
    <form method="dialog" class="modal-backdrop"><button type="submit" tabindex="-1">close</button></form>
  {/if}
</dialog>
