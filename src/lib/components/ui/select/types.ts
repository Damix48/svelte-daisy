import type { Snippet } from "svelte";

export type SelectSelectionMode = "single" | "multiple";
export type SelectBindingType = "item" | "id";

type SelectCommon<TItem> = {
  searchable?: boolean;
  createable?: boolean;
  keepSearchTermOnClose?: boolean;
  allowDeselect?: boolean;
  items?: TItem[];
  placeholder?: string;
  itemToString?: (item: TItem) => string;
  itemToId?: (item: TItem) => string | number;
  itemTemplate?: Snippet<[TItem, boolean]> | undefined;
  onCreate?: (value: string) => void;
};

export type SelectProps<TItem> =
  | (SelectCommon<TItem> & {
      type?: "single";
      bindingType?: "item";
      selected?: TItem;
    })
  | (SelectCommon<TItem> & {
      type?: "single";
      bindingType: "id";
      selected?: string | number;
    })
  | (SelectCommon<TItem> & {
      type: "multiple";
      bindingType?: "item";
      selected?: TItem[];
    })
  | (SelectCommon<TItem> & {
      type: "multiple";
      bindingType: "id";
      selected?: (string | number)[];
    });
