<script lang="ts">
  import { modalService } from "$lib/services/modal.svelte";
  import { Modal } from "$lib/components/ui/modal";
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
    <Modal.Content>
      <instance.component {...instance.props} />
    </Modal.Content>
  </Modal.Root>
{/each}
