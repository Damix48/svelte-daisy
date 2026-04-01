<script lang="ts">
  import { fieldContext, formContext } from "./context";

  const { errors } = formContext.get();
  const field = fieldContext.getOr(undefined); // get context optionally

  // If field context exists, use its name for field-level errors.
  // Otherwise, this component will show form-level errors.
  const name = field?.name;
</script>

{#if name && $errors[name] && Array.isArray($errors[name])}
  <div class="validator-hint mt-0">
    {#each $errors[name] as error}
      <span class="block">{error}</span>
    {/each}
  </div>
{:else if !name && $errors._errors}
  <div class="validator-hint text-error visible">
    {#each $errors._errors as error}
      <span class="block">{error}</span>
    {/each}
  </div>
{/if}
