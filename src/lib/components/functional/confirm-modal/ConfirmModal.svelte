<script lang="ts">
import { Modal, useModal } from "$lib/components/ui/modal";

const c = useModal();

type ConfirmModalProps = {
  title: string;
  text?: string;
  onClose: (result: boolean) => void;
  cancelText?: string;
  confirmText?: string;
};

let { title, text, onClose, cancelText = "Cancel", confirmText = "Confirm" }: ConfirmModalProps = $props();

let confirm = $state(false);

$effect(() => {
  if (!c.open) {
    onClose(confirm);
  }
});
</script>

<Modal.Header> {title} </Modal.Header>
<Modal.Body>
  {#if text}
    <p class="mb-4">{text}</p>
  {/if}
</Modal.Body>
<Modal.Footer>
  <button
    type="button"
    class="btn"
    onclick={() => {
      confirm = false;
      onClose(confirm);

      c.open = false;
    }}
  >
    {cancelText}
  </button>
  <button
    type="button"
    class="btn btn-primary"
    onclick={() => {
      confirm = true;
      onClose(confirm);
      
      c.open = false;
    }}
  >
    {confirmText}
  </button>
</Modal.Footer>
