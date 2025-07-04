import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  console.log("Extension is now active!");
  const disposable = vscode.commands.registerCommand(
    "searchtools.helloWorld",
    () => {
      vscode.window
        .showInputBox({
          prompt: "Enter the search term",
        })
        .then((value) => {
          if (value) {
            vscode.commands.executeCommand("workbench.action.findInFiles", {
              query: value,
              isRegex: false,
              isCaseSensitive: false,
              isWholeWord: false,
              isUseIgnoreFiles: false,
            });
            // setTimeout(() => {
            //   vscode.commands.executeCommand(
            //     "search.action.focusNextSearchResult"
            //   );
            // }, 100);
          }
        });
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
