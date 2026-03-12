import { type SuperValidated } from "sveltekit-superforms";
import { type ErrorMessage, type ObjectEntries, type ObjectIssue, type ObjectSchema } from "valibot";
import { type ZodObject, type ZodRawShape } from "zod";
type HttpValidationProblemDetails = {
    type?: string;
    title?: string;
    /** Format: int32 */
    status?: number;
    detail?: string;
    instance?: string;
    errors?: {
        [key: string]: string[];
    };
};
export declare function handleApiErrors<A extends ObjectEntries, B extends ErrorMessage<ObjectIssue> | undefined>(form: SuperValidated<Record<string, unknown>>, schema: ObjectSchema<A, B>, error: HttpValidationProblemDetails): void;
export declare function handleApiErrorsZod<T extends ZodRawShape>(form: SuperValidated<Record<string, unknown>>, schema: ZodObject<T>, error: HttpValidationProblemDetails): void;
export declare function toLocalISOString(date: Date): string;
export {};
