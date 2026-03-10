/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "hledger_timeclock",

  extras: () => [/ +/],

  rules: {
    source_file: ($) =>
      repeat(choice($.clock_in, $.clock_out, $.comment_line, $._newline)),

    // i DATETIME [ACCOUNT[  DESCRIPTION]] [; COMMENT]
    clock_in: ($) =>
      seq(
        "i",
        $.datetime,
        optional($.content),
        optional($.comment),
        $._newline,
      ),

    // o DATETIME [ACCOUNT] [; COMMENT]
    clock_out: ($) =>
      seq(
        "o",
        $.datetime,
        optional($.content),
        optional($.comment),
        $._newline,
      ),

    datetime: () =>
      token(seq(/\d{4}[/-]\d{1,2}[/-]\d{1,2}/, / +/, /\d{2}:\d{2}(:\d{2})?/)),

    // Everything between datetime and comment/newline
    content: () => token(prec(-1, /[^\n;]+/)),

    comment: () => token(seq(";", /[^\n]*/)),
    comment_line: ($) => seq(token(seq(/[;#]/, /[^\n]*/)), $._newline),
    _newline: () => /\r?\n/,
  },
});
