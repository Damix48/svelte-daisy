<script lang="ts">
import "../lib/styles.css";
import "../app.css";
import ModalProvider from "$lib/components/functional/modal-provider/ModalProvider.svelte";
import ViewportVars from "$lib/components/functional/viewport-vars/ViewportVars.svelte";

let { children } = $props();
</script>

{@render children()}
<ViewportVars />
<ModalProvider />
