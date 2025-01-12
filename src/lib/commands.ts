import * as vscode from "vscode";
import { getGitExtension, convert2Quickpick, injectTemplate } from "./utils";

import { uri } from "./git";
import { lightCommitTemplate } from "./types";

export async function createCommit(uri: uri) {
  // Load required git extension
  const git = getGitExtension();

  if (!git) {
    vscode.window.showErrorMessage("❌ Failed to load git extension.");
    return;
  }

  // Load templates from configuration
  let extensionSettings = vscode.workspace.getConfiguration("light-git-commit");
  let defaultCommits: Array<lightCommitTemplate> =
    extensionSettings?.commitTemplates;

  // handle quick pick logic
  let items = [];
  for (let i = 0; i < defaultCommits.length; i++) {
    items.push({
      label: convert2Quickpick(defaultCommits[i]),
      description: defaultCommits[i].description,
    });
  }

  let pick = await vscode.window.showQuickPick(items, {
    placeHolder: "⛏️ Choose your light commit template!",
  });

  // Insert the text in source control input box
  if (uri) {
    if (uri) {
      let selectedRepository = git.repositories.find((repository) => {
        return (
          repository.rootUri.path === uri._rootUri?.path || uri.rootUri.path
        );
      });
      if (selectedRepository) {
        injectTemplate(pick?.label, selectedRepository);
      }
    }
  } else {
    for (let gitRepo of git.repositories) {
      injectTemplate(pick?.label, gitRepo);
    }
  }
}

export async function addTemplate(uri: uri) {
  // Load templates from configuration
  let extensionSettings = vscode.workspace.getConfiguration("light-git-commit");
  let defaultCommits: Array<lightCommitTemplate> =
    extensionSettings?.commitTemplates;

  defaultCommits.push({ type: "jesuis", emoji: "🌏", description:✨ "gneu" });
}
