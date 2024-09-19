<script lang="ts">
  import { Command } from "@tauri-apps/api/shell";
  import { onMount } from "svelte";
  import { getDeployments } from "../deployments.svelte";
  import SelectComponent from "./SelectComponent.svelte";

  const projectState = $state<{ projects: string[] }>({
    projects: [],
  });

  let project = $state<string | null>(null);
  let showSelect = $state(false);
  let searchText = $state("");
  let oldSearch = $state<string[]>([]);

  async function getProject() {
    const command = new Command("run-oc", ["project", "-q"]);
    const output = await command.execute();
    project = output.stdout;
    project = project.replaceAll(" ", "");
  }

  async function setProject(projectName: string) {
    const command = new Command("run-oc", ["project", projectName]);
    await command.execute();
    await getDeployments();
  }
  async function getProjects() {
    const projectsCmd = new Command("run-oc", [
      "get",
      "projects",
      "-o",
      "json",
    ]);

    const projectsOutput = await projectsCmd.execute();
    projectState.projects = JSON.parse(projectsOutput.stdout)?.items.map(
      (e) => e.metadata.name,
    );
    oldSearch = projectState.projects;
  }

  onMount(async () => {
    await getProject();
    await getProjects();
  });
</script>

<SelectComponent
  onSearch={(event) => {
    const value = (event.target as HTMLInputElement).value;
    projectState.projects = projectState.projects.filter((e) =>
      e.includes(value),
    );

    if (event.key === "Backspace") {
      projectState.projects = oldSearch;
    }
  }}
  onSelected={(value) => {
    project = value;
    searchText = "";
    setProject(value);
  }}
  onClickOutside={(show) => {
    projectState.projects = oldSearch;
    searchText = "";
  }}
  onShowDropdown={(e) => {
    console.log("showDropdown", e);
  }}
  list={projectState.projects}
  bind:value={searchText}
  selected={project}
/>
