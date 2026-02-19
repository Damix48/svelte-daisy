import type { Snippet } from "svelte";
type ModalContentProps = {
    interactOutsideBehavior?: "close" | "ignore";
    showCloseButton?: boolean;
    children?: Snippet | undefined;
    position?: string | undefined;
    class?: string | undefined;
};
declare const ModalContent: import("svelte").Component<ModalContentProps, {}, "">;
type ModalContent = ReturnType<typeof ModalContent>;
export default ModalContent;
