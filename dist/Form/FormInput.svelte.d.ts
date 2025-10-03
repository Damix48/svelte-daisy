import type { HTMLInputAttributes } from "svelte/elements";
declare const FormInput: import("svelte").Component<Omit<HTMLInputAttributes, "name" | "value" | "id">, {}, "">;
type FormInput = ReturnType<typeof FormInput>;
export default FormInput;
