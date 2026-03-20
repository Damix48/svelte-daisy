<script lang="ts">
import { Modal, modalService } from "$lib";
import Select from "$lib/components/ui/select/Select.svelte";
import FormRoot from "$lib/Form/FormRoot.svelte";
import Ciao from "./ciao.svelte";

type User = { id: number; name: string };
let users: User[] = [
  { id: 1, name: "alfa" },
  { id: 2, name: "beta" },
  { id: 3, name: "gamma" },
  { id: 4, name: "franco" },
  { id: 5, name: "sicilia" },
  { id: 6, name: "francia" },
  { id: 7, name: "germania" },
  { id: 8, name: "italia" }
];

let user: User | undefined = $state();
let userId: number | undefined;
let multiUsers: User[] = $state([]);
let multiId: number[] = $state([]);
</script>

<Modal.Root>
  <Modal.Trigger class="btn"> Open Modal</Modal.Trigger>
  <Modal.Content outsideBehavior="close"> fdsafs <input type="text" placeholder="Type here" class="input"> </Modal.Content>
</Modal.Root>

<button type="button" class="btn btn-primary" onclick={() => modalService.open(Ciao, {}, { outsideBehavior: "close-interact", position:"end" })}>Open popover</button>

<button popovertarget="my_modal_1" class="btn">open modal</button>

<div id="my_modal_1" popover="manual" class="modal">
  <div class="modal-box">
    <h3 class="text-lg font-bold">Hello!</h3>
    <p class="py-4">Press ESC key or click below</p>
    <div class="modal-action"><button class="btn" popovertarget="my_modal_1" popovertargetaction="hide">Close</button></div>
  </div>
</div>

<!-- 1. DEFAULTS -->
<!-- ✅ Valid: Infers type="single", bindingType="item". Expects User. -->
<Select items={users} bind:selected={user} itemToId={(x) => x.id} itemToString={(x) => x.name} />
<Select items={users} bind:selected={user} itemToId={(x) => x.id} itemToString={(x) => x.name} allowDeselect="true" />
<Select items={users} bind:selected={multiUsers} itemToId={(x) => x.id} itemToString={(x) => x.name} type="multiple" />
<Select items={users} bind:selected={multiId} itemToId={(x) => x.id} itemToString={(x) => x.name} type="multiple" bindingType="id" />

{JSON.stringify(user)}
{JSON.stringify(multiUsers)}
{JSON.stringify(multiId)}

<button
  type="button"
  class="btn"
  onclick={() => {
    user = users[0];
  }}
>
  Click
</button>
<button
  type="button"
  class="btn"
  onclick={() => {
    multiUsers.pop();
  }}
>
  Click2
</button>
<button
  type="button"
  class="btn"
  onclick={() => {
    multiUsers = [users[0], users[4]];
  }}
>
  Click4
</button>
<button
  type="button"
  class="btn"
  onclick={() => {
    multiId.pop();
  }}
>
  Click2
</button>
<button
  type="button"
  class="btn"
  onclick={() => {
    multiId = [users[0].id, users[4].id];
  }}
>
  Click3
</button>
