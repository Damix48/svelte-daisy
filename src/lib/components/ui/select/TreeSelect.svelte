<script lang="ts" generics="TItem extends { children?: TItem[] }">
import { Check, ChevronRight, ChevronsUpDown, Plus, Search } from "@lucide/svelte";
import { Dropdown } from "../dropdown";
import type { TreeSelectProps } from "./types";
import type { HTMLInputAttributes } from "svelte/elements";

type SelectionState = "none" | "some" | "all";
type DisplayItem = {
  item: TItem;
  level: number;
  hasChildren: boolean;
};

const getChildren = (item: TItem) => item.children ?? [];

let {
  type = "single",
  bindingType = "item",
  selected = $bindable(),
  searchable = true,
  createable = false,
  keepSearchTermOnClose = false,
  allowDeselect = false,
  cascadeSelection = false,
  selectionMode = "any",
  items = [],
  placeholder = "Select an option",
  itemToString = (item: TItem) => (item == null ? "" : String(item)),
  itemToId = (item: TItem) => (item == null ? "" : String(item)),
  itemTemplate,
  onCreate,
  ...restProps
}: TreeSelectProps<TItem> & Omit<HTMLInputAttributes, "id" | "value" | "type"> = $props();

let searchTerm = $state("");
let open = $state(false);
let expandedIds = $state(new Set<string | number>());

let searchBox: HTMLInputElement | undefined = $state(undefined);
let highlightedIndex = $state(-1);
let itemElements: HTMLLIElement[] = $state([]);

const id = $props.id();
const listboxId = `listbox-${id}`;

const itemsMap = $derived.by(() => {
  const map = new Map<string | number, TItem>();

  function visit(nodes: TItem[]) {
    for (const item of nodes) {
      map.set(itemToId(item), item);
      const children = getChildren(item);
      if (children.length > 0) visit(children);
    }
  }

  visit(items);
  return map;
});

const allItems = $derived.by(() => {
  const result: TItem[] = [];

  function visit(nodes: TItem[]) {
    for (const item of nodes) {
      result.push(item);
      const children = getChildren(item);
      if (children.length > 0) visit(children);
    }
  }

  visit(items);
  return result;
});

const selectedItems = $derived.by((): TItem[] => {
  if (selected === undefined || selected === null) return [];

  if (type === "multiple") {
    if (!Array.isArray(selected)) return [];

    if (bindingType === "item") return selected as TItem[];

    return (selected as (string | number)[]).map((id) => itemsMap.get(id)).filter((item): item is TItem => item !== undefined);
  }

  if (bindingType === "item") return [selected as TItem];

  const item = itemsMap.get(selected as string | number);
  return item ? [item] : [];
});

const selectedIds = $derived(new Set(selectedItems.map(itemToId)));

const normalizedSearchTerm = $derived(searchTerm.trim().toLowerCase());
const searchableEnabled = $derived(searchable === true || searchable === "true");
const createableEnabled = $derived(createable === true || createable === "true");
const allowDeselectEnabled = $derived(allowDeselect === true || allowDeselect === "true");
const cascadeSelectionEnabled = $derived(cascadeSelection === true || cascadeSelection === "true");
const leafOnly = $derived(selectionMode === "leaf");

function flattenTree(nodes: TItem[], level = 0, expanded = expandedIds): DisplayItem[] {
  const result: DisplayItem[] = [];

  for (const item of nodes) {
    const hasChildren = getChildren(item).length > 0;
    const itemId = itemToId(item);

    result.push({ item, level, hasChildren });

    if (hasChildren && expanded.has(itemId)) {
      result.push(...flattenTree(getChildren(item), level + 1, expanded));
    }
  }

  return result;
}

function flattenTreeForSearch(nodes: TItem[], search: string, level = 0): { visible: DisplayItem[]; autoExpanded: Set<string | number> } {
  const visible: DisplayItem[] = [];
  const autoExpanded = new Set<string | number>();

  for (const item of nodes) {
    const children = getChildren(item);
    const hasChildren = children.length > 0;
    const matches = itemToString(item).trim().toLowerCase().includes(search);
    const childResult = hasChildren ? flattenTreeForSearch(children, search, level + 1) : { visible: [], autoExpanded: new Set<string | number>() };

    if (matches || childResult.visible.length > 0) {
      visible.push({ item, level, hasChildren });

      if (childResult.visible.length > 0) {
        autoExpanded.add(itemToId(item));
        for (const id of childResult.autoExpanded) autoExpanded.add(id);
        visible.push(...childResult.visible);
      }
    }
  }

  return { visible, autoExpanded };
}

const treeView = $derived.by(() => {
  if (!searchableEnabled || !normalizedSearchTerm) {
    return { visible: flattenTree(items), autoExpanded: new Set<string | number>() };
  }

  return flattenTreeForSearch(items, normalizedSearchTerm);
});

const visibleItems = $derived(treeView.visible);
const effectiveExpandedIds = $derived.by(() => {
  if (!searchableEnabled || !normalizedSearchTerm) return expandedIds;
  return new Set([...expandedIds, ...treeView.autoExpanded]);
});

const selectionStates = $derived.by(() => {
  const states = new Map<string | number, SelectionState>();
  if (type !== "multiple" || !cascadeSelectionEnabled || leafOnly) return states;

  function resolveState(item: TItem): SelectionState {
    const id = itemToId(item);
    const children = getChildren(item);
    const isSelected = selectedIds.has(id);

    if (children.length === 0) {
      const state: SelectionState = isSelected ? "all" : "none";
      states.set(id, state);
      return state;
    }

    const childStates = children.map(resolveState);
    const allChildrenSelected = childStates.every((state) => state === "all");
    const noChildrenSelected = childStates.every((state) => state === "none");

    const state: SelectionState = isSelected && allChildrenSelected ? "all" : !isSelected && noChildrenSelected ? "none" : "some";
    states.set(id, state);
    return state;
  }

  for (const item of items) resolveState(item);
  return states;
});

const triggerLabel = $derived.by(() => {
  if (selectedItems.length === 0) return placeholder;
  if (selectedItems.length === 1) return itemToString(selectedItems[0]);
  return `(${selectedItems.length} items) ${selectedItems.map(itemToString).join(", ")}`;
});

const canCreate = $derived.by(() => {
  if (!createableEnabled || !searchTerm) return false;
  return allItems.every((item) => itemToString(item).trim() !== searchTerm.trim());
});

function getSubtreeIds(item: TItem): (string | number)[] {
  const ids: (string | number)[] = [itemToId(item)];
  for (const child of getChildren(item)) ids.push(...getSubtreeIds(child));
  return ids;
}

function getSubtreeItems(item: TItem): TItem[] {
  const result: TItem[] = [item];
  for (const child of getChildren(item)) result.push(...getSubtreeItems(child));
  return result;
}

function toggleExpand(e: MouseEvent | KeyboardEvent, id: string | number) {
  e.stopPropagation();

  if (expandedIds.has(id)) expandedIds.delete(id);
  else expandedIds.add(id);

  expandedIds = new Set(expandedIds);
}

function commitSelection(item: TItem) {
  const itemId = itemToId(item);
  const itemValue = bindingType === "item" ? item : itemId;

  if (type === "single") {
    const isAlreadySelected = selectedIds.has(itemId);

    if (isAlreadySelected && allowDeselectEnabled) selected = undefined;
    else selected = itemValue;

    open = false;
    if (!keepSearchTermOnClose) searchTerm = "";
    return;
  }

  const currentSelected = Array.isArray(selected) ? selected : [];
  const shouldCascade = cascadeSelectionEnabled && !leafOnly && getChildren(item).length > 0;
  const idsToToggle = shouldCascade ? getSubtreeIds(item) : [itemId];

  if (bindingType === "item") {
    const currentIds = new Set(currentSelected.map((x) => itemToId(x as TItem)));
    const hasAll = idsToToggle.every((id) => currentIds.has(id));

    if (hasAll) {
      const removeIds = new Set(idsToToggle);
      selected = (currentSelected as TItem[]).filter((x) => !removeIds.has(itemToId(x)));
    } else {
      const itemsToAdd = shouldCascade ? getSubtreeItems(item) : [item];
      const existingIds = new Set(currentSelected.map((x) => itemToId(x as TItem)));
      selected = [...(currentSelected as TItem[]), ...itemsToAdd.filter((x) => !existingIds.has(itemToId(x)))];
    }
    return;
  }

  const currentIds = Array.isArray(selected) ? (selected as (string | number)[]) : [];
  const currentIdSet = new Set(currentIds);
  const hasAll = idsToToggle.every((id) => currentIdSet.has(id));

  if (hasAll) {
    const removeIds = new Set(idsToToggle);
    selected = currentIds.filter((id) => !removeIds.has(id));
  } else {
    selected = [...currentIds, ...idsToToggle.filter((id) => !currentIdSet.has(id))];
  }
}

function handleClick(node: DisplayItem) {
  const id = itemToId(node.item);

  if (leafOnly && node.hasChildren) {
    if (expandedIds.has(id)) expandedIds.delete(id);
    else expandedIds.add(id);
    expandedIds = new Set(expandedIds);
    return;
  }

  commitSelection(node.item);

  if (type === "single") return;

  highlightedIndex = visibleItems.findIndex((item) => itemToId(item.item) === id);
}

function handleCreate() {
  if (!canCreate) return;
  onCreate?.(searchTerm);
  open = false;
}

function handleKeyDown(e: KeyboardEvent) {
  const totalItems = visibleItems.length + (canCreate ? 1 : 0);
  if (totalItems === 0) return;

  switch (e.key) {
    case "ArrowDown": {
      highlightedIndex = (highlightedIndex + 1) % totalItems;
      e.preventDefault();
      break;
    }
    case "ArrowUp": {
      highlightedIndex = (Math.max(highlightedIndex, 0) - 1 + totalItems) % totalItems;
      e.preventDefault();
      break;
    }
    case "ArrowRight": {
      const currentNode = visibleItems[highlightedIndex];
      if (currentNode && currentNode.hasChildren && !effectiveExpandedIds.has(itemToId(currentNode.item))) {
        expandedIds.add(itemToId(currentNode.item));
        expandedIds = new Set(expandedIds);
      }
      e.preventDefault();
      break;
    }
    case "ArrowLeft": {
      const currentNode = visibleItems[highlightedIndex];
      if (currentNode && currentNode.hasChildren && effectiveExpandedIds.has(itemToId(currentNode.item))) {
        expandedIds.delete(itemToId(currentNode.item));
        expandedIds = new Set(expandedIds);
      }
      e.preventDefault();
      break;
    }
    case "Enter": {
      if (highlightedIndex !== -1) {
        if (highlightedIndex === visibleItems.length) handleCreate();
        else handleClick(visibleItems[highlightedIndex]);
        e.preventDefault();
      }
      break;
    }
  }

  itemElements[highlightedIndex]?.scrollIntoView({ block: "nearest", behavior: "smooth" });
}

$effect(() => {
  if (open) {
    searchBox?.focus();
    highlightedIndex = -1;
    if (!keepSearchTermOnClose) searchTerm = "";
  }
});

$effect(() => {
  const totalItems = visibleItems.length + (canCreate ? 1 : 0);
  if (highlightedIndex >= totalItems) highlightedIndex = totalItems - 1;
});
</script>

<Dropdown.Root {...restProps} bind:open>
  <Dropdown.Trigger
    class="input [&:disabled>svg]:text-base-content/40 cursor-pointer justify-between {restProps['class']}"
    role="combobox"
    aria-haspopup="listbox"
    aria-expanded={open}
    aria-controls={listboxId}
    aria-invalid={restProps["aria-invalid"]}
    onkeydown={(e) => {
      if (open) handleKeyDown(e);
    }}
  >
    <div class="flex items-center w-full"><span class="truncate {selectedItems.length > 0 ? '' : 'text-current/50'}">{triggerLabel}</span></div>
    <ChevronsUpDown size={16} class="shrink-0 text-(--input-color)" />
  </Dropdown.Trigger>

  <Dropdown.Content class="bg-base-100 border-base-content/20 rounded-field popover-dropdown-auto-size mt-1 w-52 border-(length:--border) shadow-sm">
    {#if searchableEnabled}
      <label class="input input-ghost w-full focus-within:outline-0 focus:outline-0">
        <Search size={16} class="shrink-0 text-(--input-color)" />
        <input type="search" bind:this={searchBox} class="grow" placeholder="Search" bind:value={searchTerm} onkeydown={handleKeyDown}>
        {#if canCreate}
          <button type="button" class="btn btn-xs" onclick={handleCreate}>Add new</button>
        {/if}
      </label>
      <hr class="text-base-content/20">
    {/if}

    <ul
      id={listboxId}
      role="listbox"
      aria-multiselectable={type === "multiple"}
      class="menu max-h-96 w-full flex-nowrap overflow-y-auto overscroll-contain"
      class:pb-0={canCreate}
      onkeydown={(e) => {
        searchBox?.focus();
        handleKeyDown(e);
      }}
    >
      {#each visibleItems as node, i (itemToId(node.item))}
        {@const id = itemToId(node.item)}
        {@const state = type === "multiple" && cascadeSelectionEnabled && !leafOnly ? selectionStates.get(id) ?? "none" : selectedIds.has(id) ? "all" : "none"}
        {@const isExpanded = effectiveExpandedIds.has(id)}

        <li bind:this={itemElements[i]} role="option" aria-selected={state === "all"} class="scroll-my-16">
          <div class="flex w-full items-center gap-2" style="padding-left: {node.level * 1.5 + 0.375}rem;">
            {#if node.hasChildren}
              <span
                role="button"
                tabindex="0"
                class="btn btn-square btn-ghost btn-xs touch-hitbox"
                aria-label={isExpanded ? "Collapse" : "Expand"}
                onclick={(e) => toggleExpand(e, id)}
                onkeydown={(e) => {
                  if (e.key === "Enter" || e.key === " ") toggleExpand(e, id);
                }}
              >
                <ChevronRight size={12} class="transition-transform duration-200 {isExpanded ? 'rotate-90' : ''}" />
              </span>
            {:else if selectionMode === "any"}
              <span class="btn btn-square btn-ghost btn-xs invisible"></span>
            {/if}

            <button type="button" class:menu-focus={i === highlightedIndex} class="flex min-w-0 flex-1 items-center gap-2 text-left" onclick={() => handleClick(node)}>
              {#if itemTemplate}
                {@render itemTemplate(node.item, state === "all")}
              {:else}
                {#if type === "multiple"}
                  {#if !leafOnly || !node.hasChildren}
                    <input type="checkbox" checked={state === "all"} indeterminate={state === "some"} class="checkbox checkbox-sm ms-0.5">
                  {/if}
                {:else}
                  <Check size={12} opacity={selectedIds.has(id) ? 1 : 0} class="transition-opacity" />
                {/if}
                <span class="truncate">{itemToString(node.item)}</span>
              {/if}
            </button>
          </div>
        </li>
      {/each}

      {#if canCreate}
        <div class="bg-base-100 sticky bottom-0 pb-2">
          {#if visibleItems.length !== 0}
            <div class="divider my-1 h-auto opacity-50"></div>
          {/if}
          <li bind:this={itemElements[visibleItems.length]}>
            <button type="button" onclick={handleCreate} class:menu-focus={highlightedIndex === visibleItems.length} class="text-base-content flex items-center">
              <Plus size={12} />
              <span>{searchTerm}</span>
            </button>
          </li>
        </div>
      {/if}

      {#if visibleItems.length === 0 && !canCreate}
        <li class="menu-disabled"><span>No results found.</span></li>
      {/if}
    </ul>
  </Dropdown.Content>
</Dropdown.Root>
