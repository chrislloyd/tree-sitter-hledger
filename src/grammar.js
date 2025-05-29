/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const WHITESPACE = /[ \t]+/;

module.exports = grammar({
  name: "hledger",

  extras: () => [WHITESPACE],

  rules: {
    source_file: ($) =>
      repeat(choice($.transaction, $.directive, $.comment_line, $._newline)),

    transaction: ($) =>
      seq(
        choice(
          $.date, // fixed
          seq("~", $.interval), // periodic
        ),
        optional(seq($._whitespace, $.status)),
        optional(seq(optional($._whitespace), $.code)),
        optional(seq(optional($._whitespace), $.description)),
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
        // "every N days/weeks/months/quarters/years"
        token(
          seq(
            "every", // keyword
            / +/, // required space(s)
            /\d+/, // number
            / +/, // required space(s)
            /(days?|weeks?|months?|quarters?|years?)/, // time unit with optional plural
          ),
        ),
        // specific dates
        $.date,
      ),

    status: () => choice("*", "!"),

    code: () =>
      token(
        seq(
          "(", // opening paren
          /[^)]*/, // any content except closing paren
          ")", // closing paren
        ),
      ),

    // Use low precedence (-1) so that specific tokens like status (*) and code (...)
    // are matched first when there's ambiguity, rather than being consumed by description
    description: () => token(prec(-1, /[^\r\n;]+/)),

    posting: ($) =>
      seq(
        $._whitespace, // postings must be indented
        choice(
          $.account, // regular account
          seq("(", $.account, ")"), // virtual account
          seq("[", $.account, "]"), // balanced virtual account
        ),
        optional(
          seq(
            $._whitespace,
            choice(
              seq(
                $.amount,
                optional(seq(optional($._whitespace), $.cost_spec)),
                optional(seq(optional($._whitespace), $.balance_assertion)),
              ),
              $.balance_assertion,
            ),
          ),
        ),
        optional($.comment),
        $._newline,
      ),

    account: () =>
      token(
        seq(
          /[\p{L}\p{N}_]/u, // first char: letter, number, or underscore
          /[\p{L}\p{N}:_\/-]*/u, // rest: also allows colon, slash, hyphen
        ),
      ),

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
          seq("include", $.filepath),
          seq("alias", $._rest_of_line),
        ),
        optional($.comment),
        $._newline,
      ),

    comment_line: ($) => seq($._comment, $._newline),
    comment: ($) => seq(optional($._whitespace), $._comment),

    filepath: () =>
      token(
        seq(
          /[^\r\n;#\s]+/, // first path segment (required)
          /(\s+[^\r\n;#\s]+)*/, // additional segments with spaces
        ),
      ),

    _rest_of_line: () => /[^\r\n]+/,
    _comment_chars: () => choice(";", "#"),
    _comment: ($) => seq($._comment_chars, /[^\r\n]*/),

    _commodity: () =>
      choice(
        // Unicode letter commodities (USD, EUR, etc.)
        token(
          seq(
            /[\p{Lu}\p{Lt}]/u, // first: uppercase letter
            /[\p{L}\p{N}]*/u, // rest: any letters/numbers
          ),
        ),
        // Currency symbols including Unicode ones
        /\$|€|£|¥|₹|₿|元|руб/,
        // Quoted commodities like "Chocolate Frogs"
        token(seq('"', /[^"]+/, '"')),
      ),

    _number: () => {
      // Reusable number components
      const digit = /\d+/;
      const thousand = /\d{3}/;
      const thousands_comma = seq(digit, repeat(seq(",", thousand))); // 1,234,567
      const thousands_dot = seq(digit, repeat(seq(".", thousand))); // 1.234.567
      const decimal_dot = seq(".", digit); // .50
      const decimal_comma = seq(",", digit); // ,50
      const scientific = seq(/[eE]/, optional(/[+-]/), digit);

      return token(
        seq(
          optional("-"), // optional negative sign
          choice(
            // Format 1: 1,234.56 (comma thousands, dot decimal)
            seq(thousands_comma, optional(decimal_dot)),
            // Format 2: 1.234,56 (dot thousands, comma decimal)
            seq(thousands_dot, optional(decimal_comma)),
            // Format 3: Simple number with optional decimal
            seq(digit, optional(seq(/[,.]/, digit))),
            // Format 4: Leading decimal (.5 or ,5)
            seq(/[,.]/, digit),
          ),
          optional(scientific), // optional scientific notation
        ),
      );
    },

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

    _whitespace: () => WHITESPACE,
    _newline: () => /\r?\n/,
  },
});
