import { CommandState } from "./command.svelte";

export const envCommand = new CommandState();
const setEnvCommand = new CommandState();
export const yamlCommand = new CommandState();

class Environment {
  envState = $state<object | null>(null);
  oldState = $state<object | null>(null);
  yamlData = $state<string | null>(null);
  oldYamlData = $state<string | null>(null);
  jsonParseError = $state<string | null>(null);
  constructor() {}
}

let environment = new Environment();

export const getEnvVariables = async (deployment) => {
  await envCommand.executeCommand("run-oc", [
    "get",
    `deployment/${deployment}`,
    "-o",
    "json",
  ]);
  const data = JSON.parse(envCommand.commandState.data);
  let array = data.spec.template.spec.containers.flatMap(
    (container) => container.env || [],
  );
  array = array.map((e) => [e.name, e.value]);
  environment.oldState = Object.fromEntries(array);
  environment.envState = Object.fromEntries(array);
};

export const getYamlString = async (deployment) => {
  await yamlCommand.executeCommand("run-oc", [
    "apply",
    "view-last-applied",
    `applications/${deployment}`,
    "-o",
    "json",
  ]);
  if (!yamlCommand.commandState.data) {
    await yamlCommand.executeCommand("run-oc", [
      "get",
      `deployment/${deployment}`,
      "-o",
      "json",
    ]);
  }
  environment.yamlData = yamlCommand.commandState.data;
  environment.oldYamlData = yamlCommand.commandState.data;
};
export const setEnvVariables = async (deployment, yaml) => {
  if (yaml) {
    await setYaml(deployment);
  } else {
    await setEnv(deployment);
  }
};

const setEnv = async () => {
  const changes = getChanges();

  await setEnvCommand.executeCommand("run-oc", [
    "set",
    "env",
    `deployment/${deployment}`,
    ...Object.entries(changes).map((e) => `${e[0]}=${e[1]}`),
  ]);
  console.log(
    setEnvCommand.commandState.data,
    setEnvCommand.commandState.error,
  );
  await getEnvVariables(deployment);
};

const setYaml = (deployment) => {};

const jsonValidator = (str) => {
  try {
    environment.jsonParseError = null;
    JSON.parse(str);
    return true;
  } catch (e) {
    console.log(e);
    environment.jsonParseError = e.message;
    return false;
  }
};

export const checkForChanges = (yaml) => {
  if (yaml) {
    const validJson = jsonValidator(environment.yamlData);
    if (!validJson) return false;
    return environment.yamlData !== environment.oldYamlData;
  }
  let changes = false;
  if (environment.oldState === null) return false;
  for (const key in environment.envState) {
    if (environment.envState[key] !== environment.oldState[key]) {
      changes = true;
    }
  }
  return changes;
};

const getChanges = () => {
  let changes = {};
  for (const key in environment.envState) {
    if (environment.envState[key] !== environment.oldState[key]) {
      changes[key] = environment.envState[key];
    }
  }
  return changes;
};

export default environment;
