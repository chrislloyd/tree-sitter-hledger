# Tree-Sitter HLedger Grammar TODO

## Completed Features ✅

### Core Grammar (High Priority)
- [x] **Set up basic grammar structure** - source_file and journal rules
- [x] **Implement transaction parsing** - date, status, code, description  
- [x] **Implement posting parsing** - account, amount, comments
- [x] **Add account name parsing** - hierarchy support with colons
- [x] **Implement amount and commodity parsing** - multiple currencies and formats
- [x] **Create comprehensive test corpus** - all syntax elements covered

### Extended Features (Medium Priority)  
- [x] **Add support for different date formats** - YYYY/MM/DD, YYYY-MM-DD, YYYY.MM.DD, MM/DD, M/D (consistent separators enforced)
- [x] **Implement comment parsing** - semicolon and hash comments (line and inline)
- [x] **Add directive parsing** - account, commodity, price declarations
- [x] **Extended directive support** - decimal-mark, payee, tag, include directives

### Advanced Features (Low Priority)
- [x] **Support virtual postings** - parentheses `(account)` and brackets `[account]` syntax
- [x] **Balance assertions and assignments support** - `= $100`, `== $100` syntax
- [x] **Cost and price syntax** - `@`, `@@` for unit costs and total costs  
- [x] **Periodic transaction support** - `~` prefix for recurring transactions

## Potential Future Enhancements 🔄

### Edge Case Improvements
- [ ] **Enhanced error recovery** - better handling of malformed syntax
- [ ] **Account aliases** - support for account aliasing syntax
- [ ] **Transaction modifiers** - support for automatic posting rules

### Parser Robustness
- [ ] **Better whitespace handling** - more flexible spacing rules
- [ ] **Improved number parsing** - handle edge cases in numeric formats
- [ ] **Extended period expressions** - more sophisticated recurring transaction patterns

## Known Issues 🐛

### Edge Cases That May Need Testing
- [ ] **Complex nested account names** - verify deep hierarchy parsing
- [ ] **Multiple commodity formats** - ensure all variations work correctly
- [ ] **Unicode in account names** - international character support

## Grammar Design Notes 📝

### Current Architecture
- **Hidden nodes** used for `_commodity` and `_number` for cleaner syntax highlighting
- **Choice structures** for handling multiple amount formats
- **Optional sequences** for transaction metadata (status, code, description)
- **Repeat structures** for postings and file-level elements

### Design Decisions
- Prioritized practical syntax highlighting over perfect AST representation
- Focused on most common HLedger use cases first
- Maintained simple, testable grammar rules
- Used incremental development approach

### Testing Strategy
- Corpus tests split by feature area (`amounts.txt`, `transactions.txt`, etc.)
- High-signal tests covering edge cases and variations
- Test expectations updated when changing AST structure
- Comprehensive coverage of implemented features

## Development Workflow 🔧

### When Adding New Features
1. Add todo item with appropriate priority
2. Create minimal test case first
3. Implement grammar rule incrementally  
4. Add comprehensive corpus tests
5. Update AST expectations if needed
6. Mark todo as completed

### When Fixing Issues
1. Create minimal reproduction case
2. Debug with `npx tree-sitter parse`
3. Fix one issue at a time
4. Verify fix doesn't break existing tests
5. Update corpus tests if needed

---

*Last updated: Updated to reflect actual implementation status from grammar.js - most major features are now complete!*

*For development tips and workflows, see [AGENT.md](./AGENT.md)*