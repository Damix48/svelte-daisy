export declare const Modal: {
    Root: import("svelte").Component<{
        children?: import("svelte").Snippet | undefined;
        open?: boolean | undefined;
        onOpenChange?: (isOpen: boolean) => void;
    }, {}, "open">;
    Trigger: import("svelte").Component<{
        children?: import("svelte").Snippet | undefined;
    } & import("svelte/elements").HTMLButtonAttributes, {}, "">;
    Content: import("svelte").Component<{
        interactOutsideBehavior?: "close" | "ignore";
        showCloseButton?: boolean;
        children?: import("svelte").Snippet | undefined;
        position?: string | undefined;
        class?: string | undefined;
    }, {}, "">;
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
