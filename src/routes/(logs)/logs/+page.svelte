<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { Command } from "@tauri-apps/api/shell";
  import Loading from "$lib/components/Loading.svelte";

  let logs = $state<string[]>([]);
  let logsFollow = $state<string[]>([]);
  let autoRefresh = $state(false);
  let logComponent: HTMLElement;

  let moreScroll = $state(false);
  let loading = $state(false);
  let podId = $state<string | null>(null);
  async function getLogs(deployment: string, follow: boolean = false) {
    loading = true;
    const commands = ["logs", deployment];
    if (follow) {
      commands.push("--since=1s");
      commands.push("-f");
    }
    const command = new Command("run-oc", commands);

    if (!follow) {
      const output = await command.execute();

      output.stdout.split("\n").forEach((line) => {
        logs.push(line);
      });
    } else {
      command.on("close", (data) => {});
      command.on("error", (error) =>
        console.error(`command error: "${error}"`),
      );
      command.stdout.on("data", (line: string) => {
        logsFollow.push(line);
      });
      command.stderr.on("data", (line: string) => {
        console.log(line);
      });
      return await command.spawn();
    }
    loading = false;
  }
  onMount(async () => {
    const deployment = $page.url.searchParams.get("deployment") || "  ";
    podId = deployment;
    getLogs(deployment);
    getLogs(deployment, true);
  });

  function canScrollMore(container: HTMLElement): boolean {
    return (
      container.scrollTop + container.clientHeight < container.scrollHeight
    );
  }

  $effect(() => {
    if (logs.length > 0) {
      logComponent.scrollTo(0, logComponent.scrollHeight);
    }
    if (autoRefresh && logsFollow.length) {
      logs = logs.concat(logsFollow);
      logsFollow = [];
    }
  });
  function toggleAutoRefresh() {
    autoRefresh = !autoRefresh;
  }
</script>

<div class=" max-w-full mx-auto">
  <div class="px-4 max-h-screen overflow-hidden">
    <h2 class="text-xl font-semibold py-4">Logs - {podId}</h2>
    {#if loading}
      <Loading />
    {:else}
      <div
        class="  bg-gray-950 text-white overflow-scroll h-[90vh] flex flex-col relative"
        onscroll={async (e) => {
          const scrollMore = canScrollMore(logComponent);
          moreScroll = scrollMore;
        }}
        bind:this={logComponent}
      >
        {#each logs as line}
          <div class="w-[10000px]">
            <p class="font-mono text-sm w-fit">{line}</p>
          </div>
        {/each}
      </div>
    {/if}
    {#if logsFollow.length && !moreScroll && !autoRefresh}
      has more: {logsFollow.length}
      <button
        onclick={() => {
          logs = logs.concat(logsFollow);
          logsFollow = [];
        }}
      >
        Add more
      </button>
    {/if}
    <button
      class="bg-blue-500 my-2 text-white px-4 py-2 rounded hover:bg-blue-700 active:bg-blue-800 transition duration-300"
      onclick={toggleAutoRefresh}
    >
      {autoRefresh ? "Stop Auto Refresh" : "Start Auto Refresh"}
    </button>
  </div>
</div>
