/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

// hledger CSV rules format (.rules files)
// Also handles the shelltestrunner format where CSV data precedes a RULES marker.

module.exports = grammar({
  name: "hledger_csv",

  extras: () => [/ +/],

  rules: {
    source_file: ($) =>
      repeat(choice(
        $.csv_line,
        $.rules_marker,
        $.directive,
        $.conditional_block,
        $.comment_line,
        $._newline,
      )),

    // CSV data lines (before RULES marker or in mixed format)
    csv_line: () => token(prec(-2, /[^\n#;][^\n]*/)),

    rules_marker: ($) => seq("RULES", $._newline),

    directive: ($) =>
      seq(
        choice(
          seq("skip", optional($._value)),
          seq("fields", $._value),
          seq("separator", $._value),
          seq("newest-first", optional($._value)),
          seq("date-format", $._value),
          seq("decimal-mark", $._value),
          seq("date", $._value),
          seq("date2", $._value),
          seq("status", $._value),
          seq("code", $._value),
          seq("description", $._value),
          seq("comment", $._value),
          seq("account1", $._value),
          seq("account2", $._value),
          seq("amount", $._value),
          seq("amount-in", $._value),
          seq("amount-out", $._value),
          seq("currency", $._value),
          seq("balance", $._value),
          seq("balance1", $._value),
          seq("balance2", $._value),
          seq("include", $._value),
          seq("source", $._value),
          "end",
        ),
        $._newline,
      ),

    // if PATTERN / if,field1,field2 / if\nPATTERN
    conditional_block: ($) =>
      prec.right(seq(
        choice("if", "&", "&!"),
        optional($._value),
        $._newline,
        repeat($.indented_line),
      )),

    indented_line: ($) => seq(/\t| +/, $._value, $._newline),

    _value: () => token(prec(-1, /[^\n]+/)),

    comment_line: ($) => seq(token(seq(/[;#]/, /[^\n]*/)), $._newline),
    _newline: () => /\r?\n/,
  },
});
