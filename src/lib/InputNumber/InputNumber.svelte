<script lang="ts">
  import { Minus, Plus } from "@lucide/svelte";
  import { useInterval } from "runed";
  import type { HTMLInputAttributes } from "svelte/elements";
  import type { InputNumberProps } from "./types";

  let {
    value = $bindable(undefined),
    step = 1,
    min,
    max,
    decimalPlaces,
    label,
    class: className,
    ...restProps
  }: InputNumberProps & Omit<HTMLInputAttributes, "value" | "step" | "min" | "max" | "class"> = $props();

  const atMin = $derived(value !== undefined && min !== undefined && value <= min);
  const atMax = $derived(value !== undefined && max !== undefined && value >= max);

  function processValue(num: number | undefined): number | undefined {
    if (num === undefined || isNaN(num)) {
      return undefined;
    }

    let clampedValue = Math.max(min ?? -Infinity, Math.min(max ?? Infinity, num));

    if (decimalPlaces !== undefined) {
      return parseFloat(clampedValue.toFixed(decimalPlaces));
    }

    return clampedValue;
  }

  function performOperation(currentValue: number, operation: "add" | "subtract"): number {
    if (decimalPlaces === undefined) {
      return operation === "add" ? currentValue + step : currentValue - step;
    }

    // To avoid floating point issues (e.g., 0.1 + 0.2), we convert to integers
    const factor = Math.pow(10, decimalPlaces);
    const valueInt = Math.round(currentValue * factor);
    const stepInt = Math.round(step * factor);

    const result = operation === "add" ? valueInt + stepInt : valueInt - stepInt;

    return result / factor;
  }

  const decrease = () => {
    const startValue = value ?? min ?? 0;
    value = processValue(performOperation(startValue, "subtract"));
  };

  const increase = () => {
    const startValue = value ?? min ?? 0;
    value = processValue(performOperation(startValue, "add"));
  };

  let focused = $state(false);

  let displayValue: string | undefined = $state(undefined);
</script>

<label class="input {className}">
  <button class="label touch-hitbox !h-full transition-all {atMin ? 'bg-base-200 opacity-50' : ''}" onclick={decrease} disabled={atMin} type="button" aria-label="Decrease value">
    <Minus size={12} />
  </button>
  <input
    class="no-spinner"
    type="text"
    inputmode="decimal"
    bind:value={
      () => {
        if (!focused) displayValue = value?.toFixed(decimalPlaces) ?? "";
        return displayValue;
      },
      (v) => {
        displayValue = v;
        value = processValue(parseFloat(v ?? "0"));
      }
    }
    {step}
    {min}
    {max}
    {...restProps}
    oninput={(e) => {
      const newValue = parseFloat((e.target as HTMLInputElement).value);
      value = processValue(newValue);
    }}
    onchange={() => {
      value = processValue(value);
    }}
    bind:focused
    aria-label={label ? undefined : "Value"}
  />
  <button class="label !h-full transition-all {atMax ? 'bg-base-200 opacity-50' : ''}" onclick={increase} disabled={atMax} type="button" aria-label="Increase value">
    <Plus size={12} />
  </button>
</label>
