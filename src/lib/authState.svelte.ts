const authState = $state<{
  loggedIn: boolean | null;
  username: string;
  server: string;
}>({
  loggedIn: null,
  username: "",
  server: "",
});

export default authState;
