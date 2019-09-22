# tree-sitter-hledger

A [Tree Sitter](http://tree-sitter.github.io) grammer for the [hledger](https://hledger.org/) journal format.

# Motivation

While working with hledger files, I've found the editor integration to be subpar. `ledger-mode` is great, but is even more restrictive to non-technical folks than ledger already is. Many of the integrations for other editors are also subpar. For instance [https://github.com/mariosangiorgio/vscode-ledger](https://github.com/mariosangiorgio/vscode-ledger) is no longer maintained and still uses an incomplete `tmLanguage`.

Eventually, I would like to use this to create a `hledger` autoformatter.

# Roadmap

The general goal is full support for the hledger format as described in the [official documentation](https://hledger.org/journal.html).

- [ ] Secondary dates
- [ ] Posting dates
- [ ] Pipes in descriptions
- [ ] Spaces in account names
- [ ] Full parse all amounts
- [ ] Virtual postings
- [ ] Balance assertions
- [ ]

# Contributing

This is a side project for me. I'm happy to accept contributions as pull-requests but don't have time (or the energy) to answer issues. If you find a bug, please add it to the corpus or submit a fix.
