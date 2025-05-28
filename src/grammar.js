/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "hledger",

  rules: {
    source_file: ($) =>
      repeat(choice($.transaction, $.periodic_transaction, $.directive, $.comment_line, $._newline)),

    transaction: ($) =>
      seq(
        $.date,
        optional(seq($._whitespace, $.status)),
        optional(seq($._whitespace, $.code)),
        optional(seq($._whitespace, $.description)),
        $._newline,
        repeat($.posting),
      ),

    periodic_transaction: ($) =>
      seq(
        "~",
        optional($._whitespace),
        $.period_expression,
        optional(seq($._whitespace, $.status)),
        optional(seq($._whitespace, $.code)),
        optional(seq($._whitespace, $.description)),
        $._newline,
        repeat($.posting),
      ),

    status: ($) => token(choice("*", "!")),

    code: ($) => token(seq("(", /[^)]*/, ")")),

    date: ($) => /\d{4}[-\/\.]\d{1,2}[-\/\.]\d{1,2}/,

    period_expression: ($) => choice(
      "daily",
      "weekly", 
      "monthly",
      "quarterly",
      "yearly",
      /every \d+ (days?|weeks?|months?|quarters?|years?)/,
      /\d{4}[-\/]\d{1,2}[-\/]\d{1,2}/,  // specific dates
    ),

    description: ($) => token(prec(-1, /[^\r\n;]*/)),

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

    account_directive: ($) =>
      seq("account", $._whitespace, $.account, $._newline),

    commodity_directive: ($) =>
      seq("commodity", $._whitespace, $.commodity, $._newline),

    price_directive: ($) =>
      seq(
        "P",
        $._whitespace,
        $.date,
        $._whitespace,
        $.commodity,
        $._whitespace,
        $.amount,
        $._newline,
      ),

    decimal_mark_directive: ($) =>
      seq("decimal-mark", $._whitespace, choice(".", ","), $._newline),

    payee_directive: ($) =>
      seq("payee", $._whitespace, /[^\r\n]+/, $._newline),

    tag_directive: ($) =>
      seq("tag", $._whitespace, /[a-zA-Z][a-zA-Z0-9_-]*/, $._newline),

    include_directive: ($) =>
      seq("include", $._whitespace, /[^\r\n]+/, $._newline),

    comment_line: ($) => seq(choice(";", "#"), /[^\r\n]*/, $._newline),

    cost_spec: ($) => choice(
      seq("@", optional($._whitespace), $.amount),    // @ $150 (unit price)
      seq("@@", optional($._whitespace), $.amount),   // @@ $1500 (total price)
    ),

    balance_assertion: ($) => choice(
      seq("=", optional($._whitespace), $.amount),    // = $100
      seq("==", optional($._whitespace), $.amount),   // == $100  
    ),

    comment: ($) => seq(choice(";", "#"), /[^\r\n]*/),

    account: ($) => choice(
      /[a-zA-Z][a-zA-Z0-9:_-]*/,           // regular account
      seq("(", /[a-zA-Z][a-zA-Z0-9:_-]*/, ")"),  // virtual account
      seq("[", /[a-zA-Z][a-zA-Z0-9:_-]*/, "]"),  // balanced virtual account
    ),

    amount: ($) =>
      choice(
        // Negative commodity before number: -$100, -€50
        seq("-", $._commodity, $._number),
        // Commodity before number: $100, €50, £25
        seq($._commodity, $._number),
        // Number before commodity: 100 USD, -50.25 EUR
        seq($._number, optional($._whitespace), $._commodity),
        // Number only (assumes default commodity)
        $._number,
      ),

    commodity: ($) => $._commodity,

    _commodity: ($) => choice(
      /[A-Z]{3,}|\$|€|£|¥|₹|₿/,              // Standard commodities
      seq('"', /[^"]+/, '"'),                  // Quoted commodities like "Chocolate Frogs"
    ),

    _number: ($) => /-?[0-9]+([,.][0-9]+)*/,

    _whitespace: ($) => /[ \t]+/,
    _newline: ($) => /\r?\n/,
  },
});
