<script lang="ts">
  import { Modal } from "./Modal";
  import { context } from "./Modal/context";

  const c = context.get();

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

<Modal.Header>
  {title}
</Modal.Header>
{#if text}
  <p class="mb-4">
    {text}
  </p>
{/if}
<Modal.Footer>
  <button
    class="btn"
    onclick={() => {
      confirm = false;
      c.open = false;
    }}>{cancelText}</button
  >
  <button
    class="btn btn-primary"
    onclick={() => {
      confirm = true;
      c.open = false;
    }}>{confirmText}</button
  >
</Modal.Footer>
