import { setError, type SuperValidated } from "sveltekit-superforms";
import { toCamelCase } from "./casing";
import { keyof, type ErrorMessage, type ObjectEntries, type ObjectIssue, type ObjectSchema } from "valibot";
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

export function handleApiErrors<A extends ObjectEntries, B extends ErrorMessage<ObjectIssue> | undefined>(
  form: SuperValidated<Record<string, unknown>>,
  schema: ObjectSchema<A, B>,
  error: HttpValidationProblemDetails
) {
  for (const key in error.errors) {
    const keys = keyof(schema).options as readonly string[];
    const isKey = (value: string): value is (typeof keys)[number] => keys.includes(value);
    const errorKey = toCamelCase(key);
    if (isKey(errorKey)) {
      setError(form, errorKey, error.errors[key] ?? []);
    } else {
      setError(form, error.errors[key] ?? "Unknown error");
    }
  }
}

export function handleApiErrorsZod<T extends ZodRawShape>(form: SuperValidated<Record<string, unknown>>, schema: ZodObject<T>, error: HttpValidationProblemDetails) {
  for (const key in error.errors) {
    const keys = Object.keys(schema.shape);
    const errorKey = toCamelCase(key);
    if (keys.includes(errorKey)) {
      setError(form, errorKey, error.errors[key] ?? []);
    } else {
      setError(form, error.errors[key] ?? "Unknown error");
    }
  }
}

export function toLocalISOString(date: Date) {
  const tzoffset = date.getTimezoneOffset() * 60000; //offset in milliseconds
  const localISOTime = new Date(date.getTime() - tzoffset).toISOString().slice(0, -1);
  return localISOTime;
}
