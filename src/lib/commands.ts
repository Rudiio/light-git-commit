import * as vscode from "vscode";
import {
  getGitExtension,
  convert2Quickpick,
  injectTemplate,
  handleInputBox,
} from "./utils";

import { lightCommitTemplate } from "./types";

export async function createCommit(uri: vscode.Uri) {
  // Load required git extension
  const git = getGitExtension();

  if (!git) {
    vscode.window.showErrorMessage("❌ Failed to load git extension.");
    return;
  }

  // Load templates from configuration
  let extensionSettings = vscode.workspace.getConfiguration("light-git-commit");
  let commitTemplates: Array<lightCommitTemplate> =
    extensionSettings?.commitTemplates;

  // handle quick pick logic
  let items = [];
  for (let i = 0; i < commitTemplates.length; i++) {
    items.push({
      label: convert2Quickpick(commitTemplates[i]),
      description: commitTemplates[i].description,
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

export async function addTemplate() {
  // Load templates from configuration
  let extensionSettings = vscode.workspace.getConfiguration("light-git-commit");
  let commitTemplates: Array<lightCommitTemplate> =
    extensionSettings?.commitTemplates;

  const commitType = await handleInputBox(
    "Your light git (conventional) commit `type`. Putting an existing `type` will update its value."
  );

  // find if already existing
  const index = commitTemplates.findIndex((x) => x.type === commitType);

  if (index !== -1) {
    vscode.window.showInformationMessage(
      `Light commit template of type : \`${commitType}\` already exists.\n⚠️The existing value will be updated.`
    );
  }
  if (commitType) {
    const commitEmoji = await handleInputBox(
      `Your light git (conventional) commit \`emoji\`.\n ${
        index !== -1
          ? `⚠️The existing \`${commitType}\` value will be updated.`
          : ""
      }`
    );

    if (commitEmoji) {
      const commitDescription = await handleInputBox(
        `Your light git (conventional) commit \`description\`. ${
          index !== -1
            ? `The new template for \`${commitType}\` is \`${commitType}: ${commitEmoji}\`.`
            : `The actual template for \`${commitType}\` is \`${commitType}: ${commitEmoji}\`.`
        }`
      );
      if (commitDescription) {
        // Add or create the new template
        try {
          const newTemplate = {
            type: commitType,
            emoji: commitEmoji,
            description: commitDescription,
          };
          if (index !== -1) {
            commitTemplates[index] = newTemplate;
          } else {
            commitTemplates.push(newTemplate);
          }
          vscode.window.showInformationMessage(
            "🎉 New light commit message created successfully !"
          );
          return;
        } catch (error) {
          vscode.window.showInformationMessage(
            `Template creation aborted, ${error}.`
          );
          return;
        }
      } else {
        vscode.window.showErrorMessage(
          "Template creation aborted, the inputted `description` is not correct."
        );
        return;
      }
    } else {
      vscode.window.showErrorMessage(
        "Template creation aborted, the inputted `emoji` is not correct."
      );
      return;
    }
  } else {
    vscode.window.showErrorMessage(
      "Template creation aborted, the inputted `type` is not correct."
    );
    return;
  }
}

export async function deleteTemplate() {
  // Load templates from configuration
  let extensionSettings = vscode.workspace.getConfiguration("light-git-commit");
  let commitTemplates: Array<lightCommitTemplate> =
    extensionSettings?.commitTemplates;

  // handle quick pick logic
  let items = [];
  for (let i = 0; i < commitTemplates.length; i++) {
    items.push({
      label: convert2Quickpick(commitTemplates[i]),
      description: commitTemplates[i].description,
    });
  }

  let pick = await vscode.window.showQuickPick(items, {
    placeHolder: "⛏️ Choose your light commit template!",
  });

  if (!pick) {
    vscode.window.showErrorMessage("Error while picking template");
    return;
  }

  const index = commitTemplates.findIndex(
    (x) => x.type === pick.label.split(":")[0]
  );

  if (index === -1) {
    vscode.window.showErrorMessage("Could not find the template to delete.");
    return;
  }
  commitTemplates.splice(index, 1);
  vscode.window.showInformationMessage(
    `Successfully deleted the template: \`${pick.label}\``
  );
  return;
}
