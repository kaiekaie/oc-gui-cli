<script lang="ts">
  import { onMount } from "svelte";
  import authState, {
    whoami,
    status,
    loginFunc,
    getClusters,
    servers,
    login,
    loginCommand,
    logout,
  } from "$lib/authState.svelte";
  import Loading from "$lib/components/Loading.svelte";
  import Select from "$lib/components/Select.svelte";
  import { listen } from "@tauri-apps/api/event";

  let { children } = $props();

  onMount(async () => {
    await getClusters();
    await whoami();
    const unlisten = await listen("event-name", async (event) => {
      await whoami();
    });

    () => {
      unlisten();
    };
  });
</script>

{#if authState.loggedIn !== null && authState.loggedIn === false}
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-gray-900"
  >
    <form
      class="bg-gray-800 p-6 rounded-lg shadow-md w-96"
      onsubmit={loginFunc}
    >
      {#each servers.servers as server}
        <div class="text-sm">{server}</div>
      {/each}
      <input
        required
        placeholder="server"
        class="w-full mb-4 p-2 border border-gray-300 rounded"
        bind:value={authState.server}
      />

      <input
        bind:value={login.login.username}
        placeholder="username"
        required
        class="w-full mb-4 p-2 border border-gray-300 rounded"
      />
      <input
        bind:value={login.login.password}
        type="password"
        required
        placeholder="password"
        class="w-full mb-4 p-2 border border-gray-300 rounded"
      />
      <button
        class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        login
      </button>
      <div class="mt-2 text-red-500">
        {login.login.output || status.commandState.error}
      </div>
      {#if loginCommand.commandState.loading}
        <div class="mt-2">Loading...</div>
      {/if}
    </form>
  </div>
{:else if authState.loggedIn === true}
  <header class="flex bg-neutral-900 justify-between items-center p-2">
    <div class="font-semibold">{authState.username}</div>
    <Select />
    <button
      class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
      onclick={logout}
    >
      Logout
    </button>
  </header>
  <div class="p-2">
    {@render children()}
  </div>
{:else}
  <Loading />
{/if}
