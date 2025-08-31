# searchtools README

## Dev TODO's:

- The following keywords should be available out of the box:
  1. Search for imports
  2. Search for migrations
  3. Not as important for now: Language Specific
- The user should be able to create their own mappings.
  - We need to persist these in VSCode k-v or some other DB.
  - We can allow CRUD via QuickPick
- Allow the user easy access to keyword via the command palette
  - This should not take more than one query

### Done

- The user needs to be able to see suggestions while typing out the search term

## Problem:

Lets be real, no one uses regex to search. But we are often searching for complex things -

- Where does this function get called with these arg?
- Sho me all migrations on this table.
- Show me everywhere this gets imported.

RGX will get AI to generate the regex for you and attach the generated regex to a certain command for you to use along with some args

## Definitions

keyword: the function the user wants to invoke (fncall, fndef)
term: the term the user is matching by

Discovery:

- VSCode has symbol search to go to the definition of any variable, functions, class in the codebase.
- We can solve the problem of going to references of the symbol, but that doesn't make sense generally speaking.
  - It might make sense for specific cases - show me all the migrations for this table.
  - Show me all the places this function was called
- We can use VSCode's symbol search instead of the find in file search
