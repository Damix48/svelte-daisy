import type { ClassValue } from "svelte/elements";
type $$ComponentProps = {
    value?: string;
    placeholder?: string;
    oninput?: (e: Event) => void;
    onblur?: (e: FocusEvent) => void;
    onkeydown?: (e: KeyboardEvent) => void;
    onfocus?: (e: FocusEvent) => void;
    disabled?: boolean;
    class?: ClassValue;
};
declare const DatePickerInput: import("svelte").Component<$$ComponentProps, {}, "value">;
type DatePickerInput = ReturnType<typeof DatePickerInput>;
export default DatePickerInput;
