import type { Snippet } from "svelte";
import type { HTMLButtonAttributes } from "svelte/elements";
type ModalTriggerProps = {
    children?: Snippet | undefined;
};
type $$ComponentProps = ModalTriggerProps & HTMLButtonAttributes;
declare const ModalTrigger: import("svelte").Component<$$ComponentProps, {}, "">;
type ModalTrigger = ReturnType<typeof ModalTrigger>;
export default ModalTrigger;
