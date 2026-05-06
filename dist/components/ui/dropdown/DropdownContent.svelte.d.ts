import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
type DropdownContentProps = {
    children?: Snippet | undefined;
};
type $$ComponentProps = DropdownContentProps & Omit<HTMLAttributes<HTMLDivElement>, "id" | "popovertarget" | "popover" | "popovertargetaction" | "ontoggle" | "onclose">;
declare const DropdownContent: import("svelte").Component<$$ComponentProps, {}, "">;
type DropdownContent = ReturnType<typeof DropdownContent>;
export default DropdownContent;
