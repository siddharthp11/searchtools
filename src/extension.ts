import { ExtensionContext, commands, SymbolKind } from "vscode";
import { Keyword } from "./types";
import { MAPPINGS } from "./db";
import Command from "./enums/commands";
import GetSelectionFromQuickPick from "./components/symbol-quickpick";

export function activate(context: ExtensionContext) {
  Object.keys(MAPPINGS).forEach((keyword) => {
    const search = getSearchFunction(keyword);
    const disposable = commands.registerCommand(`rgx.${keyword}`, search);
    context.subscriptions.push(disposable);
  });
}

const getSearchFunction = (keyword: Keyword) => async () => {
  const { matcher, allow } = MAPPINGS[keyword];

  const term = await GetSelectionFromQuickPick({
    placeholder: "Searching for " + allow.map((k) => SymbolKind[k]).join(", "),
    allow,
  });
  if (!term) return;

  const regex = matcher(term).toString().slice(1, -1);

  await commands.executeCommand(Command.FindInFiles, {
    query: regex,
    isRegex: true,
    isCaseSensitive: false,
    isWholeWord: false,
    isUseIgnoreFiles: false,
  });

  setTimeout(() => {
    commands.executeCommand(Command.FocusNextSearchResult);
  }, 700);
};

export function deactivate() {}
