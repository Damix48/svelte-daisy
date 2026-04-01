<script lang="ts">
import { onMount } from "svelte";

onMount(() => {
  const root = document.documentElement;

  const update = () => {
    const viewport = window.visualViewport;
    const viewportHeight = viewport?.height ?? window.innerHeight;
    const keyboardOffset = viewport ? Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop) : 0;

    root.style.setProperty("--viewport-height", `${viewportHeight}px`);
    root.style.setProperty("--keyboard-offset", `${keyboardOffset}px`);
  };

  update();

  const viewport = window.visualViewport;
  viewport?.addEventListener("resize", update);
  viewport?.addEventListener("scroll", update);
  window.addEventListener("resize", update);

  return () => {
    viewport?.removeEventListener("resize", update);
    viewport?.removeEventListener("scroll", update);
    window.removeEventListener("resize", update);
    root.style.removeProperty("--viewport-height");
    root.style.removeProperty("--keyboard-offset");
  };
});
</script>
