<script lang="ts">
import { onMount } from "svelte";

onMount(() => {
  const root = document.documentElement;

  let rafPending = false;

  const apply = () => {
    const viewport = window.visualViewport;
    const viewportHeight = viewport?.height ?? document.documentElement.clientHeight ?? window.innerHeight;

    let keyboardOffset = 0;
    if (viewport) {
      keyboardOffset = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop);
      if (keyboardOffset === 0 && viewport.offsetTop > 0) {
        keyboardOffset = viewport.offsetTop;
      }
    }

    root.style.setProperty("--viewport-height", `${viewportHeight}px`);
    root.style.setProperty("--keyboard-offset", `${keyboardOffset}px`);
  };

  const update = () => {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(() => {
      rafPending = false;
      apply();
    });
  };

  update();

  const viewport = window.visualViewport;
  viewport?.addEventListener("resize", update);
  viewport?.addEventListener("scroll", update);
  window.addEventListener("resize", update);
  window.addEventListener("orientationchange", update);
  window.addEventListener("scroll", update, { passive: true });

  return () => {
    viewport?.removeEventListener("resize", update);
    viewport?.removeEventListener("scroll", update);
    window.removeEventListener("resize", update);
    window.removeEventListener("orientationchange", update);
    window.removeEventListener("scroll", update);
    root.style.removeProperty("--viewport-height");
    root.style.removeProperty("--keyboard-offset");
  };
});
</script>
