import * as vscode from "vscode";
import { getGitExtension, convert2Quickpick } from "./utils";
import { defaultCommits } from "./defaults";
import { uri } from "./git";
export async function createCommit(uri: uri) {
  // Load required git extension
  const git = getGitExtension();

  if (!git) {
    vscode.window.showErrorMessage("❌ Failed to load git extension.");
    return;
  }
  vscode.window.showInformationMessage("💪 Git extension loaded successfully");
  if (uri) {
    vscode.window.showInformationMessage(`git uir ${uri}`);
  } else {
    vscode.window.showInformationMessage(`Nope`);
  }
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
  vscode.window.showInformationMessage(`${pick?.label}`);
}
