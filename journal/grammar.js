/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const WHITESPACE = /[ \t]+/;

module.exports = grammar({
  name: "hledger",

  extras: () => [WHITESPACE],

  externals: ($) => [$.account_name],

  rules: {
    source_file: ($) =>
      repeat(choice($.transaction, $.auto_posting_rule, $.directive, $.comment_block, $.comment_line, $._ignored_line, $._newline)),

    transaction: ($) =>
      seq(
        choice(
          $.date, // fixed
          seq("~", $.interval), // periodic
        ),
        optional($.status),
        optional($.code),
        optional($.description),
        optional($.comment),
        $._newline,
        repeat($.posting),
      ),

    // Auto-posting rules: = QUERY followed by postings
    auto_posting_rule: ($) =>
      seq(
        "=",
        $.query,
        optional($.comment),
        $._newline,
        repeat($.posting),
      ),

    // Query pattern for auto-posting rules
    query: () => token(/[^\r\n;]+/),

    interval: ($) =>
      choice(
        // Simple intervals
        "daily",
        "weekly",
        "monthly",
        "quarterly",
        "yearly",
        // Complex "every ..." patterns (tokenized to capture full pattern)
        $._every_interval,
        // Specific dates
        $.date,
      ),

    // Match entire "every ..." pattern as a token including optional date bounds
    _every_interval: () => {
      const WEEKDAY = /[Mm]onday|[Tt]uesday|[Ww]ednesday|[Tt]hursday|[Ff]riday|[Ss]aturday|[Ss]unday|[Mm]on|[Tt]ue|[Ww]ed|[Tt]hu|[Ff]ri|[Ss]at|[Ss]un/;
      const MONTH = /[Jj]anuary|[Ff]ebruary|[Mm]arch|[Aa]pril|[Mm]ay|[Jj]une|[Jj]uly|[Aa]ugust|[Ss]eptember|[Oo]ctober|[Nn]ovember|[Dd]ecember|[Jj]an|[Ff]eb|[Mm]ar|[Aa]pr|[Jj]un|[Jj]ul|[Aa]ug|[Ss]ep|[Oo]ct|[Nn]ov|[Dd]ec/;
      return token(
        seq(
          "every",
          / +/,
          choice(
            seq(/\d+/, / +/, /(days?|weeks?|months?|quarters?|years?)/),
            seq(/\d+(st|nd|rd|th)/, / +/, "day", optional(seq(/ +/, "of", / +/, "month"))),
            seq(/\d+(st|nd|rd|th)/, / +/, WEEKDAY),
            seq(MONTH, / +/, /\d+(st|nd|rd|th)/),
            seq(/\d+(st|nd|rd|th)/, / +/, MONTH),
            "weekday",
            "weekendday",
            WEEKDAY,
          ),
          // Optional date bounds
          optional(
            seq(
              / +/,
              choice(
                seq("from", / +/, /\d+[-/.]\d+([-/.]\d+)?/, / +/, "to", / +/, /\d+[-/.]\d+([-/.]\d+)?/),
                seq("from", / +/, /\d{4}/, / +/, "to", / +/, /\d{4}/),
                seq("from", / +/, /\d+[-/.]\d+([-/.]\d+)?/),
                seq("from", / +/, /\d{4}/),
                seq("to", / +/, /\d+[-/.]\d+([-/.]\d+)?/),
                seq("to", / +/, /\d{4}/),
              ),
            ),
          ),
        ),
      );
    },

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
          choice(
            seq(
              optional("*"), // multiplier modifier for auto-posting rules
              $.amount,
              optional($.cost_spec),
              optional($.balance_assertion),
            ),
            seq($.cost_spec, optional($.balance_assertion)),
            $.balance_assertion,
          ),
        ),
        optional($.comment),
        $._newline,
      ),

    // Account names can contain single spaces; 2+ spaces ends the name
    account: ($) => $.account_name,

    amount: ($) =>
      choice(
        // Negative commodity before number: -$100, -€50
        seq("-", $._commodity_prefix, $._number),
        // Commodity before number: $100, €50, £25, EUR6024
        seq($._commodity_prefix, $._number),
        // Number before commodity with space: 100 USD, -50.25 EUR
        prec(1, seq($._number, /[ \t]+/, $._commodity)),
        // Number before commodity no space: 1A, 100USD
        seq($._number, $._commodity_suffix),
        // Number only (assumes default commodity)
        $._number,
      ),

    commodity: ($) => $._commodity,

    cost_spec: ($) =>
      seq(
        token(seq(/[ \t]*/, choice("@@", "@"))),
        $.amount,
      ),

    balance_assertion: ($) =>
      seq(
        token(seq(/[ \t]*/, choice("==*", "=*", "==", "="))),
        $.amount,
        optional($.cost_spec),
      ),

    directive: ($) =>
      seq(
        choice(
          seq("account", $.account),
          seq("commodity", optional($._rest_of_line)),
          seq("P", $.date, $.commodity, $.amount),
          seq("decimal-mark", field("mark", choice(".", ","))),
          seq("payee", field("payee", $._rest_of_line)),
          seq("tag", $.account),
          seq("include", $.filepath),
          seq("D", $.amount),
          seq("Y", $._rest_of_line),
          seq("year", $._rest_of_line),
          // Tokenize multi-word directives to avoid _whitespace/extras ambiguity
          seq(token(seq("apply", / +/, "year")), $._rest_of_line),
          seq(token(seq("apply", / +/, "account")), $._rest_of_line),
          token(seq("end", / +/, "apply", / +/, "account")),
          token(seq("end", / +/, "apply", / +/, "year")),
          token(seq("end", / +/, "apply")),
          token(seq("end", / +/, "comment")),
          "end",
          seq("alias", $._rest_of_line),
        ),
        optional($.comment),
        $._newline,
        repeat($._subdirective),
      ),

    _subdirective: ($) => seq($._whitespace, /[^\r\n]*/, $._newline),

    comment_block: ($) =>
      prec.right(seq(
        choice("comment", "test"),
        $._newline,
        repeat(seq(/[^\r\n]*/, $._newline)),
        optional(seq(token(seq("end", / +/, "comment")), $._newline)),
      )),

    comment_line: ($) => prec.right(seq($._comment, optional($._newline))),
    comment: ($) => $._comment,

    // Lines ignored by the parser: legacy directives, embedded timeclock, etc.
    _ignored_line: ($) => seq($._ignored_keyword, optional(/[^\r\n]+/), $._newline, repeat($._subdirective)),
    _ignored_keyword: () => token(choice(
      // Embedded timeclock entries
      seq(/[io]/, / +/),
      // Legacy ledger directives
      "apply fixed", "apply tag", "assert", "bucket",
      /A /, /C /, "capture", "check", "define",
      "end apply fixed", "end apply tag", "end tag",
      "expr", /N /, "value", "python", "eval",
      // Star/percent/pipe comment lines
      "*", "%", "|",
      // Old-style directives with ! prefix
      "!include",
      // Command-line flags (ignored)
      /--[a-z]/,
    )),

    filepath: () =>
      token(
        seq(
          /[^\r\n;#\s]+/, // first path segment (required)
          /([ \t]+[^\r\n;#\s]+)*/, // additional segments with spaces (not newlines)
        ),
      ),

    _rest_of_line: () => /[^\r\n]+/,
    _comment: () => token(seq(/[ \t]*/, /[;#]/, /[^\r\n]*/)),

    // Commodity when followed by number with no space (EUR6024) - letters only
    _commodity_prefix: () =>
      choice(
        // Unicode letter commodities - NO digits (so EUR6024 splits as EUR + 6024)
        token(seq(/[\p{Lu}\p{Lt}]/u, /[\p{L}]*/u)),
        // Currency symbols
        /\$|€|£|¥|₹|₿|元|руб/,
        // Quoted commodities
        token(seq('"', /[^"]+/, '"')),
      ),

    // Commodity when separated by space (100 VTI2, 0.5 h) - allows digits and lowercase
    _commodity: () =>
      choice(
        // Unicode letter commodities (USD, EUR, VTI2, h, etc.)
        token(seq(/[\p{L}]/u, /[\p{L}\p{N}]*/u)),
        // Currency symbols
        /\$|€|£|¥|₹|₿|元|руб/,
        // Quoted commodities like "Chocolate Frogs"
        token(seq('"', /[^"]+/, '"')),
      ),

    // Commodity immediately after number (1A, 100USD, 0.5h) - no leading digit
    _commodity_suffix: () =>
      choice(
        // Letter commodities (A, USD, EUR, h)
        token(seq(/[\p{L}]/u, /[\p{L}]*/u)),
        // Currency symbols
        /\$|€|£|¥|₹|₿|元|руб/,
        // Quoted commodities
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
