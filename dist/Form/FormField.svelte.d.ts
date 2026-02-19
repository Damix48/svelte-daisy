import { type Snippet } from "svelte";
type FormFieldProps = {
    name: string;
    children?: Snippet | undefined;
};
declare const FormField: import("svelte").Component<FormFieldProps, {}, "">;
type FormField = ReturnType<typeof FormField>;
export default FormField;
