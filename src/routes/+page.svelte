<script lang="ts">
import { RouteOff } from "@lucide/svelte";
import { Dropdown, Modal, modalService } from "$lib";
import Calendar from "$lib/components/ui/calendar/Calendar.svelte";
import DatePicker from "$lib/components/ui/calendar/DatePicker.svelte";
import Select from "$lib/components/ui/select/Select.svelte";
import TreeSelect from "$lib/components/ui/select/TreeSelect.svelte";
import Autocomplete from "$lib/components/ui/autocomplete/Autocomplete.svelte";
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

type Node = {
  id: number;
  name: string;
  children?: Node[];
};

const treeData: Node[] = [
  {
    id: 1,
    name: "Node 1",
    children: [
      { id: 2, name: "Child 1" },
      { id: 3, name: "Child 2" }
    ]
  },
  {
    id: 4,
    name: "Node 2",
    children: [
      { id: 5, name: "Child 3" },
      { id: 6, name: "Child 4" },
      { id: 7, name: "Child 5", children: [{ id: 8, name: "Grandchild 1" }] }
    ]
  },
  {
    id: 9,
    name: "Node 3",
    children: [
      { id: 10, name: "Child 6" },
      { id: 11, name: "Child 7" }
    ]
  },
  {
    id: 121,
    name: "Node 3",
    children: [
      { id: 122, name: "Child 6" },
      { id: 123, name: "Child 7" }
    ]
  },
  {
    id: 124,
    name: "Node 3",
    children: [
      { id: 125, name: "Child 6" },
      { id: 126, name: "Child 7" }
    ]
  }
];

let selectedNodes: Node[] = $state([]);

let date = $state(new Date());
let range = $state({ start: new Date(), end: new Date() });
let acText = $state("");

type PhotonFeature = {
  properties: {
    name: string;
    country?: string;
    state?: string;
    city?: string;
    osm_key: string;
    osm_id: number;
  };
  geometry: { coordinates: [number, number] };
};
let placeText = $state("");

let searchTimer: ReturnType<typeof setTimeout>;
function searchPlace(q: string): Promise<PhotonFeature[]> {
  clearTimeout(searchTimer);
  return new Promise((resolve) => {
    searchTimer = setTimeout(async () => {
      if (q.length < 2) {
        resolve([]);
        return;
      }
      try {
        const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=5`);
        const data = await res.json();

        console.log(data);
        resolve(data.features ?? []);
      } catch {
        resolve([]);
      }
    }, 300);
  });
}

function photonToString(p: PhotonFeature): string {
  const props = p.properties;
  const parts = [props.name, props.city, props.state, props.country].filter(Boolean);
  return parts.join(", ");
}
</script>

<Calendar type="single" bind:value={date} locale="it" numberOfMonths={2} />
<Calendar type="range" bind:value={range} showMonthSelect showYearSelect />

<DatePicker type="single" bind:value={date} locale="it" placeholder="Pick a date" class="w-100" />
<DatePicker type="range" bind:value={range} showMonthSelect showYearSelect placeholder="Pick a range" />

<Dropdown.Root>
  <Dropdown.Trigger class="btn">Open Dropdown</Dropdown.Trigger>
  <Dropdown.Content>
    <ul class="menu p-2">
      <li><a>Item 1</a></li>
      <li><a>Item 2</a></li>
      <li><a>Item 3</a></li>
    </ul>
  </Dropdown.Content>
</Dropdown.Root>

<input class="input" type="text" placeholder="Type here">
<TreeSelect items={treeData} itemToId={(x) => x.id} itemToString={(x) => x.name} bind:selected={selectedNodes} type="multiple" cascadeSelection selectionMode="leaf" />
<TreeSelect items={treeData} itemToId={(x) => x.id} itemToString={(x) => x.name} bind:selected={selectedNodes} type="multiple" cascadeSelection selectionMode="any" />

<Modal.Root>
  <Modal.Trigger class="btn">Open Modal</Modal.Trigger>
  <Modal.Content outsideBehavior="close" class="modal-fullscreen">
    <div class="modal-body">
      <p>Hello, I'm a modal!</p>
      <p>Hello, I'm a modal!</p>
      <p>Hello, I'm a modal!</p>
      <p>Hello, I'm a modal!</p>
      <p>Hello, I'm a modal!</p>
      <p>Hello, I'm a modal!</p>
      <p>Hello, I'm a modal!</p>
      <p>Hello, I'm a modal!</p>
      <p>Hello, I'm a modal!</p>
      <p>Hello, I'm a modal!</p>
      <p>Hello, I'm a modal!</p>
      <p>Hello, I'm a modal!</p>
      <p>Hello, I'm a modal!</p>
      <p>Hello, I'm a modal!</p>
      <p>Hello, I'm a modal!</p>
      <p>Hello, I'm a modal!</p>
      <p>Hello, I'm a modal!</p>
      <p>Hello, I'm a modal!</p>
      <p>Hello, I'm a modal!</p>
      <p>Hello, I'm a modal!</p>
      <p>Hello, I'm a modal!</p>
      <p>Hello, I'm a modal!</p>
      <p>Hello, I'm a modal!</p>
      <p>Hello, I'm a modal!</p>
      <p>Hello, I'm a modal!</p>
      <p>Hello, I'm a modal!</p>
      <p>Hello, I'm a modal!</p>
      <p>Hello, I'm a modal!</p>
      <p>Hello, I'm a modal!</p>
      <p>Hello, I'm a modal!</p>
      <p>Hello, I'm a modal!</p>
      <p>Hello, I'm a modal!</p>
      <p>Hello, I'm a modal!</p>
      <input type="text" placeholder="Type here" class="input">
    </div>
  </Modal.Content>
</Modal.Root>

<button
  type="button"
  class="btn btn-primary"
  onclick={() =>
    modalService.open(
      Ciao,
      {},
      { outsideBehavior: "close-interact", position: "end" },
    )}
>
  Open popover
</button>

<button popovertarget="my_modal_1" class="btn">open modal</button>

<div id="my_modal_1" popover="manual" class="modal">
  <div class="modal-box">
    <h3 class="text-lg font-bold">Hello!</h3>
    <p class="py-4">Press ESC key or click below</p>
    <div class="modal-action">
      <button class="btn" popovertarget="my_modal_1" popovertargetaction="hide">Close</button>
    </div>
  </div>
</div>

<Autocomplete items={users} bind:value={acText} itemToId={(x) => x.id} itemToString={(x) => x.name} placeholder="Search users..." />
{acText}

<Autocomplete
  search={searchPlace}
  bind:value={placeText}
  itemToId={(x) => x.properties.osm_id}
  itemToString={photonToString}
  placeholder="Search places (photon.komoot.io)..."
  minSearchLength={2}
/>
{placeText}

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
