import { ExtensionContext, commands } from "vscode";
import { KEYWORDS } from "./data/api";
import { buildSearchForKeyword } from "./generators/get-search-for-keyword";

const PREFIX = "rgx.";
export function activate(context: ExtensionContext) {
  KEYWORDS.forEach((k) => {
    const search = buildSearchForKeyword(k);
    const disposable = commands.registerCommand(PREFIX + k, search);
    context.subscriptions.push(disposable);
  });
}

export function deactivate() {}
