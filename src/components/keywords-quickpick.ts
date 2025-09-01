import { window } from "vscode";
import { KEYWORDS } from "../data/api";
import { Keyword } from "../types";

const options = KEYWORDS.map((k) => ({ label: k }));

async function GetKeywordFromQuickPick(): Promise<Keyword | undefined> {
  const qp = window.createQuickPick();
  qp.items = options;
  qp.onDidChangeValue((q) => {
    qp.items = options.filter((o) => o.label.includes(q));
  });

  const selection = new Promise<Keyword | undefined>((resolve, _) => {
    qp.onDidAccept(() => {
      resolve(qp.selectedItems[0].label);
      qp.hide();
      qp.dispose();
    });
    qp.onDidHide(() => {
      resolve(undefined);
      qp.hide();
      qp.dispose();
    });
  });
  qp.show();
  return selection;
}

export default GetKeywordFromQuickPick;
