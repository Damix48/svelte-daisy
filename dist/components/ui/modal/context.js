import { Context } from "runed";
export const context = new Context("modal-context");
export const useModal = () => {
    return context.get();
};
