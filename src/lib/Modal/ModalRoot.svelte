<script lang="ts">
  import { type Snippet } from "svelte";
  import { context } from "./context";

  type ModalRootProps = {
    children?: Snippet | undefined;
    open?: boolean | undefined;
    onOpenChange?: (isOpen: boolean) => void;
  };

  let { children, open = $bindable(false), onOpenChange }: ModalRootProps = $props();

  const state = {
    get open() {
      return open;
    },
    set open(value) {
      open = value;
      onOpenChange?.(value);
    }
  };

  context.set(state);
</script>

{@render children?.()}
