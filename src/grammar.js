/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "hledger",

  rules: {
    source_file: ($) =>
      repeat(choice($.transaction, $.directive, $.comment_line, $._newline)),

    transaction: ($) =>
      seq(
        $.date,
        optional(seq($._whitespace, $.status)),
        optional(seq($._whitespace, $.code)),
        optional(seq($._whitespace, $.description)),
        $._newline,
        repeat1($.posting),
      ),

    status: ($) => token(choice("*", "!")),

    code: ($) => token(seq("(", /[^)]*/, ")")),

    date: ($) => /\d{4}[-\/]\d{1,2}[-\/]\d{1,2}/,

    description: ($) => token(prec(-1, /[^\r\n;]*/)),

    posting: ($) =>
      seq(
        $._whitespace,
        choice($.account, $.virtual_account, $.balanced_virtual_account),
        optional($.amount),
        optional($.comment),
        $._newline,
      ),

    virtual_account: ($) => seq("(", $.account, ")"),

    balanced_virtual_account: ($) => seq("[", $.account, "]"),

    directive: ($) =>
      choice($.account_directive, $.commodity_directive, $.price_directive),

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

    comment_line: ($) => seq(";", /[^\r\n]*/, $._newline),

    comment: ($) => seq(";", /[^\r\n]*/),

    account: ($) => /[a-zA-Z][a-zA-Z0-9:_-]*/,

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

    _commodity: ($) => /[A-Z]{3,}|\$|€|£|¥|₹|₿/,

    _number: ($) => /[0-9]+([,.][0-9]+)*/,

    _whitespace: ($) => /[ \t]+/,
    _newline: ($) => /\r?\n/,
  },
});
