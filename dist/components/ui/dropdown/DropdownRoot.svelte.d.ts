import { type Snippet } from "svelte";
import type { Booleanish, ClassValue } from "svelte/elements";
type DropdownRootProps = {
    children?: Snippet | undefined;
    open?: boolean | undefined;
    id?: string;
    class?: ClassValue | null | undefined;
    "aria-invalid"?: Booleanish | "grammar" | "spelling" | null | undefined;
};
declare const DropdownRoot: import("svelte").Component<DropdownRootProps, {}, "open">;
type DropdownRoot = ReturnType<typeof DropdownRoot>;
export default DropdownRoot;
