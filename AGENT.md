# Tree-Sitter Grammar Development Guide

## Essential Commands & Workflow

### Core Development Cycle
```bash
# 1. Modify grammar
vim src/grammar.js

# 2. Regenerate parser (CRITICAL - always do this after grammar changes)
npx tree-sitter generate src/grammar.js

# 3. Run tests
npm test

# 4. Debug specific files
npx tree-sitter parse test-file.txt
```

### Testing Commands
```bash
# Run all corpus tests
npm test

# Update test expectations (useful when changing AST structure)
npm test -- --update

# Test specific corpus file
npx tree-sitter test --corpus amounts

# Debug parsing with simple test cases
echo "2023-01-01 test\n    account    \$10" | npx tree-sitter parse
```

## Grammar Development Best Practices

### Start Simple, Build Incrementally
- Begin with basic structure (transactions with date + postings)
- Add one feature at a time (status, codes, amounts, virtual postings, etc.)
- Test after each addition to catch issues early
- Use TodoWrite/TodoRead to track progress across development sessions

### Grammar Design Patterns

**Optional Elements in Sequence:**
```javascript
transaction: ($) => seq(
  $.date,
  optional(seq($._whitespace, $.status)),
  optional(seq($._whitespace, $.code)),
  optional(seq($._whitespace, $.description)),
  $._newline,
  repeat1($.posting)
)
```

**Choice Structures for Variants:**
```javascript
amount: ($) => choice(
  seq("-", $._commodity, $._number),  // -$100
  seq($._commodity, $._number),       // $100  
  seq($._number, $._commodity),       // 100 USD
  $._number                           // 42
)
```

**Token vs Rule Design:**
- Use `token()` for lexical elements that need precedence control
- Use `prec()` to resolve conflicts: `prec(-1, ...)` for greedy matching
- Example: `description: ($) => token(prec(-1, /[^\r\n;]*/))`

### Hidden vs Visible Nodes
- Use hidden nodes (`_rule`) for implementation details that shouldn't appear in AST
- Keep visible nodes for things that matter for syntax highlighting/analysis
- Example: Hide `_commodity` and `_number` inside `amount` for cleaner highlighting
- Keep visible `commodity` rule for directives while using hidden `_commodity` for amounts

### Whitespace Handling
- Don't over-specify whitespace - let Tree-Sitter handle it naturally
- Use `optional($._whitespace)` only when needed
- Simpler posting rules work better than complex whitespace sequences

## Testing Strategy

### Corpus Test Organization
- Create separate test files by feature: `amounts.txt`, `transactions.txt`, `directives.txt`
- Write "high signal" tests that cover edge cases and important variations
- Include both positive cases (should parse) and negative cases (should fail gracefully)
- Use `expected_replacements` parameter for bulk test expectation updates

### Test-Driven Development
1. Write test expectations first, then implement grammar
2. Update test expectations when changing AST structure (e.g., hiding nodes)
3. Create minimal test cases when debugging specific issues
4. Check both successful parsing AND correct AST structure

## Debugging Techniques

### Incremental Problem Solving
- When multiple tests fail, fix one issue at a time
- Revert to working state if changes break too much
- Use simple echo/parse commands to isolate specific parsing issues
- Create debug files with minimal examples

### AST Structure Verification
```bash
# Check specific node types in output
npx tree-sitter parse file.txt | grep -A 5 "amount \["

# Verify clean structure
npx tree-sitter parse file.txt | head -20

# Show all amount node structures
npx tree-sitter parse file.txt | grep -A 10 "amount \["
```

### Common Issues & Solutions
- **Parser not updating**: Always run `npx tree-sitter generate` after grammar changes
- **Whitespace conflicts**: Simplify whitespace handling, use optional whitespace sparingly
- **Hidden node references**: Keep both visible and hidden versions of rules when needed for directives
- **Negative amounts**: Handle different negative formats explicitly in choice structures

## Grammar Design Philosophy

### Practical Trade-offs
- Perfect grammar coverage vs. practical usability
- Sometimes better to have working core functionality than to fix every edge case
- Hidden nodes improve real-world usage (syntax highlighting) even if AST is less detailed
- Prioritize most common use cases first

### Iterative Refinement
1. Build comprehensive corpus tests to reveal edge cases
2. Address issues systematically rather than trying to fix everything at once
3. Use TodoWrite/TodoRead to maintain progress across sessions
4. Mark tasks completed immediately when done

## Project Structure
- **Source**: Grammar definition in `src/grammar.js`
- **Tests**: Corpus tests in `test/corpus/` (split by logical groupings)
- **HLedger Reference**: Submodule at `hledger/` for reference implementation
- **Debug Files**: Create temporary test files for debugging specific issues

## Development Workflow Summary
1. **Plan**: Use TodoWrite to break down complex features
2. **Implement**: Start simple, add incrementally
3. **Test**: Run corpus tests after each change
4. **Debug**: Use minimal test cases and targeted parsing
5. **Refine**: Update AST structure for practical usage
6. **Validate**: Ensure core functionality still works after changes