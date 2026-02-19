import type { HTMLInputAttributes } from "svelte/elements";
declare const FormInput: import("svelte").Component<Omit<HTMLInputAttributes, "id" | "name" | "value">, {}, "">;
type FormInput = ReturnType<typeof FormInput>;
export default FormInput;
