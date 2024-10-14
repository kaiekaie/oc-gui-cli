<script lang="ts">
  import environment, {
    checkForChanges,
    envCommand,
    getEnvVariables,
    getYamlString,
    setEnvVariables,
    yamlCommand,
  } from "$lib/environment.svelte";
  import { onMount } from "svelte";
  import { page } from "$app/stores";

  const deployment = $page.url.searchParams.get("deployment") || null;
  const yaml = $page.url.searchParams.get("yaml") === "true" || null;

  onMount(async () => {
    if (!yaml) {
      await getEnvVariables(deployment);
    } else {
      await getYamlString(deployment);
    }
  });
</script>

<div>
  <div class=" w-full bg-red-800">
    {yamlCommand.commandState.error ||
      envCommand.commandState.error ||
      environment.jsonParseError}
  </div>
  <button
    class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-500 fixed right-2 top-2"
    disabled={envCommand.commandState.loading ||
      yamlCommand.commandState.loading ||
      !checkForChanges(yaml)}
    onclick={() => setEnvVariables(deployment, yaml)}
  >
    Save</button
  >
  {#if environment.envState}
    {#each Object.keys(environment.envState) as key}
      <div class="flex items-center space-x-2 py-2">
        {key}:<input class="w-1/5" bind:value={environment.envState[key]} />
        {#if environment.envState[key] !== environment.oldState[key]}
          <div>was:</div>
          <div class="bg-red-500 text-white px-2 py-1 rounded">
            {environment.oldState[key]}
          </div>
        {/if}
      </div>
    {/each}
  {/if}

  <textarea
    autocorrect="off"
    minlength="100"
    spellcheck="false"
    class="w-full h-screen min-h-[500px] p-2"
    bind:value={environment.yamlData}>{environment.yamlData}</textarea
  >
</div>
