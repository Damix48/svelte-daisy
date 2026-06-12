<script lang="ts">
import { Modal, useModal } from "../../ui/modal";
import type { ConfirmModalProps, ConfirmResult } from "./types";

const c = useModal();

let {
  title,
  text,
  onClose,
  cancelText = "Cancel",
  secondaryText,
  confirmText = "Confirm",
  cancelClass = "",
  secondaryClass = "btn-secondary",
  confirmClass = "btn-primary"
}: ConfirmModalProps = $props();

let result: ConfirmResult = $state("cancel");

$effect(() => {
  if (!c.open) {
    onClose(result);
  }
});
</script>

<Modal.Header> {title} </Modal.Header>
<Modal.Body>
  {#if typeof text === "string"}
    <p class="mb-4">{text}</p>
  {:else}
    <div class="p-4">{@render text?.()}</div>
  {/if}
</Modal.Body>
<Modal.Footer>
  <button
    type="button"
    class="btn {cancelClass}"
    onclick={() => {
      result = "cancel";
      onClose(result);

      c.open = false;
    }}
  >
    {cancelText}
  </button>
  {#if secondaryText}
    <button
      type="button"
      class="btn {secondaryClass}"
      onclick={() => {
        result = "secondary";
        onClose(result);

        c.open = false;
      }}
    >
      {secondaryText}
    </button>
  {/if}
  <button
    type="button"
    class="btn {confirmClass}"
    onclick={() => {
      result = "confirm";
      onClose(result);

      c.open = false;
    }}
  >
    {confirmText}
  </button>
</Modal.Footer>
