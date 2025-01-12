import * as vscode from "vscode";
import { createCommit, addTemplate, deleteTemplate } from "./lib/commands";
import { LightCommitProvider } from "./lib/lightCommitProvider";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const commandCreate = vscode.commands.registerCommand(
    "light-git-commits.createCommit",
    createCommit
  );

  const commandAdd = vscode.commands.registerCommand(
    "light-git-commits.addTemplate",
    addTemplate
  );

  const commandDelete = vscode.commands.registerCommand(
    "light-git-commits.deleteTemplate",
    deleteTemplate
  );

  const languageProvider = vscode.languages.registerCompletionItemProvider(
    "*", // All document types
    new LightCommitProvider(),
    "/" // The trigger character
  );

  context.subscriptions.push(
    commandCreate,
    commandAdd,
    commandDelete,
    languageProvider
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
