import * as vscode from "vscode";
import {
  convert2Quickpick,
  addLabel,
  getGitExtension,
  getGitRepo,
} from "./utils";
import { lightCommitTemplate } from "./types";

export class LightCommitProvider implements vscode.CompletionItemProvider {
  constructor() {}

  public async provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
    context: vscode.CompletionContext
  ) {
    // No completion items if the SMC input is not used
    if (
      document.languageId !== "scminput" &&
      context.triggerKind === vscode.CompletionTriggerKind.Invoke
    ) {
      return [];
    }
    // Load templates from configuration
    let extensionSettings =
      vscode.workspace.getConfiguration("light-git-commit");
    let commitTemplates: Array<lightCommitTemplate> =
      extensionSettings?.commitTemplates;
    let showEmoji = extensionSettings?.showEmoji;
    let activateLabelDiscovery = extensionSettings?.activateLabelDiscovery;
    let labelPattern = extensionSettings?.labelPattern;

    const range = new vscode.Range(
      new vscode.Position(position.line, position.character - 1),
      position
    );

    const list: vscode.CompletionList = new vscode.CompletionList();

    let repo = null;
    if (activateLabelDiscovery) {
      // Load required git extension
      const git = getGitExtension();

      if (!git) {
        vscode.window.showErrorMessage("❌ Failed to load git extension.");
        return;
      }
      // Try to load a the current repo
      repo = getGitRepo(git);
    }

    let commitMessage = "";
    // add the completion items
    for (let commitTemplate of commitTemplates) {
      if (activateLabelDiscovery && repo) {
        commitMessage = addLabel(
          convert2Quickpick(commitTemplate, showEmoji),
          activateLabelDiscovery,
          labelPattern,
          repo
        );
      } else {
        commitMessage = convert2Quickpick(commitTemplate, showEmoji);
      }
      list.items.push({
        label: convert2Quickpick(commitTemplate, showEmoji),
        insertText: commitMessage,
        detail: commitTemplate.description,
        kind: vscode.CompletionItemKind.Event,
        additionalTextEdits: [vscode.TextEdit.delete(range)], // Delete the trigger character
      });
    }

    return list;
  }
}
