export declare const Dropdown: {
    Root: import("svelte").Component<{
        children?: import("svelte").Snippet | undefined;
        open?: boolean | undefined;
        id?: string;
        class?: import("svelte/elements").ClassValue | null | undefined;
        "aria-invalid"?: import("svelte/elements").Booleanish | "grammar" | "spelling" | null | undefined;
    }, {}, "open">;
    Trigger: import("svelte").Component<{
        children?: import("svelte").Snippet | undefined;
    } & Omit<import("svelte/elements").HTMLButtonAttributes, "popovertarget" | "popovertargetaction" | "popover">, {}, "">;
    Content: import("svelte").Component<{
        children?: import("svelte").Snippet | undefined;
    } & Omit<import("svelte/elements").HTMLAttributes<HTMLDivElement>, "popovertarget" | "popovertargetaction" | "id" | "popover" | "ontoggle" | "onclose">, {}, "">;
};
