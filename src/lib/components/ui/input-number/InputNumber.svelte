<script lang="ts">
import { Minus, Plus } from "@lucide/svelte";
import type { HTMLInputAttributes } from "svelte/elements";
import type { ControlProps, InputNumberProps, IntlNumberProps } from "./types";

let {
  value = $bindable(undefined),
  step = 1,
  min,
  max,
  decimalPlaces,
  label,
  class: className,

  locale,
  formatStyle = "decimal",
  currency = "USD",
  currencyDisplay = "symbol",
  unit,
  unitDisplay = "short",
  useGrouping = "auto",
  minimumFractionDigits,
  maximumFractionDigits,
  emptyValue = undefined,
  formatOnBlurOnly = true,

  showControls = false,
  decrementSnippet,
  incrementSnippet,

  ...restProps
}: InputNumberProps & IntlNumberProps & ControlProps & Omit<HTMLInputAttributes, "value" | "step" | "min" | "max" | "class" | "type"> = $props();

const atMin = $derived(value !== undefined && min !== undefined && value <= min);
const atMax = $derived(value !== undefined && max !== undefined && value >= max);

let focused = $state(false);
let displayValue: string = $state("");

function resolvedMinFractionDigits() {
  if (minimumFractionDigits !== undefined) return minimumFractionDigits;
  if (decimalPlaces !== undefined) return decimalPlaces;
  return 0;
}

function resolvedMaxFractionDigits() {
  if (maximumFractionDigits !== undefined) return maximumFractionDigits;
  if (decimalPlaces !== undefined) return decimalPlaces;
  return 2;
}

function getFormatter() {
  const options: Intl.NumberFormatOptions = {
    style: formatStyle,
    useGrouping,
    minimumFractionDigits: resolvedMinFractionDigits(),
    maximumFractionDigits: resolvedMaxFractionDigits()
  };

  if (formatStyle === "currency") {
    options.currency = currency;
    options.currencyDisplay = currencyDisplay;
  }

  if (formatStyle === "unit" && unit) {
    options.unit = unit;
    options.unitDisplay = unitDisplay;
  }

  return new Intl.NumberFormat(locale, options);
}

function getDecimalSeparator() {
  const parts = new Intl.NumberFormat(locale).formatToParts(1.1);
  return parts.find((part) => part.type === "decimal")?.value ?? ".";
}

function getGroupSeparator() {
  const parts = new Intl.NumberFormat(locale).formatToParts(1000);
  return parts.find((part) => part.type === "group")?.value ?? ",";
}

function processValue(num: number | undefined): number | undefined {
  if (num === undefined || Number.isNaN(num)) return emptyValue;

  const clampedValue = Math.max(min ?? -Infinity, Math.min(max ?? Infinity, num));

  if (decimalPlaces !== undefined) {
    return parseFloat(clampedValue.toFixed(decimalPlaces));
  }

  return clampedValue;
}

function getPrecision(num: number) {
  if (!Number.isFinite(num)) return 0;

  const s = String(num);

  if (s.includes("e-")) {
    const [, exp] = s.split("e-");
    return Number(exp);
  }

  const fraction = s.split(".")[1];
  return fraction?.length ?? 0;
}

function performOperation(currentValue: number, operation: "add" | "subtract"): number {
  const precision = decimalPlaces ?? Math.max(getPrecision(step), getPrecision(currentValue));

  if (precision === 0) {
    return operation === "add" ? currentValue + step : currentValue - step;
  }

  const factor = 10 ** precision;
  const valueInt = Math.round(currentValue * factor);
  const stepInt = Math.round(step * factor);
  const result = operation === "add" ? valueInt + stepInt : valueInt - stepInt;

  return result / factor;
}

function formatValue(num: number | undefined) {
  if (num === undefined || Number.isNaN(num)) return "";
  return getFormatter().format(num);
}

function toEditingString(num: number | undefined) {
  if (num === undefined || Number.isNaN(num)) return "";

  const decimalSeparator = getDecimalSeparator();

  if (decimalPlaces !== undefined) {
    return num.toFixed(decimalPlaces).replace(".", decimalSeparator);
  }

  return String(num).replace(".", decimalSeparator);
}

function parseDisplayValue(raw: string): number | undefined {
  const trimmed = raw.trim();
  if (!trimmed) return emptyValue;

  // keep only digits, separators and sign
  let sanitized = trimmed.replace(/\s/g, "").replace(/[^\d.,+-]/g, "");

  // keep only leading sign
  sanitized = sanitized.replace(/(?!^)[+-]/g, "");

  const lastDot = sanitized.lastIndexOf(".");
  const lastComma = sanitized.lastIndexOf(",");
  const decimalIndex = Math.max(lastDot, lastComma);

  let normalized: string;

  if (decimalIndex === -1) {
    // no decimal separator
    normalized = sanitized.replace(/[.,]/g, "");
  } else {
    const integerPart = sanitized.slice(0, decimalIndex).replace(/[.,]/g, "");
    const fractionPart = sanitized.slice(decimalIndex + 1).replace(/[.,]/g, "");
    normalized = `${integerPart}.${fractionPart}`;
  }

  // preserve leading sign
  if (sanitized.startsWith("-") && !normalized.startsWith("-")) {
    normalized = `-${normalized}`;
  } else if (sanitized.startsWith("+") && !normalized.startsWith("+")) {
    normalized = `+${normalized}`;
  }

  const parsed = Number(normalized);
  if (!Number.isFinite(parsed)) return emptyValue;

  return processValue(parsed);
}

function decrease() {
  const startValue = value ?? min ?? 0;
  value = processValue(performOperation(startValue, "subtract"));
}

function increase() {
  const startValue = value ?? min ?? 0;
  value = processValue(performOperation(startValue, "add"));
}

function handleInput(v: string) {
  displayValue = v;
  value = parseDisplayValue(v);
}

function handleChange() {
  value = processValue(value);
  if (!focused || !(formatOnBlurOnly === true || formatOnBlurOnly === "true")) {
    displayValue = formatValue(value);
  }
}

function handleFocus() {
  focused = true;
  if (formatOnBlurOnly) {
    displayValue = toEditingString(value);
  }
}

function handleBlur() {
  focused = false;
  value = processValue(value);
  displayValue = formatValue(value);
}

$effect(() => {
  displayValue = focused && formatOnBlurOnly ? toEditingString(value) : formatValue(value);
});
</script>

<label class="input input-number {className}" aria-invalid={restProps["aria-invalid"]}>
  {#if showControls === true || showControls === "true"}
    <button class="label touch-hitbox !h-full transition-all {atMin ? 'bg-base-200 opacity-50' : ''}" onclick={decrease} disabled={atMin} type="button" aria-label="Decrease value">
      {#if decrementSnippet}
        {@render decrementSnippet()}
      {:else}
        <Minus size={12} />
      {/if}
    </button>
  {/if}

  <input
    class="no-spinner"
    type="text"
    inputmode="decimal"
    bind:value={() => displayValue, handleInput}
    {step}
    {min}
    {max}
    {...restProps}
    onfocus={handleFocus}
    onblur={handleBlur}
    onchange={handleChange}
    aria-label={label ? undefined : "Value"}
  >

  {#if showControls === true || showControls === "true"}
    <button class="label touch-hitbox !h-full transition-all {atMax ? 'bg-base-200 opacity-50' : ''}" onclick={increase} disabled={atMax} type="button" aria-label="Increase value">
      {#if incrementSnippet}
        {@render incrementSnippet()}
      {:else}
        <Plus size={12} />
      {/if}
    </button>
  {/if}
</label>
