import type { HTMLInputAttributes } from "svelte/elements";
import type { ControlProps, InputNumberProps, IntlNumberProps } from "./types";
type $$ComponentProps = InputNumberProps & IntlNumberProps & ControlProps & Omit<HTMLInputAttributes, "value" | "step" | "min" | "max" | "class" | "type">;
declare const InputNumber: import("svelte").Component<$$ComponentProps, {}, "value">;
type InputNumber = ReturnType<typeof InputNumber>;
export default InputNumber;
