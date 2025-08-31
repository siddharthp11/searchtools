/*
FEATURE: 
    - Search for imports
    - Search for migrations 
    - Language Specific 
*/

import { SymbolKind } from "vscode";
import { Keyword } from "../types";
import data from "./mapping.json";

// Mappings API
interface RawMapping {
  name: Keyword;
  regex: string;
  allow: Array<keyof typeof SymbolKind>;
}
const RAW_MAPPINGS = data as Array<RawMapping>;

type Mappings = Record<
  Keyword,
  {
    getQuery: (v: string) => string;
    allow: Array<SymbolKind>;
  }
>;
const PLACEHOLDER = "${v}";
function getMappings() {
  const map: Mappings = {};

  for (const rawMapping of RAW_MAPPINGS) {
    const { name, allow, regex } = rawMapping;
    map[name] = {
      allow: allow.map((a) => SymbolKind[a]),
      getQuery: (v) =>
        // .slice is used since RegExp .toString pads the regex with '/' on either side.
        RegExp(regex.replace(PLACEHOLDER, v)).toString().slice(1, -1),
    };
  }
  return Object.freeze(map);
}
// Keywords API
function getKeywords() {
  const keywords = RAW_MAPPINGS.map((r) => r.name);
  return Object.freeze(keywords);
}

/**
 * Contains the available keyword functions.
 * Each keyword is mapped to:
 * * getQuery: generates a regex search expression for the keyword
 * * allow: symbol types to suggest during symbol search
 */
export const MAPPINGS = getMappings();

export const KEYWORDS = getKeywords();
