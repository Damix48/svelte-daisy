import type { HTMLTextareaAttributes } from "svelte/elements";
declare const FormTextarea: import("svelte").Component<Omit<HTMLTextareaAttributes, "id" | "name" | "value">, {}, "">;
type FormTextarea = ReturnType<typeof FormTextarea>;
export default FormTextarea;
