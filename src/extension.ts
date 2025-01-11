import * as vscode from "vscode";
import { createCommit } from "./lib/commands";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "light-git-commits" is now active!'
  );

  const commandCreate = vscode.commands.registerCommand(
    "light-git-commits.createCommit",
    createCommit
  );

  const commandAdd = vscode.commands.registerCommand(
    "light-git-commits.addTemplate",
    () => {
      vscode.window.showInformationMessage(
        "Light commit: 📦 Add a new light commit template"
      );
    }
  );

  const commandDelete = vscode.commands.registerCommand(
    "light-git-commits.deleteTemplate",
    () => {
      vscode.window.showInformationMessage(
        "Light commit:🧹 Delete an existing commit template"
      );
    }
  );

  context.subscriptions.push(commandCreate, commandAdd, commandDelete);
}

// This method is called when your extension is deactivated
export function deactivate() {}
