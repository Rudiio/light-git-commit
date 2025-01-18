import * as vscode from "vscode";
import { GitExtension, Repository, API } from "./git";
import { lightCommitTemplate } from "./types";
import { create } from "domain";

export function getGitExtension() {
  const gitVscode = vscode.extensions.getExtension<GitExtension>("vscode.git");
  const gitExtension = gitVscode && gitVscode.exports;
  return gitExtension && gitExtension.getAPI(1);
}

export function getLabel(pattern: string, repo: Repository) {
  const re = new RegExp(pattern);

  let currentBranch = repo.state.HEAD;
  if (!currentBranch) {
    vscode.window.showErrorMessage("Could not find current branch.");
    return;
  }
  let branchName = currentBranch?.name;
  if (!branchName) {
    vscode.window.showErrorMessage("Could not find current branch name.");
    return;
  }

  let matches = branchName.match(re);
  if (!matches) {
    vscode.window.showInformationMessage(
      "🫠 `Light Git Commit` did not find the label in your branch name. Check your pattern or your branch name."
    );
    return null;
  }
  return matches[0];
}

export function convert2Quickpick(
  commitTemplate: lightCommitTemplate,
  showEmoji: boolean
) {
  let commitMessage = `${commitTemplate.type}:`;

  if (showEmoji) {
    commitMessage = commitMessage + ` ${commitTemplate.emoji} `;
    return commitMessage;
  }
  return commitMessage + " ";
}

export function addLabel(
  commit: string,
  activateLabelDiscovery: boolean,
  pattern: string,
  repo: Repository
) {
  if (activateLabelDiscovery) {
    let label = getLabel(pattern, repo);

    if (label) {
      return commit + `(${label})`;
    }
  }
  return commit;
}

export function injectTemplate(commitTemplate: string, gitRepo: Repository) {
  gitRepo.inputBox.value = `${commitTemplate} ${gitRepo.inputBox.value}`;
}

export async function handleInputBox(placeHolder: string) {
  const result = await vscode.window.showInputBox({
    value: "",
    placeHolder: placeHolder,
    validateInput: (text) => {
      return typeof text !== "string" ? "Input is not a string" : null;
    },
  });
  return result;
}

export function getGitRepo(git: API) {
  const activeEditorUri = vscode.window.activeTextEditor?.document.uri;
  if (!activeEditorUri) {
    vscode.window.showErrorMessage("Please, open a workspace.");
    return;
  }
  const wsFolderUri = vscode.workspace.getWorkspaceFolder(activeEditorUri)?.uri;
  if (!wsFolderUri) {
    vscode.window.showErrorMessage("Please, open a workspace.");
    return;
  }
  const repo = git.getRepository(wsFolderUri);
  if (!repo) {
    vscode.window.showErrorMessage(
      "Your current workspace is not a git repo, the extension won't work."
    );
    return;
  }
  return repo;
}
