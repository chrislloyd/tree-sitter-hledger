/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "hledger_timedot",

  extras: () => [/ +/],

  rules: {
    source_file: ($) =>
      repeat(choice($.day, $.comment_line, $._newline)),

    day: ($) =>
      prec.right(seq($.date_header, repeat(choice($.entry, $.comment_line)))),

    date_header: ($) =>
      seq(
        optional(/\*+/),
        $.date,
        optional($.description),
        optional($.comment),
        $._newline,
      ),

    date: () => token(seq(/\d{4}/, /[-./]/, /\d{1,2}/, /[-./]/, /\d{1,2}/)),

    description: () => token(prec(-1, /[^\n;]+/)),

    // Account followed by optional quantity
    entry: ($) =>
      seq(
        $.account,
        optional($.quantity),
        optional($.comment),
        $._newline,
      ),

    account: () => /[^\s;#][^\s]*/,

    quantity: () =>
      token(
        prec(-1, choice(
          /\.+/,              // dots: .... (each dot = 0.25)
          /[a-zA-Z]+/,        // letter dots: aabbaca
          /\d+[.,]\d+h?/,     // decimal: 0.25, 0,25, 1.5h
          /\d+h?/,            // integer hours: 1, 4, 1h
          /\d+m/,             // minutes: 15m, 30m
          /[.,]\d+h?/,        // leading decimal: .25, ,25
        )),
      ),

    comment: () => token(seq(";", /[^\n]*/)),
    comment_line: ($) => seq(token(seq(/[;#*]/, /[^\n]*/)), $._newline),
    _newline: () => /\r?\n/,
  },
});
