module.exports = grammar({
  name: "hledger",

  rules: {
    source_file: $ => repeat1($.transaction),

    transaction: $ => seq($._entry, "\n", $.postings),

    _entry: $ => seq($.date, optional(seq($.status, /\s+/)), optional($.payee)),

    date: $ => {
      function createDate(separator) {
        return seq(optional(seq($.year, separator)), $.month, separator, $.day);
      }
      return choice(createDate("-"), createDate("/"), createDate("."));
    },
    year: $ => /\d{4}/,
    month: $ => /\d{2}/,
    day: $ => /\d{2}/,

    payee: $ => /[^\n;]+/,

    postings: $ => repeat1(seq(/\s{1,}/, $.posting, "\n")),
    posting: $ =>
      seq(
        optional(seq($.status, " ")),
        $.account,
        optional(seq(/\s{2,}/, $.amount))
      ),

    status: $ => choice("*", "!"),

    account: $ => seq($._part, repeat(seq(":", $._part))),
    _part: $ => /\w+/,

    amount: $ => seq($.commodity, $.quantity),

    // choice(
    //   $.quantity,
    //   seq($.commodity, $.quantity), // left commodity
    //   seq($.quantity, $.commodity) // right commodity
    // ),

    commodity: $ => /[\w\$]+/,
    quantity: $ => "100"
  }
});
