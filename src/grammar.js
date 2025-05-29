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
        choice(
          $.date, // fixed
          seq("~", $.interval), // periodic
        ),
        optional(field("status", choice("*", "!"))),
        optional($.code),
        optional($.description),
        $._newline,
        repeat($.posting),
      ),

    interval: ($) =>
      choice(
        "daily",
        "weekly",
        "monthly",
        "quarterly",
        "yearly",
        /every \d+ (days?|weeks?|months?|quarters?|years?)/,
        $.date, // specific dates
      ),

    code: () => token(seq("(", /[^)]*/, ")")),

    // Use low precedence (-1) so that specific tokens like status (*) and code (...)
    // are matched first when there's ambiguity, rather than being consumed by description
    description: () => token(prec(-1, /[^\r\n;]+/)),

    posting: ($) =>
      seq(
        choice(
          $.account, // regular account
          seq("(", $.account, ")"), // virtual account
          seq("[", $.account, "]"), // balanced virtual account
        ),
        optional(
          choice(
            seq(
              $.amount,
              optional(seq(optional($._whitespace), $.cost_spec)),
              optional(seq(optional($._whitespace), $.balance_assertion)),
            ),
            seq($._whitespace, $.balance_assertion),
          ),
        ),
        optional($.comment),
        $._newline,
      ),

    account: () => /[\p{L}\p{N}_][\p{L}\p{N}:_\/-]*/u,

    amount: ($) =>
      choice(
        // Negative commodity before number: -$100, -€50
        seq("-", $._commodity, $._number),
        // Commodity before number: $100, €50, £25
        seq($._commodity, $._number),
        // Number before commodity: 100 USD, -50.25 EUR
        prec(1, seq($._number, /[ \t]+/, $._commodity)),
        // Number only (assumes default commodity)
        $._number,
      ),

    commodity: ($) => $._commodity,

    cost_spec: ($) =>
      seq(
        choice(
          "@", // unit price
          "@@", // total price
        ),
        $.amount,
      ),

    balance_assertion: ($) => seq(choice("=", "=="), $.amount),

    directive: ($) =>
      seq(
        choice(
          seq("account", $.account),
          seq("commodity", $.commodity),
          seq("P", $.date, $.commodity, $.amount),
          seq("decimal-mark", field("mark", choice(".", ","))),
          seq("payee", field("payee", $._rest_of_line)),
          seq("tag", $.account),
          seq("include", field("filepath", $._rest_of_line)),
          seq("alias", $._rest_of_line),
        ),
        optional($.comment),
        $._newline,
      ),

    comment_line: ($) => seq($._comment, $._newline),
    comment: ($) => $._comment,

    _rest_of_line: () => /[^\r\n]+/,
    _comment_chars: () => choice(";", "#"),
    _comment: ($) => seq($._comment_chars, /[^\r\n]*/),

    _commodity: () =>
      choice(
        /[\p{Lu}\p{Lt}][\p{L}\p{N}]*/u, // Unicode letter/number commodities starting with uppercase
        /\$|€|£|¥|₹|₿|元|руб/, // Currency symbols including Unicode ones
        seq('"', /[^"]+/, '"'), // Quoted commodities like "Chocolate Frogs"
      ),

    _number: () =>
      token(
        seq(
          optional("-"),
          choice(
            // Integer part with optional thousands separators and fractional part
            seq(
              /[0-9]+([,][0-9]{3})*/, // Integer with thousands separators (commas)
              optional(seq(".", /[0-9]+/)), // Optional decimal part
            ),
            seq(
              /[0-9]+([.][0-9]{3})*/, // Integer with thousands separators (dots)
              optional(seq(",", /[0-9]+/)), // Optional decimal part with comma
            ),
            seq(
              /[0-9]+/, // Simple integer
              optional(seq(/[,.]/, /[0-9]+/)), // Optional decimal part with comma or dot
            ),
            // Pure decimal starting with decimal point
            seq(/[,.]/, /[0-9]+/),
          ),
          // Optional scientific notation
          optional(seq(/[eE]/, optional(/[+-]/), /[0-9]+/)),
        ),
      ),

    // Shared date pattern used by both date and interval rules
    date: ($) =>
      choice(
        // Full date with consistent separators (supports any length year)
        seq($._year, "/", $._month, "/", $._day), // YYYY/MM/DD
        seq($._year, "-", $._month, "-", $._day), // YYYY-MM-DD
        seq($._year, ".", $._month, ".", $._day), // YYYY.MM.DD
        // Partial date with consistent separators (when default year is set)
        seq($._month, "/", $._day), // MM/DD
        seq($._month, "-", $._day), // MM-DD
        seq($._month, ".", $._day), // MM.DD
      ),

    _year: () => /\d{4,}/,
    _month: () => /\d{1,2}/,
    _day: () => /\d{1,2}/,

    _whitespace: () => /[ \t]+/,
    _newline: () => /\r?\n/,
  },
});
