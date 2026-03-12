import { Context } from "runed";
import type { SuperForm } from "sveltekit-superforms";
export type FormContextType<T extends Record<string, unknown> = any> = SuperForm<T, any>;
export declare const formContext: Context<FormContextType<any>>;
type FieldContext = {
    name: string;
    id: string;
};
export declare const fieldContext: Context<FieldContext>;
export {};
