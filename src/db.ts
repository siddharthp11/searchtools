import { SymbolKind } from "vscode";
import { Keyword } from "./types";
interface Mapped {
  matcher: (v: string) => RegExp;
  allow: Array<SymbolKind>;
}
type Mappings = Record<Keyword, Mapped>;

export const MAPPINGS = Object.freeze<Mappings>({
  fn: {
    matcher: (v) => new RegExp(`def\\s+${v}`),
    allow: [SymbolKind.Function, SymbolKind.Method],
  },
  fncall: {
    matcher: (v) => new RegExp(`(?<!def)\\s${v}\\(`),
    allow: [SymbolKind.Function, SymbolKind.Method],
  },
  cla: {
    matcher: (v) => new RegExp(`class\\s+${v}`),
    allow: [SymbolKind.Class],
  },
  clacall: {
    matcher: (v) => new RegExp(`(?<!class\\s)${v}`),
    allow: [],
  },
  tbl: {
    matcher: (v) => new RegExp(`__tablename__\\s*=\\s*["']${v}["']`),
    allow: [
      SymbolKind.Variable,
      SymbolKind.Field,
      SymbolKind.Constant,
      SymbolKind.String,
    ],
  },
});
