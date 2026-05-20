<script lang="ts">
import { watch } from "runed";
import type { Snippet } from "svelte";
import type { ClassValue } from "svelte/elements";
import { Dropdown } from "../dropdown";
import Calendar from "./Calendar.svelte";
import DatePickerInput from "./DatePickerInput.svelte";
import type { SingleValue, RangeValue, HeaderSnippetArgs, DaySnippetArgs } from "./types";

type DatePickerProps = {
  type?: "single" | "range";
  value?: SingleValue | RangeValue;
  placeholder?: string;
  dateFormat?: Intl.DateTimeFormatOptions;
  onValueChange?: (value: SingleValue | RangeValue) => void;
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
};

// ============================================================
// Props
// ============================================================
let {
  type = "single",
  value = $bindable(),
  onValueChange,
  placeholder = "Select a date",
  dateFormat,
  locale = "en-US",
  weekStartsOn,
  weekdayFormat = "narrow",
  fixedWeeks = false,
  numberOfMonths = 1,
  pagedNavigation = false,
  preventDeselect = false,
  isDateDisabled,
  isDateUnavailable,
  minValue,
  maxValue,
  showMonthSelect = false,
  showYearSelect = false,
  class: className = "",
  header,
  day,
  ...restProps
}: DatePickerProps = $props();

// ============================================================
// State
// ============================================================
let open = $state(false);
let textValue = $state("");
let isEditing = $state(false);
let calendarRef: Calendar | undefined = $state(undefined);

// ============================================================
// Formatting
// ============================================================
const defaultFormatOptions: Intl.DateTimeFormatOptions = { year: "numeric", month: "numeric", day: "numeric" };
const formatter = $derived(new Intl.DateTimeFormat(locale, dateFormat ?? defaultFormatOptions));

function formatDate(date: Date | undefined): string {
  if (!date || isNaN(date.getTime())) return "";
  return formatter.format(date);
}

function formatDisplayValue(val: typeof value): string {
  if (type === "single") {
    return formatDate(val as Date | undefined);
  }
  if (type === "range") {
    const r = val as { start: Date; end: Date } | undefined;
    if (!r) return "";

    if (isSameDay(r.start, r.end)) {
      return formatDate(r.start);
    }

    return `${formatDate(r.start)} - ${formatDate(r.end)}`;
  }
  return "";
}

// ============================================================
// Locale-aware date format detection
// ============================================================
const dateFormatOrder = $derived.by<"month-first" | "day-first">(() => {
  const parts = new Intl.DateTimeFormat(locale).formatToParts(new Date(2024, 2, 5));
  const monthIdx = parts.findIndex((p) => p.type === "month");
  const dayIdx = parts.findIndex((p) => p.type === "day");
  return monthIdx < dayIdx ? "month-first" : "day-first";
});

function makeDate(month: number, day: number, year: number): Date | null {
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const date = new Date(year, month - 1, day);
  return !isNaN(date.getTime()) && date.getDate() === day ? date : null;
}

// ============================================================
// Date parsing helpers
// ============================================================
function parseDate(input: string): Date | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Numeric format: prefers locale order, falls back to the opposite
  const numeric = trimmed.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/);
  if (numeric) {
    const [first, second, year] = [Number(numeric[1]), Number(numeric[2]), Number(numeric[3])];
    if (dateFormatOrder === "month-first") {
      return makeDate(first, second, year) ?? makeDate(second, first, year);
    }
    return makeDate(second, first, year) ?? makeDate(first, second, year);
  }

  // Native parser (ISO "2024-01-15", long "Jan 15, 2024", etc.)
  const native = new Date(trimmed);
  return !isNaN(native.getTime()) ? native : null;
}

function parseRange(input: string): { start: Date; end: Date } | null {
  const trimmed = input.trim();
  const match = trimmed.match(/^(.+?)\s*[-–]\s*(.+)$/);
  if (!match) return null;
  const start = parseDate(match[1]);
  const end = parseDate(match[2]);
  if (start && end) return { start, end };
  return null;
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

// ============================================================
// Input handling
// ============================================================
function commitValue() {
  if (type === "single") {
    const parsed = parseDate(textValue);
    if (parsed) {
      value = parsed;
      onValueChange?.(parsed);
    } else if (textValue.trim() === "") {
      const today = new Date();
      value = today;
      onValueChange?.(today);
    }
  } else if (type === "range") {
    const parsed = parseRange(textValue);
    if (parsed) {
      value = parsed;
      onValueChange?.(parsed);
    } else if (textValue.trim() === "") {
      const today = new Date();
      const range = { start: today, end: today };
      value = range;
      onValueChange?.(range);
    }
  }
  isEditing = false;
  textValue = formatDisplayValue(value);
}

function handleInput(e: Event) {
  isEditing = true;
  textValue = (e.target as HTMLInputElement).value;
}

function handleBlur() {
  commitValue();
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === "Enter") {
    e.preventDefault();
    commitValue();
  } else if (e.key === "Escape") {
    isEditing = false;
    textValue = formatDisplayValue(value);
  }
}

// ============================================================
// Calendar selection handling
// ============================================================
function handleCalendarChange(newValue: Date | { start: Date; end: Date } | undefined) {
  value = newValue as any;
  onValueChange?.(newValue);
  if (type === "single") {
    open = false;
  } else if (type === "range") {
    const r = newValue as { start: Date; end: Date } | undefined;
    if (r && !isSameDay(r.start, r.end)) {
      open = false;
    }
  }
}

// ============================================================
// Sync textValue with external value changes
// ============================================================
textValue = formatDisplayValue(value);

$effect(() => {
  if (!isEditing) {
    const formatted = formatDisplayValue(value);
    if (formatted !== textValue) {
      textValue = formatted;
    }
  }
});

function handleFocus(e: FocusEvent): void {
  isEditing = true;
}

watch(
  () => open,
  () => {
    if (open) {
      calendarRef?.goToSelected();
      calendarRef?.resetState();
    }
  }
);
</script>

<Dropdown.Root {...restProps} bind:open>
  <DatePickerInput bind:value={textValue} {placeholder} class={className} oninput={handleInput} onblur={handleBlur} onkeydown={handleKeyDown} onfocus={handleFocus} />

  <Dropdown.Content
    class="bg-base-100 border-base-content/20 rounded-field dropdown-auto-size max-sm:dropdown-sheet mt-1 border-(length:--border) shadow-sm flex justify-center-safe"
  >
    <Calendar
      bind:this={calendarRef}
      {type}
      bind:value
      onValueChange={handleCalendarChange}
      {locale}
      {weekStartsOn}
      {weekdayFormat}
      {fixedWeeks}
      {numberOfMonths}
      {pagedNavigation}
      {preventDeselect}
      {isDateDisabled}
      {isDateUnavailable}
      {minValue}
      {maxValue}
      {showMonthSelect}
      {showYearSelect}
      {header}
      {day}
    />
  </Dropdown.Content>
</Dropdown.Root>
