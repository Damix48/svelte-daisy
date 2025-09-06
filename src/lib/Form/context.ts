import { Context } from "runed";
import type { SuperForm } from "sveltekit-superforms";

// The SuperForm<T, M> type expects 'T' to be a data type that extends Record<string, unknown>.
// The previous type, `ObjectSchema<any, any>`, is a schema definition and does not satisfy this constraint, causing the error.
//
// By using `SuperForm<any, any>`, we satisfy the constraint and make the context flexible enough
// to accept any form object created by `superForm`. This avoids downstream type-checking issues in
// child components (like FormCheckbox) that bind to form properties. The primary type safety
// is still enforced in your `Upsert*Form` components where `superForm` is initialized with a specific schema.
export type FormContextType<T extends Record<string, unknown> = any> = SuperForm<T, any>;

export const formContext = new Context<FormContextType>("form-context");

type FieldContext = {
  name: string;
  id: string;
};

export const fieldContext = new Context<FieldContext>("form-field-context");
