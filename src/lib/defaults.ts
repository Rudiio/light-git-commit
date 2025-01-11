import { lightCommitConfig } from "./types";

export const defaultCommits: Array<lightCommitConfig> = [
  {
    type: "fix",
    emoji: "🔧",
    description: "A commit that fixes a bug in your codebase",
  },
  {
    type: "feat",
    emoji: "✨",
    description: "A commit that implements a new feature",
  },
];
