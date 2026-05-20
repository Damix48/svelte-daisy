<script lang="ts">
import { ChevronLeft, ChevronRight } from "@lucide/svelte";
import "@formatjs/intl-locale/polyfill.js";
import type { CalendarProps } from "./types";

// ============================================================
// Props
// ============================================================
let {
  type,
  value = $bindable(),
  onValueChange,
  placeholder = $bindable(new Date()),
  onPlaceholderChange,
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
  header: headerSnippet,
  day: daySnippet,
  ...restProps
}: CalendarProps = $props();

// ============================================================
// Range selection state
// ============================================================
let rangePhase = $state<"idle" | "selecting">("idle");
let rangeDraftStart = $state<Date | undefined>(undefined);
let rangeHoverDate = $state<Date | undefined>(undefined);

// ============================================================
// Date utility helpers
// ============================================================

const weekStart = $derived(weekStartsOn && weekStartsOn >= 0 ? weekStartsOn : Number(new Intl.Locale(locale).getWeekInfo().firstDay));

function isValidDate(d: unknown): d is Date {
  return d instanceof Date && !isNaN(d.getTime());
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isBeforeDay(a: Date, b: Date): boolean {
  if (a.getFullYear() !== b.getFullYear()) return a.getFullYear() < b.getFullYear();
  if (a.getMonth() !== b.getMonth()) return a.getMonth() < b.getMonth();
  return a.getDate() < b.getDate();
}

function isAfterDay(a: Date, b: Date): boolean {
  if (a.getFullYear() !== b.getFullYear()) return a.getFullYear() > b.getFullYear();
  if (a.getMonth() !== b.getMonth()) return a.getMonth() > b.getMonth();
  return a.getDate() > b.getDate();
}

function isBetweenDay(date: Date, start: Date, end: Date): boolean {
  return isAfterDay(date, start) && isBeforeDay(date, end);
}

function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

// ============================================================
// Grid computation
// ============================================================
function getMonthGrid(year: number, month: number, weekStartsOn: number, fixedWeeks: boolean): Date[][] {
  const firstDay = new Date(year, month, 1);
  const totalDays = new Date(year, month + 1, 0).getDate();

  const startOffset = (firstDay.getDay() - weekStartsOn + 7) % 7;

  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];

  // Leading days from previous month
  for (let i = 0; i < startOffset; i++) {
    currentWeek.push(new Date(year, month, i - startOffset + 1));
  }

  // Days of current month
  for (let d = 1; d <= totalDays; d++) {
    currentWeek.push(new Date(year, month, d));
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  // Trailing days from next month
  if (currentWeek.length > 0) {
    for (let i = 1; currentWeek.length < 7; i++) {
      currentWeek.push(new Date(year, month + 1, i));
    }
    weeks.push(currentWeek);
  }

  // Fixed weeks: ensure 6 rows
  if (fixedWeeks) {
    while (weeks.length < 6) {
      const lastDate = weeks[weeks.length - 1][6];
      const nextWeek: Date[] = [];
      for (let i = 1; i <= 7; i++) {
        nextWeek.push(new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate() + i));
      }
      weeks.push(nextWeek);
    }
  }

  return weeks;
}

// ============================================================
// Derived formatters
// ============================================================
const weekdayFormatter = $derived(new Intl.DateTimeFormat(locale, { weekday: weekdayFormat }));
const headingFormatter = $derived(new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }));
const monthFormatter = $derived(new Intl.DateTimeFormat(locale, { month: "long" }));

const weekdays = $derived.by(() => {
  const ref = new Date(2026, 0, 4 + weekStart);
  const names: string[] = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(ref);
    day.setDate(ref.getDate() + i);
    names.push(weekdayFormatter.format(day));
  }
  return names;
});

const monthNames = $derived.by(() => Array.from({ length: 12 }, (_, i) => monthFormatter.format(new Date(2026, i, 1))));

const currentYear = $derived(new Date().getFullYear());
const yearRange = $derived(Array.from({ length: 21 }, (_, i) => currentYear - 10 + i));

const safePlaceholder = $derived(isValidDate(placeholder) ? placeholder : new Date());

const visibleMonths = $derived(
  Array.from({ length: numberOfMonths }, (_, i) => {
    const monthDate = addMonths(safePlaceholder, i);
    return {
      value: new Date(monthDate.getFullYear(), monthDate.getMonth(), 1),
      heading: headingFormatter.format(monthDate),
      weeks: getMonthGrid(monthDate.getFullYear(), monthDate.getMonth(), weekStart, fixedWeeks)
    };
  })
);

// ============================================================
// Value helpers (internally casts — discriminated union safe for consumers)
// ============================================================
function isSingleSelected(date: Date): boolean {
  if (type !== "single") return false;
  const v = value as Date | undefined;
  return v != null && isSameDay(v, date);
}

function isMultipleSelected(date: Date): boolean {
  if (type !== "multiple") return false;
  const arr = value as Date[] | undefined;
  return (arr ?? []).some((v) => isSameDay(v, date));
}

function isDateSelected(date: Date): boolean {
  if (type === "single") return isSingleSelected(date);
  if (type === "multiple") return isMultipleSelected(date);
  const r = value as { start: Date; end: Date } | undefined;
  if (!r) return false;
  return isSameDay(r.start, date) || isSameDay(r.end, date);
}

function isDateToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

function isOutsideMonth(date: Date, monthValue: Date): boolean {
  return date.getMonth() !== monthValue.getMonth() || date.getFullYear() !== monthValue.getFullYear();
}

function checkDisabled(date: Date): boolean {
  if (isDateDisabled?.(date)) return true;
  if (minValue && isBeforeDay(date, minValue)) return true;
  if (maxValue && isAfterDay(date, maxValue)) return true;
  return false;
}

// ============================================================
// Range segment checks (finalized range)
// ============================================================
function isFinalRangeStart(date: Date): boolean {
  if (type !== "range") return false;
  const r = value as { start: Date; end: Date } | undefined;
  if (!r || isSameDay(r.start, r.end)) return false;
  return isSameDay(r.start, date);
}

function isFinalRangeEnd(date: Date): boolean {
  if (type !== "range") return false;
  const r = value as { start: Date; end: Date } | undefined;
  if (!r || isSameDay(r.start, r.end)) return false;
  return isSameDay(r.end, date);
}

function isFinalRangeInner(date: Date): boolean {
  if (type !== "range") return false;
  const r = value as { start: Date; end: Date } | undefined;
  if (!r || isSameDay(r.start, r.end)) return false;
  const start = r.start < r.end ? r.start : r.end;
  const end = r.start < r.end ? r.end : r.start;
  return isBetweenDay(date, start, end);
}

// ============================================================
// Range preview (hover state while selecting)
// ============================================================
function rangePreviewBounds(): { start: Date; end: Date } | null {
  if (type !== "range" || rangePhase !== "selecting" || !rangeDraftStart) return null;
  const end = rangeHoverDate ?? rangeDraftStart;
  return {
    start: rangeDraftStart < end ? rangeDraftStart : end,
    end: rangeDraftStart < end ? end : rangeDraftStart
  };
}

// ============================================================
// CSS class builder per day cell
// ============================================================
function dayCellClasses(date: Date, monthValue: Date): string {
  const outside = isOutsideMonth(date, monthValue);
  const disabled = checkDisabled(date);
  const unavailable = isDateUnavailable?.(date) ?? false;
  const today = isDateToday(date);
  const sel = isDateSelected(date);

  // Base
  let classes = "h-10 w-full grid place-items-center text-sm";

  // Disabled
  if (disabled) {
    classes += " opacity-30 pointer-events-none";
    if (outside) classes += " rounded-field";
    return classes;
  }

  // Unavailable
  if (unavailable) {
    classes += " line-through text-base-content/50 rounded-field";
    return classes;
  }

  // Range preview (hover while selecting)
  const preview = rangePreviewBounds();
  if (preview) {
    if (isSameDay(preview.start, preview.end) && isSameDay(date, preview.start)) {
      return `${classes} bg-primary text-base-100 rounded-field`;
    }
    if (isSameDay(date, preview.start)) {
      return `${classes} bg-primary text-base-100 rounded-l-field rounded-r-none`;
    }
    if (isSameDay(date, preview.end)) {
      return `${classes} bg-primary text-base-100 rounded-r-field rounded-l-none`;
    }
    if (isBetweenDay(date, preview.start, preview.end)) {
      return `${classes} bg-base-200 rounded-none`;
    }
  }

  // Finalized range
  if (isFinalRangeStart(date)) {
    return `${classes} bg-primary text-base-100 rounded-l-field rounded-r-none`;
  }
  if (isFinalRangeEnd(date)) {
    return `${classes} bg-primary text-base-100 rounded-r-field rounded-l-none`;
  }
  if (isFinalRangeInner(date)) {
    return `${classes} bg-base-200 rounded-none`;
  }

  // Selected (single, multiple, or single-day range)
  if (sel) {
    return `${classes} bg-primary text-base-100 rounded-field`;
  }

  // Today
  if (today) {
    return `${classes} bg-base-content text-base-100 rounded-field`;
  }

  // Outside month (not disabled, not unavailable)
  if (outside) {
    return `${classes} opacity-30`;
  }

  // Default (clickable)
  return `${classes} hover:bg-base-200 rounded-field cursor-pointer`;
}

// ============================================================
// Navigation
// ============================================================
function goPrevMonth() {
  const delta = pagedNavigation ? -(numberOfMonths ?? 1) : -1;
  const newPlaceholder = addMonths(placeholder, delta);
  placeholder = newPlaceholder;
  onPlaceholderChange?.(newPlaceholder);
}

function goNextMonth() {
  const delta = pagedNavigation ? (numberOfMonths ?? 1) : 1;
  const newPlaceholder = addMonths(placeholder, delta);
  placeholder = newPlaceholder;
  onPlaceholderChange?.(newPlaceholder);
}

function handleMonthSelectChange(e: Event) {
  const month = Number((e.target as HTMLSelectElement).value);
  const newPlaceholder = new Date(placeholder.getFullYear(), month, 1);
  placeholder = newPlaceholder;
  onPlaceholderChange?.(newPlaceholder);
}

function handleYearSelectChange(e: Event) {
  const year = Number((e.target as HTMLSelectElement).value);
  const newPlaceholder = new Date(year, placeholder.getMonth(), 1);
  placeholder = newPlaceholder;
  onPlaceholderChange?.(newPlaceholder);
}

// ============================================================
// Selection handlers
// ============================================================
function handleDayClick(date: Date) {
  if (checkDisabled(date) || (isDateUnavailable?.(date) ?? false)) return;

  if (type === "single") {
    handleSingleClick(date);
  } else if (type === "multiple") {
    handleMultipleClick(date);
  } else if (type === "range") {
    handleRangeClick(date);
  }
}

function handleSingleClick(date: Date) {
  const v = value as Date | undefined;
  if (v && isSameDay(v, date)) {
    if (preventDeselect) return;
    value = undefined;
    onValueChange?.(undefined);
  } else {
    value = date;
    onValueChange?.(date);
  }
}

function handleMultipleClick(date: Date) {
  const arr = (value as Date[] | undefined) ?? [];
  const idx = arr.findIndex((v) => isSameDay(v, date));
  const next = idx >= 0 ? arr.filter((_, i) => i !== idx) : [...arr, date];
  value = next;
  onValueChange?.(next);
}

function handleRangeClick(date: Date) {
  if (rangePhase === "idle") {
    rangePhase = "selecting";
    rangeDraftStart = date;
    value = { start: date, end: date };
  } else {
    const start = rangeDraftStart ?? date;
    const nextRange = isSameDay(start, date)
      ? { start: date, end: date }
      : {
          start: start < date ? start : date,
          end: start < date ? date : start
        };
    value = nextRange;
    onValueChange?.(nextRange);
    rangePhase = "idle";
    rangeDraftStart = undefined;
    rangeHoverDate = undefined;
  }
}

function handleDayMouseEnter(date: Date) {
  if (type === "range" && rangePhase === "selecting") {
    rangeHoverDate = date;
  }
}

function handleDayMouseLeave() {
  if (type === "range" && rangePhase === "selecting") {
    rangeHoverDate = undefined;
  }
}

export function goToSelected() {
  if (type === "single") {
    const v = value as Date | undefined;
    if (isValidDate(v)) {
      placeholder = new Date(v.getFullYear(), v.getMonth(), 1);
      onPlaceholderChange?.(placeholder);
    }
  } else if (type === "multiple") {
    const arr = value as Date[] | undefined;
    if (arr && arr.length > 0 && isValidDate(arr[0])) {
      const v = arr[0];
      placeholder = new Date(v.getFullYear(), v.getMonth(), 1);
      onPlaceholderChange?.(placeholder);
    }
  } else if (type === "range") {
    const r = value as { start: Date; end: Date } | undefined;
    if (r && isValidDate(r.start)) {
      const v = r.start;
      placeholder = new Date(v.getFullYear(), v.getMonth(), 1);
      onPlaceholderChange?.(placeholder);
    }
  }
}

export function resetState() {
  rangePhase = "idle";
  rangeDraftStart = undefined;
  rangeHoverDate = undefined;
}
</script>

<div class="bg-base-100 w-full rounded-box p-4 inline-block {className}" {...restProps}>
  <div class="flex gap-4 w-full">
    {#each visibleMonths as month, i (`m-${month.value.toISOString()}`)}
      <div class="w-full">
        <!-- ============================================ -->
        <!-- Header                                      -->
        <!-- ============================================ -->
        {#if i === 0}
          {#if headerSnippet}
            <div class="flex items-center justify-between mb-2">
              {@render headerSnippet({
                goNext: goNextMonth,
                goPrev: goPrevMonth,
                month: month.value,
                heading: month.heading,
              })}
            </div>
          {:else}
            <div class="flex items-center justify-between mb-2">
              <button class="btn btn-ghost btn-square btn-xs size-8" onclick={goPrevMonth} aria-label="Previous month" type="button">
                <ChevronLeft class="size-4" />
              </button>
              <div class="flex items-center gap-1">
                {#if showMonthSelect}
                  <select class="select border-0 font-medium h-auto" value={placeholder.getMonth()} onchange={handleMonthSelectChange}>
                    {#each monthNames as name, mi}
                      <option value={mi}>{name}</option>
                    {/each}
                  </select>
                {/if}
                {#if showYearSelect}
                  <select class="select border-0 font-medium h-auto" value={placeholder.getFullYear()} onchange={handleYearSelectChange}>
                    {#each yearRange as y}
                      <option value={y}>{y}</option>
                    {/each}
                  </select>
                {/if}
                {#if !showMonthSelect && !showYearSelect}
                  <span class="text-sm font-medium">{month.heading}</span>
                {:else if showMonthSelect && !showYearSelect}
                  <span class="text-sm font-medium">{placeholder.getFullYear()}</span>
                {/if}
              </div>
              {#if numberOfMonths === 1}
                <button class="btn btn-ghost btn-square btn-xs size-8" onclick={goNextMonth} aria-label="Next month" type="button">
                  <ChevronRight class="size-4" />
                </button>
              {:else}
                <div class="size-8"></div>
              {/if}
            </div>
          {/if}
        {:else if i === numberOfMonths - 1}
          <div class="flex items-center justify-between mb-2">
            <div class="size-8"></div>
            <span class="text-sm font-medium">{month.heading}</span>
            <button class="btn btn-ghost btn-square btn-xs size-8" onclick={goNextMonth} aria-label="Next month" type="button">
              <ChevronRight class="size-4" />
            </button>
          </div>
        {:else}
          <div class="flex items-center justify-center mb-2 h-8">
            <span class="text-sm font-medium">{month.heading}</span>
          </div>
        {/if}

        <!-- ============================================ -->
        <!-- Grid                                        -->
        <!-- ============================================ -->
        <div class="select-none">
          <!-- Weekday headers -->
          <div class="flex">
            {#each weekdays as day}
              <span class="text-base-content/50 text-xs flex items-center justify-center h-10 w-full"> {day} </span>
            {/each}
          </div>

          <!-- Week rows -->
          {#each month.weeks as week (`w-${week[0].toISOString()}`)}
            <div class="flex">
              {#each week as date (date.toISOString())}
                {@const outside = isOutsideMonth(date, month.value)}
                {@const selected = isDateSelected(date)}
                {@const today = isDateToday(date)}
                {@const disabled = checkDisabled(date)}

                <button
                  class={dayCellClasses(date, month.value)}
                  type="button"
                  {disabled}
                  onclick={() => handleDayClick(date)}
                  onmouseenter={() => handleDayMouseEnter(date)}
                  onmouseleave={handleDayMouseLeave}
                >
                  {#if daySnippet}
                    {@render daySnippet({ date, selected, today, outside })}
                  {:else}
                    {date.getDate()}
                  {/if}
                </button>
              {/each}
            </div>
          {/each}
        </div>
      </div>
    {/each}
  </div>
</div>
