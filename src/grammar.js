/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "hledger",

  // Only skip spaces and tabs; we want newlines and semicolons to be significant
  extras: ($) => [/[ \t]/],

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

    status: ($) => choice("*", "!"),

    code: ($) => token(seq("(", /[^)]*/, ")")),

    date: ($) =>
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

    interval: ($) =>
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

    // Use low precedence (-1) so that specific tokens like status (*) and code (...)
    // are matched first when there's ambiguity, rather than being consumed by description
    description: ($) => token(prec(-1, /[^\r\n;]+/)),

    posting: ($) =>
      seq(
        $._whitespace,
        $.account,
        optional($.amount),
        optional($.cost_spec),
        optional($.balance_assertion),
        optional($.comment),
        $._newline,
      ),

    directive: ($) =>
      choice(
        $.account_directive,
        $.commodity_directive,
        $.price_directive,
        $.decimal_mark_directive,
        $.payee_directive,
        $.tag_directive,
        $.include_directive,
      ),

    account_directive: ($) => seq("account", $.account, $._newline),

    commodity_directive: ($) => seq("commodity", $.commodity, $._newline),

    price_directive: ($) => seq("P", $.date, $.commodity, $.amount, $._newline),

    decimal_mark_directive: ($) =>
      seq("decimal-mark", choice(".", ","), $._newline),

    payee_directive: ($) => seq("payee", /[^\r\n]+/, $._newline),

    tag_directive: ($) => seq("tag", /[a-zA-Z][a-zA-Z0-9_-]*/, $._newline),

    include_directive: ($) => seq("include", /[^\r\n]+/, $._newline),

    comment_line: ($) => seq(choice(";", "#"), /[^\r\n]*/, $._newline),

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

    comment: ($) => seq(choice(";", "#"), /[^\r\n]*/),

    account: ($) =>
      choice(
        /[a-zA-Z][a-zA-Z0-9:_-]*/, // regular account
        seq("(", /[a-zA-Z][a-zA-Z0-9:_-]*/, ")"), // virtual account
        seq("[", /[a-zA-Z][a-zA-Z0-9:_-]*/, "]"), // balanced virtual account
      ),

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

    _commodity: ($) =>
      choice(
        /[A-Z]{3,}|\$|€|£|¥|₹|₿/, // Standard commodities
        seq('"', /[^"]+/, '"'), // Quoted commodities like "Chocolate Frogs"
      ),

    _number: ($) => /-?[0-9]+([,.][0-9]+)*/,

    _whitespace: ($) => /[ \t]+/,
    _newline: ($) => /\r?\n/,
  },
});
