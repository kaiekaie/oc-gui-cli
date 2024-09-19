# OC CLI GUI

OC CLI GUI is a graphical user interface for the OpenShift `oc` command-line tool. This application provides an intuitive and user-friendly interface to interact with OpenShift clusters, making it easier to manage and monitor your deployments, pods, services, and other resources.

## Features

- **Select Server**: Easily select and switch between different OpenShift servers.
- **Login**: Securely authenticate with your OpenShift cluster using your credentials.
- **View Deployments**: View and manage your OpenShift deployments.
- **Log Viewer**: View and follow logs for your deployments in real-time.
- **Auto Refresh**: Automatically refresh data to keep your view up-to-date.

## Prerequisites

- Ensure you have the `oc` CLI installed. You can download it from the [OpenShift CLI documentation](https://docs.openshift.com/container-platform/latest/cli_reference/openshift_cli/getting-started-cli.html).
- Ensure you have Rust installed. You can download it from the [Rust website](https://www.rust-lang.org/).

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/oc-cli-gui.git
   cd oc-cli-gui