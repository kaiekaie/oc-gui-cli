<script lang="ts">
  import { onMount } from "svelte";
  import authState from "$lib/authState.svelte";
  import { CommandState } from "$lib/command.svelte";

  import Loading from "$lib/components/Loading.svelte";
  import Select from "$lib/components/Select.svelte";
  let { children } = $props();
  const login = $state({
    username: "",
    password: "",
    output: "",
  });

  let servers = $state<string[]>([]);

  const status = new CommandState();
  const serverType = new CommandState();
  const loginCommand = new CommandState();
  const clusterCommand = new CommandState();
  onMount(async () => {
    await whoami();
    await getClusters();
  });

  async function whoami() {
    await status.executeCommand("run-oc", ["whoami"]);
    await serverType.executeCommand("run-oc", ["whoami", "--show-server"]);
    if (status.commandState.error) {
      authState.loggedIn = false;
      return;
    }
    authState.server = serverType.commandState.data.replaceAll("\n", "");
    authState.loggedIn = status.commandState.error ? false : true;
    authState.username = status.commandState.data;
  }

  async function getClusters() {
    await clusterCommand.executeCommand("run-oc", [
      "config",
      "view",
      "-o",
      "json",
    ]);

    const config = JSON.parse(clusterCommand.commandState.data) as Config;
    servers = config.clusters.map((e) => e.cluster?.server);
  }

  async function loginFunc(event: Event) {
    event.preventDefault();
    login.output = "";
    await loginCommand.executeCommand("run-oc", [
      "login",
      authState.server,
      "--password",
      login.password,
      "--username",
      login.username,
    ]);
    login.output =
      loginCommand.commandState.error || loginCommand.commandState.data;

    if (loginCommand.commandState.data) {
      await whoami();
      loginCommand.commandState.loading = false;
    }
  }
  async function logout() {
    authState.loggedIn = false;
    authState.username = "";
    await loginCommand.executeCommand("run-oc", ["logout"]);
  }
</script>

{#if authState.loggedIn !== null && authState.loggedIn === false}
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-gray-900"
  >
    <form
      class="bg-gray-800 p-6 rounded-lg shadow-md w-96"
      onsubmit={loginFunc}
    >
      {#each servers as server}
        <div class="text-sm">{server}</div>
      {/each}
      <input
        required
        placeholder="server"
        class="w-full mb-4 p-2 border border-gray-300 rounded"
        bind:value={authState.server}
      />
      <input
        bind:value={login.username}
        placeholder="username"
        required
        class="w-full mb-4 p-2 border border-gray-300 rounded"
      />
      <input
        bind:value={login.password}
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
        {login.output || status.commandState.error}
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
