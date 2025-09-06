<script>
  import { X, Info, BadgeCheck, TriangleAlert, CircleX, LoaderCircle } from "@lucide/svelte";
  import { Toaster } from "svelte-sonner";
</script>

<Toaster
  toastOptions={{
    classes: {
      toast: "alert w-72 [&[data-expanded=false][data-front=false]>*]:opacity-0 z-9999",
      info: "alert-info",
      success: "alert-success",
      warning: "alert-warning",
      error: "alert-error",
      title: "font-bold",
      description: "text-xs",
      closeButton: "absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 focus:active:-translate-y-1/2 btn btn-neutral btn-xs btn-circle",
      loader: "!static !transform-none data-[visible=false]:hidden",
      actionButton: "btn btn-xs"
    },
    unstyled: true
  }}
  closeButton
  position="top-center"
>
  {#snippet closeIcon()}
    <X size={12} />
  {/snippet}
  {#snippet infoIcon()}
    <Info size={20} class="fill-info-content/90 text-info/90" />
  {/snippet}
  {#snippet successIcon()}
    <BadgeCheck size={20} class="fill-success-content/90 text-success/90" />
  {/snippet}
  {#snippet warningIcon()}
    <TriangleAlert size={20} class="fill-warning-content/90 text-warning/90" />
  {/snippet}
  {#snippet errorIcon()}
    <CircleX size={20} class="fill-error-content/90 text-error/90" />
  {/snippet}
  {#snippet loadingIcon()}
    <LoaderCircle size={20} class="animate-spin" />
  {/snippet}
</Toaster>
