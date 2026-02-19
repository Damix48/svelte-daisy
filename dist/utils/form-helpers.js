import { setError } from "sveltekit-superforms";
import { toCamelCase } from "./casing";
import { keyof } from "valibot";
import {} from "zod";
export function handleApiErrors(form, schema, error) {
    for (const key in error.errors) {
        const keys = keyof(schema).options;
        const isKey = (value) => keys.includes(value);
        const errorKey = toCamelCase(key);
        if (isKey(errorKey)) {
            setError(form, errorKey, error.errors[key] ?? []);
        }
        else {
            setError(form, error.errors[key] ?? "Unknown error");
        }
    }
}
export function handleApiErrorsZod(form, schema, error) {
    for (const key in error.errors) {
        const keys = Object.keys(schema.shape);
        const errorKey = toCamelCase(key);
        if (keys.includes(errorKey)) {
            setError(form, errorKey, error.errors[key] ?? []);
        }
        else {
            setError(form, error.errors[key] ?? "Unknown error");
        }
    }
}
export function toLocalISOString(date) {
    const tzoffset = date.getTimezoneOffset() * 60000; //offset in milliseconds
    const localISOTime = new Date(date.getTime() - tzoffset).toISOString().slice(0, -1);
    return localISOTime;
}
