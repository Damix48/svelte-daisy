import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
type ModalFooterProps = {
    children?: Snippet | undefined;
};
type $$ComponentProps = ModalFooterProps & HTMLAttributes<HTMLDivElement>;
declare const ModalFooter: import("svelte").Component<$$ComponentProps, {}, "">;
type ModalFooter = ReturnType<typeof ModalFooter>;
export default ModalFooter;
