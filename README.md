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

## Development

### Test Corpus Sync with hledger

This project automatically syncs test cases from the official hledger repository to ensure compatibility:

```bash
# Initial setup (already done)
git submodule add https://github.com/simonmichael/hledger.git hledger

# Update to latest hledger tests
git submodule update --remote hledger
node extract-tests.js

# Build and test
npm run build
npm run test
```

The `extract-tests.js` script:
- Extracts 674+ real test cases from hledger's test suite
- Preserves any manual parse tree assertions you've written
- Generates `corpus/extracted_from_hledger.txt` with smart merging
- Never clobbers your manual work

### Writing Manual Assertions

Add detailed parse trees for important test cases in `corpus/extracted_from_hledger.txt`:

```
==================
test_name
==================

journal content here

---

(source_file
  (transaction
    (entry
      (date ...)
      (payee ...))
    (posting ...)))
```

These assertions are automatically preserved when syncing with hledger updates.

### Workflow

1. **Develop grammar**: Edit `grammar.js` and add manual assertions
2. **Sync tests**: Run `node extract-tests.js` periodically
3. **Validate**: Run `npm test` to ensure parsing works
4. **Your assertions survive** - never lost during hledger updates

## Contributing

This is a side project for me. I'm happy to accept contributions as pull-requests but don't have time (or the energy) to answer issues. If you find a bug, please add it to the corpus or submit a fix.
