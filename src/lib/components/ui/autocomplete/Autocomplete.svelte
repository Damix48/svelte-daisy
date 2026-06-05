<script lang="ts" generics="TItem">
import { ChevronsUpDown, LoaderCircle, Search, X } from "@lucide/svelte";
import type { HTMLInputAttributes } from "svelte/elements";
import { Dropdown } from "../dropdown";
import type { Snippet } from "svelte";
import { Debounced, useDebounce } from "runed";

let {
  items = [],
  search,
  debounce = 0,
  value = $bindable(undefined),
  onItemSelected,
  itemToString = (item: TItem) => (item == null ? "" : String(item)),
  itemToId = (item: TItem) => (item == null ? "" : String(item)),
  itemTemplate,
  placeholder = "Search...",
  minSearchLength,
  disabled = false,
  class: className = "",
  ...restProps
}: {
  items?: TItem[];
  search?: ((query: string) => Promise<TItem[]>) | ((query: string) => TItem[]);
  debounce?: number;
  value?: string;
  onItemSelected?: (item: TItem) => void;
  itemToString?: (item: TItem) => string;
  itemToId?: (item: TItem) => string | number;
  itemTemplate?: Snippet<[TItem]>;
  placeholder?: string;
  minSearchLength?: number;
} & Omit<HTMLInputAttributes, "id" | "value" | "type"> = $props();

const id = $props.id();
const listboxId = `listbox-${id}`;

const effectiveMinLength = $derived(minSearchLength ?? (search ? 1 : 0));

let open = $state(false);
let loading = $state(false);
let results: TItem[] = $state([]);
let highlightedIndex = $state(-1);
let inputEl: HTMLInputElement | undefined = $state(undefined);
let listboxEl: HTMLUListElement | undefined = $state(undefined);
let itemElements: HTMLLIElement[] = $state([]);

function fillValue(item: TItem) {
  value = itemToString(item);
  open = false;
  highlightedIndex = -1;
  onItemSelected?.(item);
}

function clearValue() {
  value = undefined;
  open = false;
  highlightedIndex = -1;
}

async function handleKeyDown(e: KeyboardEvent) {
  open = true;

  const length = Array.isArray(filteredItems) ? filteredItems.length : await filteredItems.then((res) => res.length).catch(() => 0);

  switch (e.key) {
    case "ArrowDown": {
      e.preventDefault();
      if (length > 0) {
        highlightedIndex = (highlightedIndex + 1) % length;
      }
      break;
    }
    case "ArrowUp": {
      e.preventDefault();
      if (length > 0) {
        highlightedIndex = (Math.max(highlightedIndex, 0) - 1 + length) % length;
      }
      break;
    }
    case "Enter": {
      if (highlightedIndex >= 0 && highlightedIndex < length) {
        e.preventDefault();
        fillValue(Array.isArray(filteredItems) ? filteredItems[highlightedIndex] : await filteredItems.then((res) => res[highlightedIndex]));
      }
      break;
    }
    case "Escape": {
      open = false;
      break;
    }
  }

  itemElements[highlightedIndex]?.scrollIntoView({
    block: "nearest",
    behavior: "smooth"
  });
}

function handleFocus(event: FocusEvent & { currentTarget: EventTarget & HTMLInputElement }) {
  open = true;
}

function handleBlur(event: FocusEvent) {
  if (event.relatedTarget === null) {
    open = false;
  }
}

const debounced = new Debounced(
  () => value,
  () => debounce
);

const filteredItems = $derived.by(() => {
  if (!debounced.current) return Promise.resolve(items);

  if (!search) {
    const lowerTerm = debounced.current.trim().toLowerCase();

    return Promise.resolve(items.filter((item) => itemToString(item).trim().toLowerCase().includes(lowerTerm)));
  }

  return search(debounced.current);
});
</script>

<Dropdown.Root {...restProps} {id} bind:open>
  <div class="input inline-flex items-center overflow-hidden anchor-[--popover] {className}">
    <Search size={16} class="shrink-0 text-(--input-color)" />
    <input
      bind:this={inputEl}
      type="text"
      bind:value
      {placeholder}
      {disabled}
      autocomplete="off"
      class="min-w-0 truncate bg-transparent outline-none border-0 p-0 grow"
      role="combobox"
      aria-haspopup="listbox"
      aria-expanded={open}
      aria-controls={listboxId}
      aria-autocomplete="list"
      onkeydown={handleKeyDown}
      onfocus={handleFocus}
      onblur={handleBlur}
    >
    {#if loading}
      <LoaderCircle size={16} class="shrink-0 animate-spin text-(--input-color)" />
    {/if}
    <!-- {#if value}
      <button
        type="button"
        class="shrink-0 self-stretch flex items-center justify-end min-w-8 disabled:opacity-40 focus-visible:outline-0 touch-hitbox"
        {disabled}
        onclick={clearValue}
      >
        <X size={16} class="text-(--input-color)" />
      </button>
    {/if} -->
    <button
      type="button"
      class="shrink-0 self-stretch flex items-center justify-end min-w-8 ps-1 disabled:opacity-40 focus-visible:outline-0 touch-hitbox"
      {disabled}
      popovertarget="popover-{id}"
      onblur={handleBlur}
    >
      <ChevronsUpDown size={16} class="text-(--input-color)" />
    </button>
  </div>

  <Dropdown.Content class="bg-base-100 border-base-content/20 rounded-field dropdown-auto-size mt-1 border-(length:--border) shadow-sm" popover="manual">
    <ul
      bind:this={listboxEl}
      class="menu max-h-96 w-full flex-nowrap overflow-y-auto overscroll-contain"
      id={listboxId}
      role="listbox"
      onkeydown={(e) => {
				inputEl?.focus();
				handleKeyDown(e);
			}}
    >
      {#await filteredItems}
        <li class="menu-disabled">
          <div class="min-h-16 flex items-center-safe justify-center-safe">
            <span class="loading loading-spinner"></span>
          </div>
        </li>
      {:then results}
        {#if results.length === 0}
          <li class="menu-disabled"><span>No results found.</span></li>
        {:else}
          {#each results as item, i (itemToId(item))}
            <li bind:this={itemElements[i]} role="option" aria-selected={false} class="scroll-my-16">
              <button
                type="button"
                class={["flex w-full min-w-0 items-center gap-2 overflow-hidden text-left", i === highlightedIndex && "menu-focus"]}
                onclick={() => fillValue(item)}
              >
                {#if itemTemplate}
                  <div class="min-w-0 flex-1 overflow-hidden">
                    {@render itemTemplate(item)}
                  </div>
                {:else}
                  <span class="min-w-0 w-full truncate">{itemToString(item)}</span>
                {/if}
              </button>
            </li>
          {/each}
        {/if}
      {:catch error}
        {error}
        <li class="menu-disabled"><span>Error loading results</span></li>
      {/await}
    </ul>
  </Dropdown.Content>
</Dropdown.Root>
