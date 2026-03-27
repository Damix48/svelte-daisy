import type { HTMLInputAttributes } from "svelte/elements";
import type { InputNumberProps } from "../InputNumber/types";
type FormInputNumberProps = Omit<InputNumberProps, "value">;
type $$ComponentProps = FormInputNumberProps & Omit<HTMLInputAttributes, "id" | "name" | "value" | "type">;
declare const FormInputNumber: import("svelte").Component<$$ComponentProps, {}, "">;
type FormInputNumber = ReturnType<typeof FormInputNumber>;
export default FormInputNumber;
