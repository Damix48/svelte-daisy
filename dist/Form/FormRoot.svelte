<script lang="ts" generics="T extends Record<string, unknown>">
  import type { Snippet } from "svelte";
  import { formContext, type FormContextType } from "./context";
  import type { SuperForm } from "sveltekit-superforms";

  type FormRootProps = {
    form: SuperForm<T, any>;
    children?: Snippet | undefined;
    class?: string | undefined;
  };

  const { form, children, class: className }: FormRootProps = $props();

  formContext.set(form as FormContextType<T>);
</script>

<form method="POST" use:form.enhance class={className}>
  {@render children?.()}
</form>
