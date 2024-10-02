import { Command } from "@tauri-apps/api/shell";

export class CommandState {
  commandState = $state<{ loading: boolean; data: any; error: string | null }>({
    loading: false,
    data: null,
    error: null,
  });

  constructor() {}

  async executeCommand(command: string, args: string[]) {
    const cmd = new Command(command, args);
    this.commandState.loading = true;
    this.commandState.error = null;
    this.commandState.data = null;
    let output = await cmd.execute();

    if (output.stderr) {
      this.commandState.error = output.stderr;
    }
    if (output.stdout) {
      this.commandState.data = output.stdout;
    }
    this.commandState.loading = false;
  }
}
