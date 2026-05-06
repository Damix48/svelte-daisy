import { Context } from "runed";

type ModalContext = {
  open: boolean;
};

export const context = new Context<ModalContext>("modal-context");

export const useModal = () => {
  return context.get();
};

export const useOptionalModal = () => {
  return context.getOr(undefined);
};
