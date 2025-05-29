/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "hledger",

  // Only skip spaces and tabs; we want newlines and semicolons to be
  // significant
  extras: () => [/[ \t]/],

  rules: {
    source_file: ($) =>
      repeat(choice($.transaction, $.directive, $.comment_line, $._newline)),

    transaction: ($) =>
      seq(
        choice($.date, seq("~", $.interval)),
        optional($.status),
        optional($.code),
        optional($.description),
        $._newline,
        repeat($.posting),
      ),

    date: () =>
      token(
        choice(
          // Full date with consistent separators
          /\d{4}\/\d{1,2}\/\d{1,2}/, // YYYY/MM/DD
          /\d{4}-\d{1,2}-\d{1,2}/, // YYYY-MM-DD
          /\d{4}\.\d{1,2}\.\d{1,2}/, // YYYY.MM.DD
          // Partial date with consistent separators (when default year is set)
          /\d{1,2}\/\d{1,2}/, // MM/DD
          /\d{1,2}-\d{1,2}/, // MM-DD
          /\d{1,2}\.\d{1,2}/, // MM.DD
        ),
      ),

    interval: () =>
      token(
        choice(
          "daily",
          "weekly",
          "monthly",
          "quarterly",
          "yearly",
          /every \d+ (days?|weeks?|months?|quarters?|years?)/,
          /\d{4}[-\/]\d{1,2}[-\/]\d{1,2}/, // specific dates
        ),
      ),

    status: () => choice("*", "!"),

    code: () => token(seq("(", /[^)]*/, ")")),

    // Use low precedence (-1) so that specific tokens like status (*) and code (...)
    // are matched first when there's ambiguity, rather than being consumed by description
    description: () => token(prec(-1, /[^\r\n;]+/)),

    posting: ($) =>
      seq(
        $._whitespace,
        choice(
          $.account, // regular account
          seq("(", $.account, ")"), // virtual account
          seq("[", $.account, "]"), // balanced virtual account
        ),
        optional($.amount),
        optional($.cost_spec),
        optional($.balance_assertion),
        optional($.comment),
        $._newline,
      ),

    account: () => /[a-zA-Z][a-zA-Z0-9:_-]*/,

    amount: ($) =>
      choice(
        // Negative commodity before number: -$100, -€50
        seq("-", $._commodity, $._number),
        // Commodity before number: $100, €50, £25
        seq($._commodity, $._number),
        // Number before commodity: 100 USD, -50.25 EUR
        seq($._number, $._commodity),
        // Number only (assumes default commodity)
        $._number,
      ),

    commodity: ($) => $._commodity,

    cost_spec: ($) =>
      choice(
        seq("@", $.amount), // @ $150 (unit price)
        seq("@@", $.amount), // @@ $1500 (total price)
      ),

    balance_assertion: ($) =>
      choice(
        seq("=", $.amount), // = $100
        seq("==", $.amount), // == $100
      ),

    directive: ($) =>
      choice(
        seq("account", $.account, $._newline),
        seq("commodity", $.commodity, $._newline),
        seq("P", $.date, $.commodity, $.amount, $._newline),
        seq("decimal-mark", $.mark, $._newline),
        seq("payee", $.payee, $._newline),
        seq("tag", $.account, $._newline),
        seq("include", $.filepath, $._newline),
      ),

    mark: () => choice(".", ","),

    payee: ($) => $._rest_of_line,

    filepath: ($) => $._rest_of_line,

    comment_line: ($) => seq($._comment, $._newline),
    comment: ($) => $._comment,

    _rest_of_line: () => /[^\r\n]+/,
    _comment_chars: () => choice(";", "#"),
    _comment: ($) => seq($._comment_chars, /[^\r\n]*/),

    _commodity: () =>
      choice(
        /[A-Z]{3,}|\$|€|£|¥|₹|₿/, // Standard commodities
        seq('"', /[^"]+/, '"'), // Quoted commodities like "Chocolate Frogs"
      ),

    _number: () => /-?[0-9]+([,.][0-9]+)*/,
    _whitespace: () => /[ \t]+/,
    _newline: () => /\r?\n/,
  },
});
