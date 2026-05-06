import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
type ModalHeaderProps = {
    children?: Snippet | undefined;
};
type $$ComponentProps = ModalHeaderProps & HTMLAttributes<HTMLDivElement>;
declare const ModalHeader: import("svelte").Component<$$ComponentProps, {}, "">;
type ModalHeader = ReturnType<typeof ModalHeader>;
export default ModalHeader;
