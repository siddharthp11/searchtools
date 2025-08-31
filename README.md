# searchtools README

Problem:
Lets be real, no one uses regex to search.
But we are often searching for complex things

- where does this function get called with this arg?
- show me allmigrations on this table
- etc.

Singleton matcher will get AI to generate the regex for you and attach the generated regex to a certain command for you to use along with some args

Requirements:
/\*
TODO's:

- Search for imports
- Search for migrations
- Language Specific
  \*/
  keyword: the function the user wants to invoke (fncall, fndef)
  term: the term the user is matching by

- Allow the user to map keywords to a regex matching function.
  eg. table: {term: tab, matcher: (v) => "/s+**tablename**+{v}}
- Allow the user easy access to keyword via the command palette
  - This should not take more than one query
- The user needs to be able to see suggestions while typing out the search term- loading all symbols into memory would be useful here

Discovery:

- VSCode has symbol search to go to the definition of any variable, functions, class in the codebase.
- We can solve the problem of going to references of the symbol, but that doesn't make sense generally speaking.
  - It might make sense for specific cases - show me all the migrations for this table.
  - Show me all the places this function was called
- We can use VSCode's symbol search instead of the find in file search
