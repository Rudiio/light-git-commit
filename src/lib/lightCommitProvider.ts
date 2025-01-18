import * as vscode from "vscode";
import { convert2Quickpick, addLabel, getGitExtension } from "./utils";
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

    const range = new vscode.Range(
      new vscode.Position(position.line, position.character - 1),
      position
    );

    const list: vscode.CompletionList = new vscode.CompletionList();

    // Try to load a the current repo
    // Load required git extension
    const git = getGitExtension();

    if (!git) {
      vscode.window.showErrorMessage("❌ Failed to load git extension.");
      return;
    }

    const activeEditorUri = vscode.window.activeTextEditor?.document.uri;
    if (!activeEditorUri) {
      vscode.window.showErrorMessage("Please, open a workspace.");
      return;
    }
    const wsFolderUri =
      vscode.workspace.getWorkspaceFolder(activeEditorUri)?.uri;
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

    // Load templates from configuration
    let extensionSettings =
      vscode.workspace.getConfiguration("light-git-commit");
    let commitTemplates: Array<lightCommitTemplate> =
      extensionSettings?.commitTemplates;
    let showEmoji = extensionSettings?.showEmoji;
    let activateLabelDiscovery = extensionSettings?.activateLabelDiscovery;
    let labelPattern = extensionSettings?.labelPattern;

    // add the completion items
    for (let commitTemplate of commitTemplates) {
      list.items.push({
        label: convert2Quickpick(commitTemplate, showEmoji),
        insertText: addLabel(
          convert2Quickpick(commitTemplate, showEmoji),
          activateLabelDiscovery,
          labelPattern,
          repo
        ),
        detail: commitTemplate.description,
        kind: vscode.CompletionItemKind.Event,
        additionalTextEdits: [vscode.TextEdit.delete(range)], // Delete the trigger character
      });
    }

    return list;
  }
}
