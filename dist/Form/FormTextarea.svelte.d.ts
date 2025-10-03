import type { HTMLTextareaAttributes } from "svelte/elements";
declare const FormTextarea: import("svelte").Component<Omit<HTMLTextareaAttributes, "name" | "value" | "id">, {}, "">;
type FormTextarea = ReturnType<typeof FormTextarea>;
export default FormTextarea;
