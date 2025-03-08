import { adminClient, usernameClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
  plugins: [adminClient(), usernameClient()],
  baseURL: "http://localhost:8787", // the base url of your auth server
});
// export const { signIn, signUp, useSession } = createAuthClient();
