import { ExtensionContext, commands, SymbolKind } from "vscode";
import { Keyword } from "./types";
import { MAPPINGS, KEYWORDS } from "./data/api";
import Command from "./enums/commands";
import GetSelectionFromQuickPick from "./components/symbol-quickpick";

const PREFIX = "rgx.";
export function activate(context: ExtensionContext) {
  KEYWORDS.forEach((k) => {
    const search = buildSearchForKeyword(k);
    const disposable = commands.registerCommand(PREFIX + k, search);
    context.subscriptions.push(disposable);
  });
}

const buildSearchForKeyword = (keyword: Keyword) => async () => {
  const { getQuery, allow } = MAPPINGS[keyword];

  const term = await GetSelectionFromQuickPick({
    placeholder: "Searching for " + allow.map((k) => SymbolKind[k]).join(", "),
    allow,
  });
  if (!term) return;

  const query = getQuery(term);

  await commands.executeCommand(Command.FindInFiles, {
    query,
    isRegex: true,
    isCaseSensitive: false,
    isWholeWord: false,
    isUseIgnoreFiles: false,
  });

  setTimeout(() => {
    commands.executeCommand(Command.FocusNextSearchResult);
  }, 400);
};

export function deactivate() {}
