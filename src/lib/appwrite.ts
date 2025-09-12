import { CustomUser, GitHubPreferences } from "@/types/auth";
import {
  Client,
  Account,
  Databases,
  Functions,
  ID,
  OAuthProvider,
} from "appwrite";

const client = new Client()
  .setEndpoint(
    import.meta.env.VITE_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1"
  )
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || "");

export const account = new Account(client);
export const databases = new Databases(client);
export const functions = new Functions(client);

export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || "";
export const BUGS_COLLECTION_ID =
  import.meta.env.VITE_APPWRITE_BUGS_COLLECTION_ID || "";
export const FUNCTION_ID = import.meta.env.VITE_APPWRITE_FUNCTION_ID || "";

export const AUTH_EVENTS = {
  SESSION_CREATE: "session.create",
  SESSION_DELETE: "session.delete",
} as const;

export const authService = {
  async loginWithGitHub() {
    try {
      const baseUrl = window.location.origin;
      return await account.createOAuth2Token(
        OAuthProvider.Github,
        `${baseUrl}/auth/callback`,
        `${baseUrl}/auth/failure`
      );
    } catch (error) {
      console.error("GitHub login error:", error);
      throw error;
    }
  },

  async handleOAuthCallback(
    userId: string,
    secret: string
  ): Promise<CustomUser | null> {
    try {
      await account.createSession(userId, secret);

      const user = await account.get();
      const session = await account.getSession("current");

      const githubId = session.providerUid;

      if (githubId) {
        try {
          const res = await fetch(`https://api.github.com/user/${githubId}`);
          if (res.ok) {
            const githubData = await res.json();

            const updatedPrefs: GitHubPreferences = {
              avatar: githubData.avatar_url,
              username: githubData.login,
              name: githubData.name,
            };

            await account.updatePrefs(updatedPrefs);

            return { ...user, prefs: updatedPrefs } as CustomUser;
          }
        } catch (err) {
          console.warn("Failed to fetch GitHub data:", err);
        }
      }

      return user as CustomUser;
    } catch (error) {
      console.error("OAuth callback error:", error);
      throw error;
    }
  },

  async getCurrentUser(): Promise<CustomUser | null> {
    try {
      const user = await account.get();
      return user as CustomUser;
    } catch (error) {
      console.error("Get current user error:", error);
      return null;
    }
  },

  async logout() {
    try {
      await account.deleteSession("current");
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  },

  async checkAuth() {
    try {
      const user = await account.get();
      return user;
    } catch (error) {
      return null;
    }
  },
};

export { ID, client };
