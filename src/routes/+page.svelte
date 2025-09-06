<script lang="ts">
  import { Form } from "$lib";
  import { defaults, superForm } from "sveltekit-superforms";
  import { valibot } from "sveltekit-superforms/adapters";
  import { object, pipe, string, uuid, number, minValue } from "valibot";

  const schema = object({
    ingredientId: pipe(string(), uuid()),
    quantity: pipe(number(), minValue(0))
  });

  const form = superForm(defaults(valibot(schema)), {
    SPA: true,
    validators: valibot(schema),
    resetForm: false
  });
</script>

<Form.Root {form}>
  <Form.Field name=""></Form.Field>
</Form.Root>
