import { ExtensionContext, commands, window } from "vscode";
import { KEYWORDS } from "./data/api";
import { buildSearchForKeyword } from "./generators/get-search-for-keyword";
import { KeywordsProvider } from "./components/configure-keyswords-view";
import { EXTENSION_NAME } from "./constants";

export function activate(context: ExtensionContext) {
  window.createTreeView(EXTENSION_NAME, {
    treeDataProvider: new KeywordsProvider(),
  });

  KEYWORDS.forEach((k) => {
    const search = buildSearchForKeyword(k);
    const disposable = commands.registerCommand(
      EXTENSION_NAME + "." + k,
      search
    );
    context.subscriptions.push(disposable);
  });
}

export function deactivate() {}
