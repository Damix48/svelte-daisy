import type { Snippet } from "svelte";

export type SelectProps<TItem> = {
  type?: "single" | "multiple";
  searchable?: boolean;
  createable?: boolean;
  items?: TItem[];
  placeholder?: string;
  itemToString?: (item: TItem) => string;
  itemToId?: (item: TItem) => string | number;
  itemTemplate?: Snippet<[TItem, boolean]> | undefined;
  selectedItem?: TItem | undefined;
  selectedItems?: TItem[];
  onCreate?: (value: string) => void;
};
