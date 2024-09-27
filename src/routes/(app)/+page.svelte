<script lang="ts">
  import { WebviewWindow } from "@tauri-apps/api/window";

  import { onMount } from "svelte";
  import { invoke } from "@tauri-apps/api";

  import { listen } from "@tauri-apps/api/event";

  import deployments, { getDeployments } from "$lib/deployments.svelte";
  import Table from "$lib/components/Table.svelte";
  let showReplicas = $state<string[]>([]);
  let deploymentsElement: HTMLElement;
  onMount(async () => {
    await getDeployments();
    await invoke("init_process", { seconds: 60 });

    console.log(deployments);

    const unlisten = await listen("event-name", async (event) => {
      await getDeployments();
    });

    () => {
      unlisten();
    };
  });

  function getPods(value: string) {
    return deployments.pods?.length
      ? deployments.pods
          .filter((e) => e.name.includes(value))
          .sort(
            (a, b) =>
              parseInt(b.cpu) - parseInt(a.cpu) &&
              parseInt(b.memory) - parseInt(a.memory),
          )
      : [];
  }

  async function getLogs(value: string, getBiggest: boolean) {
    const pod = getBiggest
      ? getPods(value)[0]?.name
      : getPods(value).filter((e) => e.name === value)[0]?.name;

    const webview = new WebviewWindow(value, {
      url: "/logs?deployment=" + pod,
      title: value,
      focus: true,
      minWidth: 1920,
      minHeight: 1080,
    });
  }
</script>

{#snippet getPodsSnippet(value: string)}
  {#snippet header()}
    <th>Pod Name</th>
    <th>Cpu</th>
    <th>Memory</th>
  {/snippet}
  {#snippet row(item)}
    <td
      ><button
        class="hover:bg-slate-600"
        onclick={() => getLogs(item.name, false)}>{item.name}</button
      ></td
    >
    <td>{item.cpu}</td>
    <td>{item.memory}</td>
  {/snippet}
  <Table data={getPods(value)} {header} {row} />
{/snippet}

<div class=" mx-auto">
  <div class="flex items-center justify-items-start space-x-3">
    <h2 class="text-xl font-semibold mb-2">Deployments</h2>
    <button
      class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      onclick={() => getDeployments()}>refresh</button
    >
  </div>
  <ul class="space-y-2" bind:this={deploymentsElement}>
    {#if deployments?.deployments}
      {#each deployments?.deployments.items as deployment}
        <li class="p-2 shadow-md">
          <div class="flex flex-row justify-between items-center">
            <div
              class=" flex flex-row justify-items-start items-center space-x-2 w-full"
            >
              <div class=" text-base font-medium">
                {deployment.metadata.name}
              </div>
              <div class="text-sm text-gray-100">
                {deployment.metadata.creationTimestamp}
              </div>
              <div class="text-sm text-gray-100">
                {deployment.spec.template.spec.containers[0].image}
              </div>
              <button
                class="text-sm text-gray-100 bg-green-500 px-4 rounded hover:bg-green-600"
                onclick={() => {
                  showReplicas = showReplicas.includes(deployment.metadata.name)
                    ? showReplicas.filter((e) => e !== deployment.metadata.name)
                    : [...showReplicas, deployment.metadata.name];
                }}
              >
                Replicas: {deployment.spec.replicas}
              </button>
            </div>

            <button
              class="button"
              onclick={() => getLogs(deployment.metadata.name, true)}
            >
              Logs
            </button>
          </div>
          {#if showReplicas.includes(deployment.metadata.name)}
            {@render getPodsSnippet(deployment.metadata.name)}
          {/if}
        </li>
      {/each}
    {:else}
      {#each Array.from(Array(10).keys()) as i}
        <div class="animate-pulse flex space-x-4 space-y-4">
          <div class="h-6 w-full shadow-md rounded p-2"></div>
        </div>
      {/each}
    {/if}
  </ul>
</div>
