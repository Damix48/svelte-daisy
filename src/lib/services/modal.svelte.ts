import { useId } from "$lib/utils/useId";
import type { Component, ComponentProps } from "svelte";
import { SvelteMap } from "svelte/reactivity";
import { ConfirmModal } from "$lib/components/functional/confirm-modal";
import type { ModalContentProps, ModalPosition } from "$lib/components/ui/modal";

type ModalInstance<T extends Component<any, any, any>> = {
  id: string;
  className?: string;
  component: T;
  props: ComponentProps<T>;
  destroyDelay: number;
  resolve: (arg: any) => void;
  resolveHandled: boolean;
} & Pick<ModalContentProps, "position" | "outsideBehavior">;

type OpenModalOptions<T> = {
  className?: string;
  destroyDelay?: number;
} & Pick<ModalInstance<T>, "position" | "outsideBehavior">;

type ExtractOnCloseResult<T> = T extends { onClose?: (result: infer R) => any } ? R : undefined;

const instances = new SvelteMap<string, ModalInstance<Component<any, any, any>>>();

const open = <T extends Component<ComponentProps<T>, any, any>>(component: T, props: Omit<ComponentProps<T>, "onClose">, options: OpenModalOptions<T> = { destroyDelay: 250 }) => {
  const id = useId();

  type TResult = ExtractOnCloseResult<ComponentProps<T>>;

  return new Promise<TResult>((resolve, reject) => {
    const onClose = (result: TResult) => {
      const modal = instances.get(id);
      if (modal) modal.resolveHandled = true;

      resolve(result);
    };

    const modal: ModalInstance<T> = {
      id,
      className: options.className,
      position: options.position,
      outsideBehavior: options.outsideBehavior,
      component,
      props: { ...props, onClose } as ComponentProps<T>,
      destroyDelay: options.destroyDelay ?? 250,
      resolve,
      resolveHandled: false
    };

    instances.set(id, modal);
  });
};

const close = (id: string) => {
  const modal = instances.get(id);
  if (!modal) return;

  if (!modal.resolveHandled) {
    modal.resolve(undefined);
    modal.resolveHandled = true;
  }

  setTimeout(() => {
    instances.delete(id);
  }, modal.destroyDelay);
};

const confirm = (title: string, text?: string, { cancelText, confirmText }: { cancelText?: string; confirmText?: string } = {}) => {
  return open(ConfirmModal, {
    title,
    text,
    cancelText,
    confirmText
  });
};

export const modalService = {
  get instances() {
    return instances.values();
  },
  open,
  close,
  confirm
};
