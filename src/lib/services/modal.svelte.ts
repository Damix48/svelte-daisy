import { useId } from "$lib/utils/useId";
import type { Component, ComponentProps } from "svelte";
import { SvelteMap } from "svelte/reactivity";

type ModalInstance<T extends Component<any, any, any>> = {
  id: string;
  component: T;
  props: ComponentProps<T>;
  destroyDelay: number;
  resolve: (arg: any) => void;
  resolveHandled: boolean;
};

type ExtractOnCloseResult<T> = T extends { onClose?: (result: infer R) => any } ? R : undefined;

const instances = new SvelteMap<string, ModalInstance<Component<any, any, any>>>();

const open = <T extends Component<ComponentProps<T>, any, any>>(
  component: T,
  props: Omit<ComponentProps<T>, "onClose">,
  { destroyDelay }: { destroyDelay: number } = { destroyDelay: 250 }
) => {
  const id = useId();

  type TResult = ExtractOnCloseResult<ComponentProps<T>>;

  return new Promise<TResult>((resolve, reject) => {
    const onClose = (result: TResult) => {
      const modal = instances.get(id);
      if (modal) modal.resolveHandled = true;

      resolve(result);
    };
    const modal: ModalInstance<T> = { id, component, props: { ...props, onClose } as ComponentProps<T>, destroyDelay, resolve, resolveHandled: false };

    instances.set(id, modal);
  });
};

const close = (id: string) => {
  const modal = instances.get(id);
  if (!modal) return;

  setTimeout(() => {
    if (!modal.resolveHandled) {
      modal.resolve(undefined);
      modal.resolveHandled = true;
    }
    instances.delete(id);
  }, modal.destroyDelay);
};

import ConfirmModal from "../ConfirmModal.svelte";

const confirm = (title: string, text?: string, { cancelText, confirmText }: { cancelText?: string; confirmText?: string } = {}) => {
  return open(
    ConfirmModal,
    {
      title,
      text,
      cancelText,
      confirmText
    },
    { destroyDelay: 250 }
  );
};

export const modalService = {
  get instances() {
    return instances.values();
  },
  open,
  close,
  confirm
};
