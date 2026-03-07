#include "tree_sitter/parser.h"

enum TokenType {
  ACCOUNT_NAME,
};

// Check if character definitely ends the account name
static bool is_terminator(int32_t c) {
  return c == 0 || c == '\n' || c == '\r' ||  // end of line/input
         c == ';' || c == '#' ||               // comment
         c == '=' || c == '@' ||               // balance assertion / cost spec
         c == ')' || c == ']' ||               // virtual account brackets
         c == '\t';                            // tab separator
}

// Check if character is a letter (ASCII or Unicode)
// More permissive: anything that's not whitespace, digit, or punctuation
static bool is_letter(int32_t c) {
  // ASCII letters
  if ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z')) return true;
  // Unicode letters (anything above ASCII that's not a space)
  if (c > 127) return true;
  return false;
}

// Check if character can be part of an account name (not first char)
// Allows: letters, digits, underscore, colon, slash, hyphen, and Unicode
static bool is_account_char(int32_t c) {
  if (is_letter(c)) return true;
  if (c >= '0' && c <= '9') return true;
  if (c == '_' || c == ':' || c == '/' || c == '-') return true;
  return false;
}

// Check if character can start an account name
static bool is_account_start_char(int32_t c) {
  if (is_letter(c)) return true;
  if (c >= '0' && c <= '9') return true;
  if (c == '_') return true;
  return false;
}

void *tree_sitter_hledger_external_scanner_create(void) {
  return NULL;
}

void tree_sitter_hledger_external_scanner_destroy(void *payload) {
}

unsigned tree_sitter_hledger_external_scanner_serialize(void *payload, char *buffer) {
  return 0;
}

void tree_sitter_hledger_external_scanner_deserialize(void *payload, const char *buffer, unsigned length) {
}

bool tree_sitter_hledger_external_scanner_scan(
  void *payload,
  TSLexer *lexer,
  const bool *valid_symbols
) {
  if (!valid_symbols[ACCOUNT_NAME]) {
    return false;
  }

  // Account must start with a valid character
  if (!is_account_start_char(lexer->lookahead)) {
    return false;
  }

  bool has_content = false;

  while (true) {
    int32_t c = lexer->lookahead;

    // Terminator characters end the account name
    if (is_terminator(c)) {
      break;
    }

    // Handle spaces - this is the tricky part
    // A single space followed by a LETTER continues the account name
    // Otherwise, the space ends the account name
    if (c == ' ') {
      // Mark end before consuming the space
      lexer->mark_end(lexer);

      // Consume spaces to see what follows
      int space_count = 0;
      while (lexer->lookahead == ' ') {
        space_count++;
        lexer->advance(lexer, false);
      }

      // Two+ spaces always ends the account
      if (space_count >= 2) {
        break;
      }

      // Single space - only continue if followed by a letter (word continuation)
      // This handles "food and drink" but stops at "food 100" or "food @"
      if (is_letter(lexer->lookahead)) {
        // The space is part of the account name
        // We've consumed it, keep scanning
        has_content = true;
        continue;
      }

      // Not followed by letter - end account before the space
      break;
    }

    // Regular account character
    if (is_account_char(c)) {
      has_content = true;
      lexer->advance(lexer, false);
      lexer->mark_end(lexer);
      continue;
    }

    // Unknown character - end account name
    break;
  }

  if (has_content) {
    lexer->result_symbol = ACCOUNT_NAME;
    return true;
  }

  return false;
}
