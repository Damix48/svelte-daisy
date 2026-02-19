import { type Snippet } from "svelte";
type ModalRootProps = {
    children?: Snippet | undefined;
    open?: boolean | undefined;
    onOpenChange?: (isOpen: boolean) => void;
};
declare const ModalRoot: import("svelte").Component<ModalRootProps, {}, "open">;
type ModalRoot = ReturnType<typeof ModalRoot>;
export default ModalRoot;
