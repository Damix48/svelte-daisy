<script lang="ts" generics="TItem extends { children?: TItem[] }">
  import { Dropdown } from "../Dropdown";
  import { Check, ChevronRight, ChevronsUpDown, Plus, Search } from "@lucide/svelte";
  import { SvelteMap, SvelteSet } from "svelte/reactivity";
  import type { TreeSelectProps } from "./types";
  import { onMount } from "svelte";

  type SelectionState = "none" | "some" | "all";
  type DisplayItem = {
    item: TItem;
    level: number;
    hasChildren: boolean;
  };

  let {
    type = "single",
    searchable = true,
    createable = false,
    cascadeSelection = false,
    items = [],
    placeholder = "Select an option",
    itemToString,
    itemToId,
    itemTemplate,
    selectedItem = $bindable(),
    selectedItems = $bindable([]),
    selectedIds = $bindable([]),
    onCreate,
    ...restProps
  }: TreeSelectProps<TItem> = $props();

  onMount(() => {
    if (selectedIds.length > 0) {
      selectedItems = flattenTree(items, 0, true)
        .filter((x) => selectedIds.includes(itemToId(x.item)))
        .map((x) => x.item);
    }
  });

  let searchTerm = $state("");
  let open = $state(false);
  let expandedIds = new SvelteSet<string | number>();

  let searchBox: HTMLInputElement | undefined = $state(undefined);
  let highlightedIndex = $state(-1);
  let itemElements: HTMLLIElement[] = $state([]);

  const id = $props.id();
  const listboxId = `listbox-${id}`;

  $effect(() => {
    if (open) {
      searchBox?.focus();
      highlightedIndex = -1;
    }
  });

  const internalSelectedIds = $derived.by(() => {
    if (type === "single") {
      return new Set(selectedItem ? [itemToId(selectedItem)] : []);
    }
    return new Set(selectedItems.map(itemToId));
  });

  const selectionStates = $derived.by(() => {
    const states = new SvelteMap<string | number, SelectionState>();
    if (type !== "multiple" || !cascadeSelection) return states;

    const selectedIdSet = internalSelectedIds;

    function traverse(nodes: TItem[]): void {
      for (const item of nodes) {
        const id = itemToId(item);

        if (!item.children || item.children.length === 0) {
          // Leaf node: simple selected/not selected
          states.set(id, selectedIdSet.has(id) ? "all" : "none");
        } else {
          // Parent node: check both itself and children
          traverse(item.children);

          const isParentSelected = selectedIdSet.has(id);
          const childIds = item.children.map(itemToId);
          const childStates = childIds.map((childId) => states.get(childId)!);

          const allChildrenSelected = childStates.every((s) => s === "all");
          const noChildrenSelected = childStates.every((s) => s === "none");

          if (isParentSelected && allChildrenSelected) {
            // Parent and all children are selected
            states.set(id, "all");
          } else if (!isParentSelected && noChildrenSelected) {
            // Neither parent nor any children are selected
            states.set(id, "none");
          } else {
            // Partial selection (parent selected but not all children, or some children selected)
            states.set(id, "some");
          }
        }
      }
    }

    traverse(items);
    return states;
  });

  const triggerLabel = $derived.by(() => {
    if (type === "single") {
      return selectedItem ? itemToString(selectedItem) : placeholder;
    }
    if (selectedItems.length === 0) return placeholder;
    if (selectedItems.length === 1) return itemToString(selectedItems[0]);
    return `${selectedItems.length} items selected`;
  });

  // --- Core Tree Logic ---

  /** Recursively flattens the tree for display, respecting expanded state */
  function flattenTree(nodes: TItem[], level = 0, ignoreExpanded = false): DisplayItem[] {
    const result: DisplayItem[] = [];
    for (const item of nodes) {
      const hasChildren = !!(item.children && item.children.length > 0);
      result.push({ item, level, hasChildren });
      if (hasChildren && (expandedIds.has(itemToId(item)) || ignoreExpanded)) {
        result.push(...flattenTree(item.children!, level + 1));
      }
    }
    return result;
  }

  /** Recursively filters the tree, auto-expanding parents of matched items */
  function filterAndFlattenTree(nodes: TItem[], search: string, level = 0): { visible: DisplayItem[]; matched: boolean } {
    const result: DisplayItem[] = [];
    let anyChildMatched = false;

    for (const item of nodes) {
      const hasChildren = !!(item.children && item.children.length > 0);
      let itemMatches = itemToString(item).toLowerCase().includes(search);
      let childrenResult = { visible: [] as DisplayItem[], matched: false };

      if (hasChildren) {
        childrenResult = filterAndFlattenTree(item.children!, search, level + 1);
      }

      if (itemMatches || childrenResult.matched) {
        anyChildMatched = true;
        // Auto-expand nodes that contain a search result
        if (hasChildren && childrenResult.matched) {
          expandedIds.add(itemToId(item));
        }
        result.push({ item, level, hasChildren });
        result.push(...childrenResult.visible);
      }
    }
    return { visible: result, matched: anyChildMatched };
  }

  const displayItems = $derived.by(() => {
    const search = searchTerm.trim().toLowerCase();
    if (!searchable || !search) {
      return flattenTree(items);
    }
    // When searching, we need to rebuild the expanded set
    const initialExpanded = new SvelteSet(expandedIds);
    expandedIds = new SvelteSet(); // Reset for auto-expansion
    const { visible } = filterAndFlattenTree(items, search);

    // If no results, revert to the user's expanded state
    if (visible.length === 0) {
      expandedIds = initialExpanded;
    }

    return visible;
  });

  // --- Event Handlers ---

  function getAllDescendantIds(item: TItem): (string | number)[] {
    const ids: (string | number)[] = [];
    if (!item.children) return ids;
    for (const child of item.children) {
      ids.push(itemToId(child));
      ids.push(...getAllDescendantIds(child));
    }
    return ids;
  }

  function handleClick(node: DisplayItem) {
    const item = node.item;
    const id = itemToId(item);

    if (type === "single") {
      selectedItem = item;
      open = false;
    } else {
      // Multiple selection mode
      if (!cascadeSelection) {
        // Non-cascade mode: simple toggle
        const isSelected = internalSelectedIds.has(id);
        if (isSelected) {
          selectedItems = selectedItems.filter((i) => itemToId(i) !== id);
        } else {
          selectedItems = [...selectedItems, item];
        }
      } else {
        // Cascade mode: handle parent and children together
        const currentState = selectionStates.get(id) || "none";

        // Get all items that need to be toggled (self + descendants)
        const descendantIds = node.hasChildren ? getAllDescendantIds(item) : [];
        const allIds = [id, ...descendantIds];

        if (currentState === "all") {
          // Currently all selected -> deselect all
          const idsToRemove = new Set(allIds);
          selectedItems = selectedItems.filter((i) => !idsToRemove.has(itemToId(i)));
        } else {
          // Currently "none" or "some" -> select all
          const currentIds = new Set(selectedItems.map(itemToId));
          const itemsToAdd: TItem[] = [];

          // Add the parent itself if not already selected
          if (!currentIds.has(id)) {
            itemsToAdd.push(item);
          }

          // Find and add all descendant items that aren't already selected
          function findItems(nodes: TItem[], idsToFind: Set<string | number>) {
            for (const n of nodes) {
              const nId = itemToId(n);
              if (nId !== id && idsToFind.has(nId) && !currentIds.has(nId)) {
                itemsToAdd.push(n);
              }
              if (n.children) {
                findItems(n.children, idsToFind);
              }
            }
          }

          if (descendantIds.length > 0) {
            findItems(items, new Set(descendantIds));
          }

          selectedItems = [...selectedItems, ...itemsToAdd];
        }
      }
    }

    highlightedIndex = displayItems.findIndex((d) => itemToId(d.item) === id);
  }

  function toggleExpand(e: MouseEvent | KeyboardEvent, id: string | number) {
    e.stopPropagation(); // Prevent item from being selected

    if (expandedIds.has(id)) {
      expandedIds.delete(id);
    } else {
      expandedIds.add(id);
    }
    // This is a bit of a trick to force the derived value to re-evaluate
    expandedIds = new SvelteSet(expandedIds);
  }

  function handleKeyDown(e: KeyboardEvent) {
    const totalItems = displayItems.length + (canCreate ? 1 : 0);
    if (totalItems === 0) return;

    switch (e.key) {
      case "ArrowDown":
        highlightedIndex = (highlightedIndex + 1) % totalItems;
        e.preventDefault();
        break;
      case "ArrowUp":
        highlightedIndex = (highlightedIndex - 1 + totalItems) % totalItems;
        e.preventDefault();
        break;
      case "ArrowRight": {
        const currentNode = displayItems[highlightedIndex];
        if (currentNode && currentNode.hasChildren && !expandedIds.has(itemToId(currentNode.item))) {
          expandedIds.add(itemToId(currentNode.item));
          expandedIds = new SvelteSet(expandedIds); // force update
        }
        e.preventDefault();
        break;
      }
      case "ArrowLeft": {
        const currentNode = displayItems[highlightedIndex];
        if (currentNode && currentNode.hasChildren && expandedIds.has(itemToId(currentNode.item))) {
          expandedIds.delete(itemToId(currentNode.item));
          expandedIds = new SvelteSet(expandedIds); // force update
        }
        e.preventDefault();
        break;
      }
      case "Enter":
        if (highlightedIndex !== -1) {
          if (highlightedIndex < displayItems.length) {
            handleClick(displayItems[highlightedIndex]);
          } else {
            console.log("create"); // Handle create logic
          }
          e.preventDefault();
        }
        break;
    }

    itemElements[highlightedIndex]?.scrollIntoView({ block: "nearest" });
  }

  function handleCreate() {
    if (!canCreate) return;
    onCreate?.(searchTerm);
    open = false;
  }

  let canCreate = $derived(createable && searchTerm && displayItems.every((x) => itemToString(x.item).trim() !== searchTerm.trim()));

  $effect(() => {
    selectedIds = [...internalSelectedIds];
  });
</script>

<Dropdown.Root {...restProps} bind:open>
  <Dropdown.Trigger
    class="input [&:disabled>svg]:text-base-content/40 anchor-[--popover] w-full cursor-pointer justify-between"
    role="combobox"
    aria-haspopup="listbox"
    aria-expanded={open}
    aria-controls={listboxId}
    onkeydown={handleKeyDown}
  >
    <span class="truncate {selectedItem || selectedItems.length > 0 ? '' : 'text-current/50'}">
      {triggerLabel}
    </span>
    <ChevronsUpDown size={16} class="shrink-0 text-[var(--input-color)]" />
  </Dropdown.Trigger>

  <Dropdown.Content class="bg-base-100 border-base-content/20 rounded-box popover-dropdown-auto-size mt-1 w-full border shadow-sm">
    {#if searchable}
      <label class="input input-ghost w-full focus-within:outline-0 focus:outline-0">
        <Search size={16} class="shrink-0 text-[var(--input-color)]" />
        <input type="search" bind:this={searchBox} class="grow" placeholder="Search" bind:value={searchTerm} onkeydown={handleKeyDown} />
      </label>
      <hr class="text-base-content/20" />
    {/if}

    <ul
      class="menu max-h-96 w-full flex-nowrap overflow-y-auto overscroll-contain p-2"
      class:pb-0={canCreate}
      id={listboxId}
      role="listbox"
      aria-multiselectable={type === "multiple"}
    >
      {#each displayItems as node, i (itemToId(node.item))}
        {@const isSelected = internalSelectedIds.has(itemToId(node.item))}
        {@const isExpanded = expandedIds.has(itemToId(node.item))}
        {@const state = (cascadeSelection && selectionStates.get(itemToId(node.item))) || (isSelected ? "all" : "none")}

        <li bind:this={itemElements[i]} role="option" aria-selected={isSelected}>
          <button
            type="button"
            class="flex w-full items-center gap-2"
            class:menu-focus={i === highlightedIndex}
            onclick={() => handleClick(node)}
            style="padding-left: {node.level * 1.5 + 0.375}rem;"
          >
            {#if node.hasChildren}
              <span
                role="button"
                tabindex="0"
                class="btn btn-square btn-ghost btn-xs touch-hitbox"
                aria-label={isExpanded ? "Collapse" : "Expand"}
                onclick={(e) => toggleExpand(e, itemToId(node.item))}
                onkeypress={(e) => toggleExpand(e, itemToId(node.item))}
              >
                <ChevronRight size={12} class="transition-transform duration-200 {isExpanded ? 'rotate-90' : ''}" />
              </span>
            {:else}
              <span class="btn btn-square btn-ghost btn-xs invisible"></span>
            {/if}

            {#if itemTemplate}
              {@render itemTemplate(node.item, isSelected)}
            {:else}
              {#if type === "multiple"}
                <input type="checkbox" checked={state === "all"} indeterminate={state === "some"} class="checkbox checkbox-sm" />
              {:else}
                <Check size={12} opacity={isSelected ? 1 : 0} class="transition-opacity" />
              {/if}
              <span>{itemToString(node.item)}</span>
            {/if}
          </button>
        </li>
      {/each}

      {#if canCreate}
        <!-- Createable logic might need adjustment based on desired behavior -->
        <li bind:this={itemElements[displayItems.length]}>
          <button type="button" class:menu-focus={highlightedIndex === displayItems.length} class="text-base-content flex items-center">
            <Plus size={12} />
            <span>Create "{searchTerm}"</span>
          </button>
        </li>
      {/if}

      {#if canCreate}
        <div class="bg-base-100 sticky bottom-0 pb-2">
          {#if displayItems.length !== 0}
            <div class="divider my-1 h-auto opacity-50"></div>
          {/if}
          <li bind:this={itemElements[displayItems.length]}>
            <button type="button" onclick={handleCreate} class:menu-focus={highlightedIndex === displayItems.length} class="text-base-content flex items-center">
              <Plus size={12} />
              <span>
                {searchTerm}
              </span>
            </button>
          </li>
        </div>
      {/if}

      {#if displayItems.length === 0 && !canCreate}
        <li class="menu-disabled">
          <span>No results found.</span>
        </li>
      {/if}
    </ul>
  </Dropdown.Content>
</Dropdown.Root>
