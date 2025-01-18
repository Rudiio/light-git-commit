import * as vscode from "vscode";
import { convert2Quickpick } from "./utils";
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

    // Load templates from configuration
    let extensionSettings =
      vscode.workspace.getConfiguration("light-git-commit");
    let commitTemplates: Array<lightCommitTemplate> =
      extensionSettings?.commitTemplates;

    // add the completion items
    for (let commitTemplate of commitTemplates) {
      list.items.push({
        label: convert2Quickpick(commitTemplate),
        insertText: convert2Quickpick(commitTemplate),
        detail: commitTemplate.description,
        kind: vscode.CompletionItemKind.Event,
        additionalTextEdits: [vscode.TextEdit.delete(range)], // Delete the trigger character
      });
    }

    return list;
  }
}
