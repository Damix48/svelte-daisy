<script lang="ts">
  import TreeSelect from "$lib/TreeSelect/TreeSelect.svelte";

  interface Category {
    id: string;
    name: string;
    children?: Category[];
  }

  const categories: Category[] = [
    {
      id: "1",
      name: "Electronics",
      children: [
        { id: "1-1", name: "Phones" },
        {
          id: "1-2",
          name: "Laptops",
          children: [
            { id: "1-2-1", name: "Gaming Laptops" },
            { id: "1-2-2", name: "Business Laptops" }
          ]
        }
      ]
    },
    {
      id: "2",
      name: "Books",
      children: [
        { id: "2-1", name: "Fiction" },
        { id: "2-2", name: "Non-Fiction" }
      ]
    },
    { id: "3", name: "Clothing" }
  ];

  let selectedCategory: Category | undefined = $state(undefined);
  let selectedCategories: Category[] = $state([]);
</script>

<h2>Single Tree Select</h2>
<TreeSelect items={categories} bind:selectedItem={selectedCategory} itemToString={(item) => item.name} itemToId={(item) => item.id} placeholder="Select a category..." />
<p>Selected: {selectedCategory?.name ?? "None"}</p>

<hr class="my-8" />

<h2>Multiple Tree Select (with Cascade)</h2>
<TreeSelect
  type="multiple"
  cascadeSelection={true}
  items={categories}
  bind:selectedItems={selectedCategories}
  itemToString={(item) => item.name}
  itemToId={(item) => item.id}
  placeholder="Select categories..."
/>
<p>Selected: {selectedCategories.map((c) => c.name).join(", ") || "None"}</p>
