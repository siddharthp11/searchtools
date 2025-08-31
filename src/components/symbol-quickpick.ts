import {
  SymbolInformation,
  DocumentSymbol,
  QuickPickItem,
  CancellationTokenSource,
  SymbolKind,
} from "vscode";
import { window, commands } from "vscode";
import Command from "../enums/commands";
import { debounce } from "../utils/debounce";

const defaultItems = Object.freeze([
  {
    label: "Type to search workspace symbols…",
    detail: "Results will appear below",
  },
]);

type SymbolSearchResults = SymbolInformation[] | DocumentSymbol[] | undefined;
type QPItemWithValue = QuickPickItem & { value?: string };

interface QuickPickOptions {
  placeholder: string;
  allow: Array<SymbolKind>;
}

/**
 * Shows a QuickPick that live-queries workspace symbols while typing.
 * Returns the chosen symbol name or the raw text if user confirms free text.
 */
const GetSelectionFromQuickPick = ({
  placeholder,
  allow,
}: QuickPickOptions): Promise<string | undefined> => {
  const qp = window.createQuickPick<QPItemWithValue>();
  qp.items = defaultItems;
  qp.placeholder = placeholder;
  qp.ignoreFocusOut = true;

  // Debounce + cancellation to avoid flooding the symbol provider
  let currentCancel: CancellationTokenSource | undefined;

  const symbolSearch = async (query: string) => {
    currentCancel?.cancel();
    currentCancel = new CancellationTokenSource();
    const token = currentCancel.token;

    if (!query.trim()) {
      qp.items = defaultItems;
      return;
    }
    qp.busy = true;
    const symbols: SymbolSearchResults =
      (await commands.executeCommand(Command.WorkspaceSymbolSearch, query)) ??
      [];
    // if the token was cancelled by another search after the promise was kicked off, abort it!
    if (token.isCancellationRequested) {
      qp.busy = false;
      return;
    }

    // assuming a cancellation req cannot be sent when the following synchronous work is being done -
    try {
      const items: QPItemWithValue[] = [];
      for (const s of symbols.slice(0, 200)) {
        if ("children" in s) {
          const stack: Array<DocumentSymbol> = [s];
          while (stack.length > 0) {
            const node = stack.pop() as DocumentSymbol; // guaranteed that element exists

            // update stack
            node.children.forEach((childNode) => {
              stack.push(childNode);
            });
            if (allow && node.kind && !allow.includes(node.kind)) continue;
            items.push({
              label: node.name,
              description: SymbolKind[node.kind],
              detail: node.detail,
              value: node.name,
            });
          }
        } else {
          const file = s.location.uri.fsPath.split(/[\\/]/).pop() ?? "";
          if (allow && s.kind && !allow.includes(s.kind)) continue;
          items.push({
            label: s.name,
            description: SymbolKind[s.kind] + " in " + file,
            value: s.name,
          });
        }
      }
      // always allow the user to user the raw string
      items.splice(0, 0, {
        label: `$(lightbulb) Apply “${query}”`,
        description: "Search with this exact text",
        value: query,
        alwaysShow: true,
      });
      qp.items = items;
    } catch (e) {
      qp.items = [
        { label: "No symbols found or provider error", detail: String(e) },
      ];
    } finally {
      qp.busy = false;
    }
  };

  const debouncedSymbolSearch = debounce(symbolSearch, 200);
  qp.onDidChangeValue(debouncedSymbolSearch);

  const selectionPromise = new Promise<string | undefined>((resolve) => {
    qp.onDidAccept(() => {
      const sel = qp.selectedItems?.[0];
      resolve(sel.value ?? qp.value ?? undefined);
      qp.hide();
      qp.dispose();
      currentCancel?.cancel();
    });

    qp.onDidHide(() => {
      resolve(undefined);
      qp.dispose();
      currentCancel?.cancel();
    });
  });

  qp.show();
  return selectionPromise;
};

export default GetSelectionFromQuickPick;
