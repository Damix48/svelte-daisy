import type { Snippet } from "svelte";
import type { HTMLButtonAttributes } from "svelte/elements";
type DropdownTriggerProps = {
    children?: Snippet | undefined;
};
type $$ComponentProps = DropdownTriggerProps & Omit<HTMLButtonAttributes, "popovertarget" | "popover" | "popovertargetaction">;
declare const DropdownTrigger: import("svelte").Component<$$ComponentProps, {}, "">;
type DropdownTrigger = ReturnType<typeof DropdownTrigger>;
export default DropdownTrigger;
