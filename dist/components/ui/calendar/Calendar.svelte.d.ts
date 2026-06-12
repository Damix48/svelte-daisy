import "@formatjs/intl-locale/polyfill.js";
import type { CalendarProps } from "./types";
declare const Calendar: import("svelte").Component<CalendarProps, {
    goToSelected: () => void;
    resetState: () => void;
}, "placeholder" | "value">;
type Calendar = ReturnType<typeof Calendar>;
export default Calendar;
