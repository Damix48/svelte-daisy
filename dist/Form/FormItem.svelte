<script lang="ts">
  import type { Snippet } from "svelte";

  let { children } = $props<{ children?: Snippet }>();
</script>

<div class="flex flex-col gap-1">
  {@render children?.()}
</div>
