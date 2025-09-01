import { TreeDataProvider, TreeItem } from "vscode";
import { KEYWORDS } from "../data/api";
class KeywordItem extends TreeItem {
  constructor(public readonly label: string) {
    super(label);
  }
}
export class KeywordsProvider implements TreeDataProvider<KeywordItem> {
  constructor() {}

  getTreeItem(element: KeywordItem): KeywordItem {
    return element;
  }

  getChildren(element?: KeywordItem | undefined): KeywordItem[] {
    if (!element) return KEYWORDS.map((k) => new KeywordItem(k));
    return [];
  }
}
