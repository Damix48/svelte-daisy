import { Context } from "runed";
type ModalContext = {
    open: boolean;
};
export declare const context: Context<ModalContext>;
export declare const useModal: () => ModalContext;
export {};
