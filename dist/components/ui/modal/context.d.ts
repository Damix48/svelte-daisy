import { Context } from "runed";
type ModalContext = {
    open: boolean;
};
export declare const context: Context<ModalContext>;
export declare const useModal: () => ModalContext;
export declare const useOptionalModal: () => ModalContext | undefined;
export {};
