import type { Snippet } from "svelte";
import type { HTMLButtonAttributes } from "svelte/elements";
type FormButtonProps = {
    children?: Snippet | undefined;
};
type $$ComponentProps = FormButtonProps & Omit<HTMLButtonAttributes, "type">;
declare const FormButton: import("svelte").Component<$$ComponentProps, {}, "">;
type FormButton = ReturnType<typeof FormButton>;
export default FormButton;
