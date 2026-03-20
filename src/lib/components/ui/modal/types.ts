import type { Snippet } from "svelte";

export type ModalPosition = "top" | "middle" | "bottom" | "start" | "end";
export type ModalOutsideBehavior = "close" | "ignore" | "interact" | "close-interact";
export type ModalContentProps = {
  outsideBehavior?: ModalOutsideBehavior;
  showCloseButton?: boolean;
  children?: Snippet | undefined;
  position?: ModalPosition | undefined;
  class?: string | undefined;
};
