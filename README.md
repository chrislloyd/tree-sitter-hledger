# tree-sitter-hledger

A [Tree Sitter](http://tree-sitter.github.io) grammer for the [hledger](https://hledger.org/) journal format.

## Motivation

While working with hledger files, I've found the editor integration to be subpar. `ledger-mode` is great, but is even more restrictive to non-technical folks than ledger already is. Many of the integrations for other editors are also subpar. For instance [mariosangiorgio/vscode-ledger](https://github.com/mariosangiorgio/vscode-ledger) (no longer maintained) and [mhansen/hledger-vscode](https://github.com/mhansen/hledger-vscode) still use incomplete `tmLanguage` syntaxes.

Eventually, I would like to use this to create a `hledger` autoformatter.

## Roadmap

The general goal is full support for the hledger format as described in the [official documentation](https://hledger.org/journal.html). Missing features (in no particular order):

- [ ] Secondary dates
- [ ] Posting dates
- [ ] Pipes in descriptions
- [ ] Spaces in account names
- [ ] Full parse all amounts
- [ ] Virtual postings
- [ ] Balance assertions
- [ ] Balance assignments
- [ ] Transaction pricing
- [ ] Comments
- [ ] Directives
- [ ] Periodic rules
- [ ] Auto-postings

## Contributing

This is a side project for me. I'm happy to accept contributions as pull-requests but don't have time (or the energy) to answer issues. If you find a bug, please add it to the corpus or submit a fix.
