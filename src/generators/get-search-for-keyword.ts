import Command from "../enums/commands";
import { Keyword } from "../types";

import GetSelectionFromQuickPick from "../components/symbol-quickpick";
import { MAPPINGS } from "../data/api";
import { commands } from "vscode";

export const buildSearchForKeyword = (keyword: Keyword) => async () => {
  const { getQuery, ...searchArgs } = MAPPINGS[keyword];

  const term = await GetSelectionFromQuickPick(searchArgs);
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
