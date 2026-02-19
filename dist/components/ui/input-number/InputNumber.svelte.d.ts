import type { HTMLInputAttributes } from "svelte/elements";
import type { InputNumberProps } from "./types";
type $$ComponentProps = InputNumberProps & Omit<HTMLInputAttributes, "value" | "step" | "min" | "max" | "class">;
declare const InputNumber: import("svelte").Component<$$ComponentProps, {}, "value">;
type InputNumber = ReturnType<typeof InputNumber>;
export default InputNumber;
