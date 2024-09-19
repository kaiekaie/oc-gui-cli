import authState from "$lib/authState.svelte";
import { Command } from "@tauri-apps/api/shell";

class Deployments {
  deployments = $state<OcItems>();
  pods = $state<
    {
      name: string;
      cpu: string;
      memory: string;
    }[]
  >();
  constructor() {}
}

let deployments = new Deployments();

const getPods = (stdout: string) => {
  const lines = stdout.trim().split("\n");

  // Remove the header line
  lines.shift();

  // Parse the lines into JavaScript objects
  return lines.map((line) => {
    const [name, cpu, memory] = line.trim().split(/\s+/);
    return {
      name,
      cpu,
      memory,
    };
  });
};

export async function getDeployments() {
  const deploymentsCmd = new Command("run-oc", [
    "get",
    "deployments",
    "-o",
    "json",
  ]);
  const podsCmd = new Command("run-oc", ["adm", "top", "pods"]);
  const podsOutput = await podsCmd.execute();
  const deploymentsOutput = await deploymentsCmd.execute();

  if (deploymentsOutput.stderr.includes("Forbidden")) {
    authState.loggedIn = false;
  } else if (deploymentsOutput.stdout) {
    deployments.pods = getPods(podsOutput.stdout);
    deployments.deployments = JSON.parse(deploymentsOutput.stdout);
  }
}

export default deployments;
