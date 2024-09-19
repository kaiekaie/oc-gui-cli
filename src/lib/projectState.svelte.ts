const projectState = $state<{ project: string | null; projects: string[] }>({
  project: null,
  projects: [],
});

export default projectState;
