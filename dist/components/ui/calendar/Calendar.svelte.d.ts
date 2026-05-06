import type { Snippet } from "svelte";
import type { ClassValue } from "svelte/elements";
import "@formatjs/intl-locale/polyfill.js";
interface HeaderSnippetArgs {
    goNext: () => void;
    goPrev: () => void;
    month: Date;
    heading: string;
}
interface DaySnippetArgs {
    date: Date;
    selected: boolean;
    today: boolean;
    outside: boolean;
}
interface CalendarCommonProps {
    placeholder?: Date;
    onPlaceholderChange?: (date: Date) => void;
    locale?: string;
    weekStartsOn?: number;
    weekdayFormat?: "narrow" | "short" | "long";
    fixedWeeks?: boolean;
    numberOfMonths?: number;
    pagedNavigation?: boolean;
    preventDeselect?: boolean;
    isDateDisabled?: (date: Date) => boolean;
    isDateUnavailable?: (date: Date) => boolean;
    minValue?: Date;
    maxValue?: Date;
    showMonthSelect?: boolean;
    showYearSelect?: boolean;
    class?: ClassValue | null | undefined;
    header?: Snippet<[HeaderSnippetArgs]>;
    day?: Snippet<[DaySnippetArgs]>;
    [rest: string]: unknown;
}
type CalendarProps = (CalendarCommonProps & {
    type?: "single";
    value?: Date | undefined;
    onValueChange?: (value: Date | undefined) => void;
}) | (CalendarCommonProps & {
    type: "multiple";
    value?: Date[];
    onValueChange?: (value: Date[] | undefined) => void;
}) | (CalendarCommonProps & {
    type: "range";
    value?: {
        start: Date;
        end: Date;
    } | undefined;
    onValueChange?: (value: {
        start: Date;
        end: Date;
    } | undefined) => void;
});
declare const Calendar: import("svelte").Component<CalendarProps, {}, "placeholder" | "value">;
type Calendar = ReturnType<typeof Calendar>;
export default Calendar;
