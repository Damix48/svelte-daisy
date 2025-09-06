<script lang="ts">
  import { X } from "@lucide/svelte";
  import type { Snippet } from "svelte";
  import { context } from "./context";

  const c = context.get();

  type ModalContentProps = {
    interactOutsideBehavior?: "close" | "ignore";
    showCloseButton?: boolean;
    children?: Snippet | undefined;
    position?: string | undefined;
    class?: string | undefined;
  };

  let { interactOutsideBehavior = "close", showCloseButton = true, position, class: className, children }: ModalContentProps = $props();

  let dialogRef: HTMLDialogElement;

  $effect(() => {
    if (!dialogRef) return;
    if (c.open) {
      if (!dialogRef.open) {
        dialogRef.showModal();
      }
    } else {
      if (dialogRef.open) {
        dialogRef.close();
      }
    }
  });
</script>

<dialog
  bind:this={dialogRef}
  class="modal {position}"
  onclose={() => {
    c.open = false;
  }}
>
  <div class="modal-box {className}">
    {#if showCloseButton}
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute top-2 right-2">
          <X size={18} />
        </button>
      </form>
    {/if}
    {@render children?.()}
  </div>
  {#if interactOutsideBehavior === "close"}
    <form method="dialog" class="modal-backdrop">
      <button tabindex="-1">close</button>
    </form>
  {/if}
</dialog>
