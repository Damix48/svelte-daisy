import { Context } from "runed";
type DropdownContext = {
    id: string;
    open: boolean;
};
export declare const context: Context<DropdownContext>;
export declare const useDropdown: () => DropdownContext;
export {};
