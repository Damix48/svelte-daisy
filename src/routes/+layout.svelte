<script lang="ts">
import "../lib/styles.css";
import "../app.css";
import ModalProvider from "$lib/components/functional/modal-provider/ModalProvider.svelte";

let { children } = $props();
</script>

{@render children()}
<ModalProvider />
