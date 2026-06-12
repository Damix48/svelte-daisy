import type { Snippet } from "svelte";
import type { ClassValue } from "svelte/elements";
export interface HeaderSnippetArgs {
    goNext: () => void;
    goPrev: () => void;
    month: Date;
    heading: string;
}
export interface DaySnippetArgs {
    date: Date;
    selected: boolean;
    today: boolean;
    outside: boolean;
}
export interface CalendarCommonProps {
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
    class?: ClassValue | undefined;
    header?: Snippet<[HeaderSnippetArgs]>;
    day?: Snippet<[DaySnippetArgs]>;
    [rest: string]: unknown;
}
export type SingleValue = Date | undefined;
export type MultipleValue = Date[] | undefined;
export type RangeValue = {
    start: Date;
    end: Date;
} | undefined;
export type CalendarProps = (CalendarCommonProps & {
    type?: "single";
    value?: SingleValue;
    onValueChange?: (value: SingleValue) => void;
}) | (CalendarCommonProps & {
    type: "multiple";
    value?: MultipleValue;
    onValueChange?: (value: MultipleValue) => void;
}) | (CalendarCommonProps & {
    type: "range";
    value?: RangeValue;
    onValueChange?: (value: RangeValue) => void;
});
