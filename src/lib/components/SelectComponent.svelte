<script lang="ts">
  import { clickOutside } from "../clickOutside";
  interface Props {
    list: string[];
    selected: string | null;
    value: string;
    showSelected?:boolean,
    required?:boolean,
    onSelected: (e: string) => void;
    onClickOutside: (show: boolean) => void;
    onShowDropdown?: (show: boolean) => void;
    onSearch: (e: KeyboardEvent) => void;
  }
  let {
    list,
    selected,
    value = $bindable(),
    showSelected = false,
    required = false,
    onSelected,
    onClickOutside,
    onShowDropdown,
    onSearch,
  }: Props = $props();

  let showDropDown = $state(showSelected);
</script>

{#if selected}
  <div
    class="relative text-base w-1/2"
    use:clickOutside
    onclick_outside={(e) => {
      showDropDown = false;
      onClickOutside(showDropDown);
    }}
  >
    <button
      class:hidden={showDropDown}
      onclick={(e) => {
        showDropDown = !showDropDown;
        if(onShowDropdown){
          onShowDropdown(showDropDown);
        }

      }}
      class="p-2 text-center bg-neutral-800  w-full hover:bg-neutral-700"
    >
      {selected}
    </button>
    <input
      type="text"
      class:hidden={!showDropDown}
      bind:value
      {required}
      onkeydown={onSearch}
      placeholder="Search projects..."
      class="p-2  w-full  border-none  bg-neutral-800   focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
    />
    <div
      class:hidden={!showDropDown}
      class="overflow-y-scroll max-h-96 absolute shadow bg-neutral-800  no-scrollbar"
    >
      {#each list as item}
        <button
          class:bg-neutral-600={selected.includes(item)}
          onclick={(e) => {
            onSelected(item);
            showDropDown = false;
          }}
          class=" text-left p-2 text-sm cursor-pointer w-full hover:bg-neutral-500"
        >
          {item}
        </button>
      {/each}
    </div>
  </div>
{:else}
  <div class="animate-pulse flex space-x-4 w-full">
    <div class="h-3 bg-slate-800 rounded"></div>
  </div>
{/if}
