export declare const Modal: {
    Root: import("svelte").Component<{
        children?: import("svelte").Snippet | undefined;
        open?: boolean | undefined;
        onOpenChange?: (isOpen: boolean) => void;
    }, {}, "open">;
    Trigger: import("svelte").Component<{
        children?: import("svelte").Snippet | undefined;
    } & import("svelte/elements").HTMLButtonAttributes, {}, "">;
    Content: import("svelte").Component<import("./types").ModalContentProps, {}, "">;
    Header: import("svelte").Component<{
        children?: import("svelte").Snippet | undefined;
    } & import("svelte/elements").HTMLAttributes<HTMLDivElement>, {}, "">;
    Body: import("svelte").Component<{
        children?: import("svelte").Snippet | undefined;
    } & import("svelte/elements").HTMLAttributes<HTMLDivElement>, {}, "">;
    Footer: import("svelte").Component<{
        children?: import("svelte").Snippet | undefined;
    } & import("svelte/elements").HTMLAttributes<HTMLDivElement>, {}, "">;
};
export { useModal } from "./context";
export type { ModalPosition, ModalOutsideBehavior, ModalContentProps } from "./types";
