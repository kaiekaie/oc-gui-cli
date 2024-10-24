import { CommandState } from "./command.svelte";

const authState = $state<{
  loggedIn: boolean | null;
  username: string;
  server: string;
}>({
  loggedIn: null,
  username: "",
  server: "",
});

const serverType = new CommandState();

const clusterCommand = new CommandState();

class Servers {
  servers = $state<string[]>([]);
}

class Login {
  login = $state({
    username: "",
    password: "",
    output: "",
  });
}

export const loginCommand = new CommandState();
export let login = new Login();

export let servers = new Servers();

export async function getClusters() {
  await clusterCommand.executeCommand("run-oc", [
    "config",
    "view",
    "-o",
    "json",
  ]);

  const config = JSON.parse(clusterCommand.commandState.data) as Config;

  servers.servers = config.clusters.map((e) => e.cluster?.server);
}

export const status = new CommandState();

export async function whoami() {
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

export async function loginFunc(event: Event) {
  event.preventDefault();
  login.login.output = "";
  await loginCommand.executeCommand("run-oc", [
    "login",
    authState.server,
    "--password",
    login.login.password,
    "--username",
    login.login.username,
  ]);

  login.login.output =
    loginCommand.commandState.error || loginCommand.commandState.data;

  if (!loginCommand.commandState.data.includes("401")) {
    loginCommand.commandState.loading = false;
    login.login.output = "";
    await whoami();
  } else {
    return;
  }
}
export async function logout() {
  authState.loggedIn = false;
  authState.username = "";
  await loginCommand.executeCommand("run-oc", ["logout"]);
}

export default authState;
