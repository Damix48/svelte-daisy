<script lang="ts" generics="TItem">
  import { Dropdown } from "../Dropdown";
  import { Check, ChevronsUpDown, Plus, Search } from "@lucide/svelte";
  import type { SelectProps } from "./types";
  import type { HTMLInputAttributes } from "svelte/elements";

  let {
    type = "single",
    searchable = true,
    keepSearchTermOnClose = false,
    createable = false,
    items = [],
    placeholder = "Select an option",
    itemToString = (item: TItem) => (item == null ? "" : String(item)),
    itemToId = (item: TItem) => (item == null ? "" : String(item)),
    itemTemplate,
    selectedItem = $bindable(),
    selectedItems = $bindable([]),
    onCreate,
    ...restProps
  }: SelectProps<TItem> & Omit<HTMLInputAttributes, "id" | "value" | "type"> = $props();

  let searchTerm = $state("");
  let open = $state(false);

  let searchBox: HTMLInputElement | undefined = $state(undefined);
  let highlightedIndex = $state(-1);

  let listboxItem: HTMLUListElement;
  let itemElements: HTMLLIElement[] = $state([]);

  const id = $props.id();
  const listboxId = `listbox-${id}`;

  $effect(() => {
    if (open) {
      searchBox?.focus();
      highlightedIndex = -1;
      if (!keepSearchTermOnClose) searchTerm = "";
    }
  });

  const selectedIds = $derived.by(() => {
    if (type === "single") {
      return new Set(selectedItem ? [itemToId(selectedItem)] : []);
    } else if (type === "multiple") {
      return new Set(selectedItems.map(itemToId));
    }

    return new Set([]);
  });

  // Create a derived value for the text to display in the trigger
  const triggerLabel = $derived.by(() => {
    if (type === "single") {
      return selectedItem ? itemToString(selectedItem) : placeholder;
    } else if (type === "multiple") {
      if (selectedItems.length === 0) return placeholder;
      if (selectedItems.length === 1) return itemToString(selectedItems[0]);
      return `(${selectedItems.length} items) ${selectedItems.map(itemToString).join(", ")}`;
    }
  });

  const filteredItems = $derived.by(() => {
    if (!searchable || !searchTerm) return items;

    return items.filter((item) => itemToString(item).trim().toLowerCase().includes(searchTerm.trim().toLowerCase()));
  });

  function handleClick(item: TItem) {
    if (type === "single") {
      selectedItem = item;
      open = false;
    } else if (type === "multiple") {
      const itemId = itemToId(item);
      if (selectedIds.has(itemId)) {
        selectedItems = selectedItems.filter((i) => itemToId(i) !== itemId);
      } else {
        selectedItems = [...selectedItems, item];
      }
    }

    highlightedIndex = filteredItems.findIndex((i) => itemToId(i) === itemToId(item));
  }

  function handleCreate() {
    if (!canCreate) return;
    onCreate?.(searchTerm);
    open = false;
  }

  function handleKeyDown(e: KeyboardEvent) {
    const length = filteredItems.length + (canCreate ? 1 : 0);

    if (length === 0) return;

    switch (e.key) {
      case "ArrowDown": {
        highlightedIndex = (highlightedIndex + 1) % length;

        e.preventDefault();
        break;
      }
      case "ArrowUp": {
        highlightedIndex = (Math.max(highlightedIndex, 0) - 1 + length) % length;

        e.preventDefault();
        break;
      }
      case "Enter": {
        if (highlightedIndex !== -1) {
          if (highlightedIndex === filteredItems.length) {
            handleCreate();
          } else {
            handleClick(filteredItems[highlightedIndex]);
          }
          e.preventDefault();
        }
        break;
      }
    }

    itemElements[highlightedIndex]?.scrollIntoView({
      block: "nearest",
      behavior: "smooth"
    });
  }

  let canCreate = $derived(createable && searchTerm && filteredItems.every((x) => itemToString(x).trim() !== searchTerm.trim()));
</script>

<Dropdown.Root {...restProps} bind:open>
  <Dropdown.Trigger
    class="input [&:disabled>svg]:text-base-content/40 w-full cursor-pointer justify-between {restProps['class']}"
    role="combobox"
    aria-haspopup="listbox"
    aria-expanded={open}
    aria-controls={listboxId}
    aria-invalid={restProps["aria-invalid"]}
    onkeydown={(e) => {
      if (open) handleKeyDown(e);
    }}
  >
    <span class="truncate {selectedItem || selectedItems.length > 0 ? '' : 'text-current/50'} ">
      {triggerLabel}
    </span>
    <ChevronsUpDown size={16} class="shrink-0 text-[var(--input-color)]" />
  </Dropdown.Trigger>

  <Dropdown.Content class="bg-base-100 border-base-content/20 rounded-box popover-dropdown-auto-size mt-1 w-52 border-(length:--border) shadow-sm">
    {#if searchable}
      <label class="input input-ghost w-full focus-within:outline-0 focus:outline-0">
        <Search size={16} class="shrink-0 text-[var(--input-color)]" />
        <input type="search" bind:this={searchBox} class="grow" placeholder="Search" bind:value={searchTerm} onkeydown={handleKeyDown} />
        {#if canCreate && false}
          <button type="button" class="btn btn-xs">Add new</button>
        {/if}
      </label>
      <hr class="text-base-content/20" />
    {/if}

    <ul
      bind:this={listboxItem}
      class="menu max-h-96 w-full flex-nowrap overflow-y-auto overscroll-contain"
      class:pb-0={canCreate}
      id={listboxId}
      role="listbox"
      aria-multiselectable={type === "multiple"}
      onkeydown={(e) => {
        searchBox?.focus();
        handleKeyDown(e);
      }}
    >
      {#each filteredItems as item, i (itemToId(item))}
        {@const isSelected = selectedIds.has(itemToId(item))}

        <li bind:this={itemElements[i]} role="option" aria-selected={isSelected} class="scroll-my-16">
          <button type="button" class:menu-focus={i === highlightedIndex} onclick={() => handleClick(item)}>
            {#if itemTemplate}
              {@render itemTemplate(item, isSelected)}
            {:else}
              {#if type === "multiple"}
                <input type="checkbox" checked={isSelected} class="checkbox checkbox-sm" />
              {:else}
                <Check size={12} opacity={isSelected ? 1 : 0} class="transition-opacity" />
              {/if}
              <span>
                {itemToString(item)}
              </span>
            {/if}
          </button>
        </li>
      {/each}

      {#if canCreate}
        <div class="bg-base-100 sticky bottom-0 pb-2">
          {#if filteredItems.length !== 0}
            <div class="divider my-1 h-auto opacity-50"></div>
          {/if}
          <li bind:this={itemElements[filteredItems.length]}>
            <button type="button" onclick={handleCreate} class:menu-focus={highlightedIndex === filteredItems.length} class="text-base-content flex items-center">
              <Plus size={12} />
              <span>
                {searchTerm}
              </span>
            </button>
          </li>
        </div>
      {/if}

      {#if filteredItems.length === 0 && !canCreate}
        <li class="menu-disabled">
          <span>No results found.</span>
        </li>
      {/if}
    </ul>
  </Dropdown.Content>
</Dropdown.Root>
