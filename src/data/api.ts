/*
FEATURE: 
    - Search for imports
    - Search for migrations 
    - Language Specific 
*/

import { SymbolKind } from "vscode";
import { Keyword } from "../types";
import rawMappings from "./mapping.json";

/*
Mappings API 
*/

interface RawMapping {
  name: Keyword;
  regex: string;
  allow: Array<keyof typeof SymbolKind>;
}
type ParsedMappings = Record<
  Keyword,
  {
    getQuery: (v: string) => string;
    allow: Array<SymbolKind>;
  }
>;
const PLACEHOLDER = "${v}";
function getMappings() {
  const map = {} as ParsedMappings;

  for (const rawMapping of rawMappings) {
    const { name, allow, regex } = rawMapping as RawMapping;
    map[name] = {
      allow: allow.map((a) => SymbolKind[a]),
      getQuery: (v: string) =>
        // .slice is used since RegExp .toString pads the regex with '/' on either side.
        RegExp(regex.replace(PLACEHOLDER, v)).toString().slice(1, -1),
    };
  }
  return Object.freeze(map);
}

/**
 * Contains the available keyword functions.
 * Each keyword is mapped to:
 * * getQuery: generates a regex search expression for the keyword
 * * allow: symbol types to suggest during symbol search
 */
export const MAPPINGS = getMappings();

function getKeywords() {
  const keywords = Object.keys(MAPPINGS) as Keyword[];
  return Object.freeze(keywords);
}
export const KEYWORDS = getKeywords();
