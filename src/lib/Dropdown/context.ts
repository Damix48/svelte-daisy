import { Context } from "runed";

type DropdownContext = {
  id: string;
  open: boolean;
};

export const context = new Context<DropdownContext>("dropdown-context");
