import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
type ModalBodyProps = {
    children?: Snippet | undefined;
};
type $$ComponentProps = ModalBodyProps & HTMLAttributes<HTMLDivElement>;
declare const ModalBody: import("svelte").Component<$$ComponentProps, {}, "">;
type ModalBody = ReturnType<typeof ModalBody>;
export default ModalBody;
