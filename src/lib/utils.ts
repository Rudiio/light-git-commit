import * as vscode from "vscode";
import { GitExtension, Repository } from "./git";
import { lightCommitTemplate } from "./types";

export function getGitExtension() {
  const gitVscode = vscode.extensions.getExtension<GitExtension>("vscode.git");
  const gitExtension = gitVscode && gitVscode.exports;
  return gitExtension && gitExtension.getAPI(1);
}

export function convert2Quickpick(
  commitTemplate: lightCommitTemplate,
  showEmoji: boolean
) {
  if (showEmoji) {
    return `${commitTemplate.type}: ${commitTemplate.emoji} `;
  }
  return `${commitTemplate.type}: `;
}

export function injectTemplate(commitTemplate: string, gitRepo: Repository) {
  gitRepo.inputBox.value = `${commitTemplate}: ${gitRepo.inputBox.value}`;
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
