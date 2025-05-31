# tree-sitter-hledger

A [Tree Sitter](http://tree-sitter.github.io) grammar for the [hledger](https://hledger.org/) journal format.

## Features

This grammar provides comprehensive parsing and syntax highlighting for hledger journal files with support for:

### Core Features ✅
- **Transactions** with dates, status, codes, and descriptions
- **Postings** with accounts and amounts
- **Virtual postings** (parentheses and brackets)
- **Balance assertions** (`=` and `==`)
- **Cost/price specifications** (`@` and `@@`)
- **Comments** (`;` and `#`)
- **Directives** (account, commodity, include, alias, payee, tag, P, decimal-mark)
- **Periodic transactions** (with `~` and intervals)
- **Multi-format number parsing** (1,234.56, 1.234,56, scientific notation)
- **Unicode support** for accounts and commodities
- **Syntax highlighting** via Tree-sitter queries

### Advanced Support
- Multiple date formats (YYYY-MM-DD, YYYY/MM/DD, YYYY.MM.DD)
- Currency symbols and quoted commodities
- Complex amount formatting with thousands separators
- Account names with Unicode characters

## Motivation

While working with hledger files, I've found the editor integration to be subpar. `ledger-mode` is great, but is even more restrictive to non-technical folks than ledger already is. Many of the integrations for other editors are also subpar. For instance [mariosangiorgio/vscode-ledger](https://github.com/mariosangiorgio/vscode-ledger) (no longer maintained) and [mhansen/hledger-vscode](https://github.com/mhansen/hledger-vscode) still use incomplete `tmLanguage` syntaxes.

Eventually, I would like to use this to create a `hledger` autoformatter.

## Roadmap

Future enhancements to consider:

- [ ] Secondary dates
- [ ] Posting dates
- [ ] Balance assignments
- [ ] Auto-postings
- [ ] More directive types
- [ ] Error recovery improvements

## Installation & Usage

### As a Tree-sitter Grammar

This parser can be used with any editor that supports Tree-sitter grammars (Neovim, Emacs, VS Code with extensions, etc.).

### Development

```bash
# Install dependencies
npm install

# Generate parser from grammar
npm run build

# Run tests
npm run test
```

### File Support

The grammar recognizes these file extensions:
- `.journal`
- `.j`
- `.hledger`
- `.ledger`

### Testing

The test suite consists of two types of tests:

#### Manual Test Corpus
Hand-written tests in `test/corpus/` covering:
- Basic transactions and postings
- Virtual postings and balance assertions
- Unicode accounts and commodities
- Number formatting variations
- Directives and comments
- Periodic transactions
- Error cases

#### Generated Tests from hledger
The project includes a test extraction system that pulls real-world test cases from the official hledger repository:

```bash
# Update hledger submodule to latest version
git submodule update --remote hledger

# Extract test cases from hledger's test suite and updates assertions
npm run codegen
```

The extraction process:
- Scans 600+ test files from hledger's test suite
- Extracts journal content from shelltest format
- Generates `corpus/extracted_from_hledger.txt` with smart merging
- **Preserves any manual parse tree assertions** you've written
- Never overwrites your custom work

#### Running Tests

```bash
# Run all tests (manual + any generated)
npm test

# Run tests for specific corpus file
npx tree-sitter test --corpus test/corpus/basic.txt
```
