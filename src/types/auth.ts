export interface GitHubPreferences {
  avatar?: string;
  username?: string;
  name?: string;
}

import type { Models } from "appwrite";

export interface CustomUser extends Models.User<GitHubPreferences> {}
