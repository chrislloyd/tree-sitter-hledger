/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "hledger",

  rules: {
    source_file: ($) => repeat(choice($.transaction, "\n", $.comment)),

    transaction: ($) => seq($.entry, repeat1(seq(/\s{1,}/, $.posting, "\n"))),

    entry: ($) =>
      seq(
        $.date,
        optional(seq(/\s*/, $.status)),
        optional($.payee),
        optional(seq(/\s*/, $.comment)),
      ),

    date: ($) => {
      function createDate(separator) {
        return seq(optional(seq($.year, separator)), $.month, separator, $.day);
      }
      return choice(createDate("-"), createDate("/"), createDate("."));
    },
    year: ($) => /\d{4}/,
    month: ($) => /\d{2}/,
    day: ($) => /\d{2}/,

    payee: ($) => /[^\n;]+/,

    posting: ($) =>
      seq(
        optional(seq($.status, " ")),
        $.account,
        optional(seq(/\s{2,}/, $.amount)),
      ),

    status: ($) => choice("*", "!"),

    account: ($) => seq($._accountPart, repeat(seq(":", $._accountPart))),
    _accountPart: ($) => /\w+/,

    amount: ($) => seq($.commodity, $.quantity),

    // choice(
    //   $.quantity,
    //   seq($.commodity, $.quantity), // left commodity
    //   seq($.quantity, $.commodity) // right commodity
    // ),

    commodity: ($) => /[\w\$]+/,
    quantity: ($) => /\d+/,

    comment: ($) => seq(";", /[^\n]*/),
  },
});
