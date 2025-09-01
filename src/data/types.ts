import { SymbolKind } from "vscode";
import { Keyword } from "../types";
export interface RawMapping {
  name: Keyword;
  regex: string;
  allow: Array<keyof typeof SymbolKind>;
}

interface KeywordData {
  getRegex: (v: string) => string;
  allow: Array<SymbolKind>;
  placeholder: string;
}
export type Mappings = Record<Keyword, KeywordData>;
