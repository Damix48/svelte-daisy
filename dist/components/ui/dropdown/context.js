import { Context } from "runed";
export const context = new Context("dropdown-context");
export const useDropdown = () => {
    return context.get();
};
