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
  const podsCreatedCmd = new Command("run-oc", ["get", "pods", "-o", "json"]);
  const podsMetadata = await podsCreatedCmd.execute();
  const podsOutput = await podsCmd.execute();
  const deploymentsOutput = await deploymentsCmd.execute();

  if (deploymentsOutput.stderr.includes("Forbidden")) {
    authState.loggedIn = false;
  } else if (deploymentsOutput.stdout) {
    const pods = JSON.parse(podsMetadata.stdout);
    deployments.pods = getPods(podsOutput.stdout);
    const podsCreated = pods.items.map(
      (pod: any) =>
        (pod = {
          name: pod.metadata.name,
          created: pod.metadata.creationTimestamp,
        }),
    );
    deployments.pods = deployments.pods.map(
      (pod) =>
        (pod = { ...pod, ...podsCreated.find((p) => p.name === pod.name) }),
    );
    deployments.deployments = JSON.parse(deploymentsOutput.stdout);
  }
}

export default deployments;
