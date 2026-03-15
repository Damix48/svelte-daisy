import type { Snippet } from "svelte";
import type { Booleanish } from "svelte/elements";

export type ControlProps = {
  showControls?: Booleanish;
  decrementSnippet?: Snippet;
  incrementSnippet?: Snippet;
};

export type IntlNumberProps = {
  locale?: Intl.LocalesArgument;
  formatStyle?: keyof Intl.NumberFormatOptionsStyleRegistry;
  currency?: string;
  currencyDisplay?: keyof Intl.NumberFormatOptionsCurrencyDisplayRegistry;
  unit?: string;
  unitDisplay?: "short" | "long" | "narrow";
  useGrouping?: Booleanish | keyof Intl.NumberFormatOptionsUseGroupingRegistry;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  emptyValue?: number | undefined;
  formatOnBlurOnly?: Booleanish;
};

export type InputNumberProps = {
  value: number | undefined;
  step?: number;
  min?: number;
  max?: number;
  decimalPlaces?: number;
  label?: string;
  class?: string;
};
