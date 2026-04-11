import type { Snippet } from "svelte";

export type ConfirmResult = "cancel" | "secondary" | "confirm";

export type ConfirmModalProps = {
  title: string;
  text?: string | Snippet;
  onClose: (result: ConfirmResult) => void;
  cancelText?: string;
  secondaryText?: string;
  confirmText?: string;
  cancelClass?: string;
  secondaryClass?: string;
  confirmClass?: string;
};
