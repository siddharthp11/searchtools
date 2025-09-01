import { ExtensionContext, commands, window } from "vscode";
import { MAPPINGS } from "./data/api";
import { EXTENSION_NAME } from "./constants";
import {
  GetKeywordFromQuickPick,
  GetQueryFromQuickPick,
  KeywordsProvider,
} from "./components";
import Command from "./enums/commands";

export function activate(context: ExtensionContext) {
  window.createTreeView(EXTENSION_NAME, {
    treeDataProvider: new KeywordsProvider(),
  });

  const disposable = commands.registerCommand(
    EXTENSION_NAME + ".search",
    async () => {
      const keyword = await GetKeywordFromQuickPick();
      if (!keyword) return;

      const { getRegex, ...searchArgs } = MAPPINGS[keyword];

      const term = await GetQueryFromQuickPick(searchArgs);
      if (!term) return;

      const regex = getRegex(term);

      await commands.executeCommand(Command.FindInFiles, {
        query: regex,
        isRegex: true,
        isCaseSensitive: false,
        isWholeWord: false,
        isUseIgnoreFiles: false,
      });

      setTimeout(() => {
        commands.executeCommand(Command.FocusNextSearchResult);
      }, 400);
    }
  );
  context.subscriptions.push(disposable);
}

export function deactivate() {}
