<script lang="ts">
  import { modalService } from "$lib/services/modal.svelte";
  import { Modal } from "$lib/components/ui/modal";

  const { className } :{className?: string}= $props();
</script>

{#each modalService.instances as instance (instance.id)}
  <Modal.Root
    open={true}
    onOpenChange={(isOpen) => {
      if (!isOpen) {
        modalService.close(instance.id);
      }
    }}
  >
    <Modal.Content class={instance.className ?? className}>
      <instance.component {...instance.props} />
    </Modal.Content>
  </Modal.Root>
{/each}
