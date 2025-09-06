import { Context } from "runed";

type ModalContext = {
  open: boolean;
};

export const context = new Context<ModalContext>("modal-context");
