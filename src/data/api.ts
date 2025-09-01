import { SymbolKind } from "vscode";
import data from "./mapping.json";
import { Mappings, RawMapping } from "./types";

const PLACEHOLDER = "${v}";
const RAW_MAPPINGS = data as Array<RawMapping>;

function getMappings() {
  const m: Mappings = {};

  for (const { name, allow, regex } of RAW_MAPPINGS) {
    m[name] = {
      allow: allow.map((a) => SymbolKind[a]),
      placeholder: "Searching for " + allow.join(", "),
      getRegex: (v) =>
        RegExp(regex.replace(PLACEHOLDER, v)).toString().slice(1, -1), // .slice is used since RegExp .toString pads the regex with '/' on either side.
    };
  }
  return Object.freeze(m);
}

function getKeywords() {
  const k = RAW_MAPPINGS.map((r) => r.name);
  return Object.freeze(k);
}

/**
 * Contains the available keyword functions.
 * Each keyword is mapped to:
 * * getRegex: generates a regex search expression for the keyword
 * * allow: symbol types to suggest during symbol search
 */
export const MAPPINGS = getMappings();
/**
 * Contains the available keywords
 * * list of strings.
 */
export const KEYWORDS = getKeywords();
