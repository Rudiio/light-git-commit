import * as vscode from "vscode";
import { GitExtension } from "./git";
import { lightCommitConfig } from "./types";

export function getGitExtension() {
  const gitVscode = vscode.extensions.getExtension<GitExtension>("vscode.git");
  const gitExtension = gitVscode && gitVscode.exports;
  return gitExtension && gitExtension.getAPI(1);
}

export function convert2Quickpick(commitConfig: lightCommitConfig) {
  return `${commitConfig.type}: ${commitConfig.emoji}`;
}
