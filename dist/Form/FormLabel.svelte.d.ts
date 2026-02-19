import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
type FormLabelProps = {
    children?: Snippet | undefined;
};
type $$ComponentProps = FormLabelProps & Omit<HTMLAttributes<HTMLLabelElement>, "for">;
declare const FormLabel: import("svelte").Component<$$ComponentProps, {}, "">;
type FormLabel = ReturnType<typeof FormLabel>;
export default FormLabel;
