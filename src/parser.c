#include <tree_sitter/parser.h>

#if defined(__GNUC__) || defined(__clang__)
#pragma GCC diagnostic push
#pragma GCC diagnostic ignored "-Wmissing-field-initializers"
#endif

#define LANGUAGE_VERSION 10
#define STATE_COUNT 49
#define SYMBOL_COUNT 32
#define ALIAS_COUNT 0
#define TOKEN_COUNT 18
#define EXTERNAL_TOKEN_COUNT 0
#define FIELD_COUNT 0
#define MAX_ALIAS_SEQUENCE_LENGTH 5

enum {
  anon_sym_LF = 1,
  aux_sym__entry_token1 = 2,
  anon_sym_DASH = 3,
  anon_sym_SLASH = 4,
  anon_sym_DOT = 5,
  sym_year = 6,
  aux_sym_month_token1 = 7,
  sym_payee = 8,
  aux_sym_postings_token1 = 9,
  anon_sym_ = 10,
  aux_sym_posting_token1 = 11,
  anon_sym_STAR = 12,
  anon_sym_BANG = 13,
  anon_sym_COLON = 14,
  sym__part = 15,
  sym_commodity = 16,
  sym_quantity = 17,
  sym_source_file = 18,
  sym_transaction = 19,
  sym__entry = 20,
  sym_date = 21,
  sym_month = 22,
  sym_day = 23,
  sym_postings = 24,
  sym_posting = 25,
  sym_status = 26,
  sym_account = 27,
  sym_amount = 28,
  aux_sym_source_file_repeat1 = 29,
  aux_sym_postings_repeat1 = 30,
  aux_sym_account_repeat1 = 31,
};

static const char *ts_symbol_names[] = {
  [ts_builtin_sym_end] = "end",
  [anon_sym_LF] = "\n",
  [aux_sym__entry_token1] = "_entry_token1",
  [anon_sym_DASH] = "-",
  [anon_sym_SLASH] = "/",
  [anon_sym_DOT] = ".",
  [sym_year] = "year",
  [aux_sym_month_token1] = "month_token1",
  [sym_payee] = "payee",
  [aux_sym_postings_token1] = "postings_token1",
  [anon_sym_] = " ",
  [aux_sym_posting_token1] = "posting_token1",
  [anon_sym_STAR] = "*",
  [anon_sym_BANG] = "!",
  [anon_sym_COLON] = ":",
  [sym__part] = "_part",
  [sym_commodity] = "commodity",
  [sym_quantity] = "quantity",
  [sym_source_file] = "source_file",
  [sym_transaction] = "transaction",
  [sym__entry] = "_entry",
  [sym_date] = "date",
  [sym_month] = "month",
  [sym_day] = "day",
  [sym_postings] = "postings",
  [sym_posting] = "posting",
  [sym_status] = "status",
  [sym_account] = "account",
  [sym_amount] = "amount",
  [aux_sym_source_file_repeat1] = "source_file_repeat1",
  [aux_sym_postings_repeat1] = "postings_repeat1",
  [aux_sym_account_repeat1] = "account_repeat1",
};

static const TSSymbolMetadata ts_symbol_metadata[] = {
  [ts_builtin_sym_end] = {
    .visible = false,
    .named = true,
  },
  [anon_sym_LF] = {
    .visible = true,
    .named = false,
  },
  [aux_sym__entry_token1] = {
    .visible = false,
    .named = false,
  },
  [anon_sym_DASH] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_SLASH] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_DOT] = {
    .visible = true,
    .named = false,
  },
  [sym_year] = {
    .visible = true,
    .named = true,
  },
  [aux_sym_month_token1] = {
    .visible = false,
    .named = false,
  },
  [sym_payee] = {
    .visible = true,
    .named = true,
  },
  [aux_sym_postings_token1] = {
    .visible = false,
    .named = false,
  },
  [anon_sym_] = {
    .visible = true,
    .named = false,
  },
  [aux_sym_posting_token1] = {
    .visible = false,
    .named = false,
  },
  [anon_sym_STAR] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_BANG] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_COLON] = {
    .visible = true,
    .named = false,
  },
  [sym__part] = {
    .visible = false,
    .named = true,
  },
  [sym_commodity] = {
    .visible = true,
    .named = true,
  },
  [sym_quantity] = {
    .visible = true,
    .named = true,
  },
  [sym_source_file] = {
    .visible = true,
    .named = true,
  },
  [sym_transaction] = {
    .visible = true,
    .named = true,
  },
  [sym__entry] = {
    .visible = false,
    .named = true,
  },
  [sym_date] = {
    .visible = true,
    .named = true,
  },
  [sym_month] = {
    .visible = true,
    .named = true,
  },
  [sym_day] = {
    .visible = true,
    .named = true,
  },
  [sym_postings] = {
    .visible = true,
    .named = true,
  },
  [sym_posting] = {
    .visible = true,
    .named = true,
  },
  [sym_status] = {
    .visible = true,
    .named = true,
  },
  [sym_account] = {
    .visible = true,
    .named = true,
  },
  [sym_amount] = {
    .visible = true,
    .named = true,
  },
  [aux_sym_source_file_repeat1] = {
    .visible = false,
    .named = false,
  },
  [aux_sym_postings_repeat1] = {
    .visible = false,
    .named = false,
  },
  [aux_sym_account_repeat1] = {
    .visible = false,
    .named = false,
  },
};

static TSSymbol ts_alias_sequences[1][MAX_ALIAS_SEQUENCE_LENGTH] = {
  [0] = {0},
};

static bool ts_lex(TSLexer *lexer, TSStateId state) {
  START_LEXER();
  switch (state) {
    case 0:
      if (lookahead == 0) ADVANCE(18);
      if (lookahead == '!') ADVANCE(38);
      if (lookahead == '*') ADVANCE(36);
      if (lookahead == '-') ADVANCE(24);
      if (lookahead == '.') ADVANCE(26);
      if (lookahead == '/') ADVANCE(25);
      if (lookahead == ':') ADVANCE(40);
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\r' ||
          lookahead == ' ') SKIP(0)
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(15);
      END_STATE();
    case 1:
      if (lookahead == 0) ADVANCE(18);
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\r' ||
          lookahead == ' ') ADVANCE(33);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(15);
      END_STATE();
    case 2:
      if (lookahead == '\n') ADVANCE(19);
      if (lookahead == '!') ADVANCE(39);
      if (lookahead == '*') ADVANCE(37);
      if (lookahead == '\t' ||
          lookahead == '\r' ||
          lookahead == ' ') ADVANCE(30);
      if (lookahead != 0 &&
          lookahead != ';') ADVANCE(32);
      END_STATE();
    case 3:
      if (lookahead == '\n') ADVANCE(20);
      if (lookahead == '\t' ||
          lookahead == '\r' ||
          lookahead == ' ') SKIP(3)
      END_STATE();
    case 4:
      if (lookahead == '\n') ADVANCE(21);
      if (lookahead == ':') ADVANCE(40);
      if (lookahead == '\t' ||
          lookahead == '\r' ||
          lookahead == ' ') ADVANCE(35);
      END_STATE();
    case 5:
      if (lookahead == '\n') ADVANCE(21);
      if (lookahead == ':') ADVANCE(40);
      if (lookahead == '\t' ||
          lookahead == '\r' ||
          lookahead == ' ') ADVANCE(4);
      END_STATE();
    case 6:
      if (lookahead == '\n') ADVANCE(22);
      if (lookahead == '\t' ||
          lookahead == '\r' ||
          lookahead == ' ') ADVANCE(31);
      if (lookahead != 0 &&
          lookahead != ';') ADVANCE(32);
      END_STATE();
    case 7:
      if (lookahead == ' ') ADVANCE(34);
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\r') SKIP(7)
      END_STATE();
    case 8:
      if (lookahead == '!') ADVANCE(38);
      if (lookahead == '*') ADVANCE(36);
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\r' ||
          lookahead == ' ') SKIP(8)
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(41);
      END_STATE();
    case 9:
      if (lookahead == '0') ADVANCE(43);
      END_STATE();
    case 10:
      if (lookahead == '0') ADVANCE(9);
      END_STATE();
    case 11:
      if (lookahead == '1') ADVANCE(10);
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\r' ||
          lookahead == ' ') SKIP(11)
      END_STATE();
    case 12:
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\r' ||
          lookahead == ' ') SKIP(12)
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(17);
      END_STATE();
    case 13:
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\r' ||
          lookahead == ' ') SKIP(13)
      if (lookahead == '$' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(42);
      END_STATE();
    case 14:
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\r' ||
          lookahead == ' ') ADVANCE(23);
      END_STATE();
    case 15:
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(29);
      END_STATE();
    case 16:
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(27);
      END_STATE();
    case 17:
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(28);
      END_STATE();
    case 18:
      ACCEPT_TOKEN(ts_builtin_sym_end);
      END_STATE();
    case 19:
      ACCEPT_TOKEN(anon_sym_LF);
      if (lookahead == '\n') ADVANCE(19);
      if (lookahead == '\t' ||
          lookahead == '\r' ||
          lookahead == ' ') ADVANCE(30);
      END_STATE();
    case 20:
      ACCEPT_TOKEN(anon_sym_LF);
      if (lookahead == '\n') ADVANCE(20);
      END_STATE();
    case 21:
      ACCEPT_TOKEN(anon_sym_LF);
      if (lookahead == '\n') ADVANCE(21);
      if (lookahead == '\t' ||
          lookahead == '\r' ||
          lookahead == ' ') ADVANCE(35);
      END_STATE();
    case 22:
      ACCEPT_TOKEN(anon_sym_LF);
      if (lookahead == '\n') ADVANCE(22);
      if (lookahead == '\t' ||
          lookahead == '\r' ||
          lookahead == ' ') ADVANCE(31);
      END_STATE();
    case 23:
      ACCEPT_TOKEN(aux_sym__entry_token1);
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\r' ||
          lookahead == ' ') ADVANCE(23);
      END_STATE();
    case 24:
      ACCEPT_TOKEN(anon_sym_DASH);
      END_STATE();
    case 25:
      ACCEPT_TOKEN(anon_sym_SLASH);
      END_STATE();
    case 26:
      ACCEPT_TOKEN(anon_sym_DOT);
      END_STATE();
    case 27:
      ACCEPT_TOKEN(sym_year);
      END_STATE();
    case 28:
      ACCEPT_TOKEN(aux_sym_month_token1);
      END_STATE();
    case 29:
      ACCEPT_TOKEN(aux_sym_month_token1);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(16);
      END_STATE();
    case 30:
      ACCEPT_TOKEN(sym_payee);
      if (lookahead == '\n') ADVANCE(19);
      if (lookahead == '!') ADVANCE(39);
      if (lookahead == '*') ADVANCE(37);
      if (lookahead == '\t' ||
          lookahead == '\r' ||
          lookahead == ' ') ADVANCE(30);
      if (lookahead != 0 &&
          lookahead != ';') ADVANCE(32);
      END_STATE();
    case 31:
      ACCEPT_TOKEN(sym_payee);
      if (lookahead == '\n') ADVANCE(22);
      if (lookahead == '\t' ||
          lookahead == '\r' ||
          lookahead == ' ') ADVANCE(31);
      if (lookahead != 0 &&
          lookahead != ';') ADVANCE(32);
      END_STATE();
    case 32:
      ACCEPT_TOKEN(sym_payee);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != ';') ADVANCE(32);
      END_STATE();
    case 33:
      ACCEPT_TOKEN(aux_sym_postings_token1);
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\r' ||
          lookahead == ' ') ADVANCE(33);
      END_STATE();
    case 34:
      ACCEPT_TOKEN(anon_sym_);
      if (lookahead == ' ') ADVANCE(34);
      END_STATE();
    case 35:
      ACCEPT_TOKEN(aux_sym_posting_token1);
      if (lookahead == '\n') ADVANCE(21);
      if (lookahead == '\t' ||
          lookahead == '\r' ||
          lookahead == ' ') ADVANCE(35);
      END_STATE();
    case 36:
      ACCEPT_TOKEN(anon_sym_STAR);
      END_STATE();
    case 37:
      ACCEPT_TOKEN(anon_sym_STAR);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != ';') ADVANCE(32);
      END_STATE();
    case 38:
      ACCEPT_TOKEN(anon_sym_BANG);
      END_STATE();
    case 39:
      ACCEPT_TOKEN(anon_sym_BANG);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != ';') ADVANCE(32);
      END_STATE();
    case 40:
      ACCEPT_TOKEN(anon_sym_COLON);
      END_STATE();
    case 41:
      ACCEPT_TOKEN(sym__part);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(41);
      END_STATE();
    case 42:
      ACCEPT_TOKEN(sym_commodity);
      if (lookahead == '$' ||
          ('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'Z') ||
          lookahead == '_' ||
          ('a' <= lookahead && lookahead <= 'z')) ADVANCE(42);
      END_STATE();
    case 43:
      ACCEPT_TOKEN(sym_quantity);
      END_STATE();
    default:
      return false;
  }
}

static TSLexMode ts_lex_modes[STATE_COUNT] = {
  [0] = {.lex_state = 0},
  [1] = {.lex_state = 0},
  [2] = {.lex_state = 0},
  [3] = {.lex_state = 0},
  [4] = {.lex_state = 8},
  [5] = {.lex_state = 2},
  [6] = {.lex_state = 1},
  [7] = {.lex_state = 1},
  [8] = {.lex_state = 5},
  [9] = {.lex_state = 1},
  [10] = {.lex_state = 5},
  [11] = {.lex_state = 2},
  [12] = {.lex_state = 5},
  [13] = {.lex_state = 2},
  [14] = {.lex_state = 2},
  [15] = {.lex_state = 1},
  [16] = {.lex_state = 0},
  [17] = {.lex_state = 0},
  [18] = {.lex_state = 5},
  [19] = {.lex_state = 0},
  [20] = {.lex_state = 0},
  [21] = {.lex_state = 6},
  [22] = {.lex_state = 12},
  [23] = {.lex_state = 13},
  [24] = {.lex_state = 5},
  [25] = {.lex_state = 12},
  [26] = {.lex_state = 12},
  [27] = {.lex_state = 12},
  [28] = {.lex_state = 12},
  [29] = {.lex_state = 13},
  [30] = {.lex_state = 8},
  [31] = {.lex_state = 5},
  [32] = {.lex_state = 14},
  [33] = {.lex_state = 3},
  [34] = {.lex_state = 0},
  [35] = {.lex_state = 8},
  [36] = {.lex_state = 3},
  [37] = {.lex_state = 0},
  [38] = {.lex_state = 0},
  [39] = {.lex_state = 7},
  [40] = {.lex_state = 0},
  [41] = {.lex_state = 3},
  [42] = {.lex_state = 3},
  [43] = {.lex_state = 11},
  [44] = {.lex_state = 3},
  [45] = {.lex_state = 14},
  [46] = {.lex_state = 3},
  [47] = {.lex_state = 3},
  [48] = {.lex_state = 7},
};

static uint16_t ts_parse_table[STATE_COUNT][SYMBOL_COUNT] = {
  [0] = {
    [ts_builtin_sym_end] = ACTIONS(1),
    [anon_sym_DASH] = ACTIONS(1),
    [anon_sym_SLASH] = ACTIONS(1),
    [anon_sym_DOT] = ACTIONS(1),
    [sym_year] = ACTIONS(1),
    [aux_sym_month_token1] = ACTIONS(1),
    [anon_sym_STAR] = ACTIONS(1),
    [anon_sym_BANG] = ACTIONS(1),
    [anon_sym_COLON] = ACTIONS(1),
  },
  [1] = {
    [sym_source_file] = STATE(37),
    [sym_transaction] = STATE(3),
    [sym__entry] = STATE(36),
    [sym_date] = STATE(5),
    [sym_month] = STATE(19),
    [aux_sym_source_file_repeat1] = STATE(3),
    [sym_year] = ACTIONS(3),
    [aux_sym_month_token1] = ACTIONS(5),
  },
  [2] = {
    [sym_transaction] = STATE(2),
    [sym__entry] = STATE(36),
    [sym_date] = STATE(5),
    [sym_month] = STATE(19),
    [aux_sym_source_file_repeat1] = STATE(2),
    [ts_builtin_sym_end] = ACTIONS(7),
    [sym_year] = ACTIONS(9),
    [aux_sym_month_token1] = ACTIONS(12),
  },
  [3] = {
    [sym_transaction] = STATE(2),
    [sym__entry] = STATE(36),
    [sym_date] = STATE(5),
    [sym_month] = STATE(19),
    [aux_sym_source_file_repeat1] = STATE(2),
    [ts_builtin_sym_end] = ACTIONS(15),
    [sym_year] = ACTIONS(3),
    [aux_sym_month_token1] = ACTIONS(5),
  },
  [4] = {
    [sym_posting] = STATE(41),
    [sym_status] = STATE(39),
    [sym_account] = STATE(31),
    [anon_sym_STAR] = ACTIONS(17),
    [anon_sym_BANG] = ACTIONS(17),
    [sym__part] = ACTIONS(19),
  },
  [5] = {
    [sym_status] = STATE(32),
    [anon_sym_LF] = ACTIONS(21),
    [sym_payee] = ACTIONS(23),
    [anon_sym_STAR] = ACTIONS(25),
    [anon_sym_BANG] = ACTIONS(25),
  },
  [6] = {
    [aux_sym_postings_repeat1] = STATE(6),
    [ts_builtin_sym_end] = ACTIONS(27),
    [sym_year] = ACTIONS(29),
    [aux_sym_month_token1] = ACTIONS(29),
    [aux_sym_postings_token1] = ACTIONS(31),
  },
  [7] = {
    [aux_sym_postings_repeat1] = STATE(6),
    [ts_builtin_sym_end] = ACTIONS(34),
    [sym_year] = ACTIONS(36),
    [aux_sym_month_token1] = ACTIONS(36),
    [aux_sym_postings_token1] = ACTIONS(38),
  },
  [8] = {
    [aux_sym_account_repeat1] = STATE(8),
    [anon_sym_LF] = ACTIONS(40),
    [aux_sym_posting_token1] = ACTIONS(40),
    [anon_sym_COLON] = ACTIONS(42),
  },
  [9] = {
    [ts_builtin_sym_end] = ACTIONS(45),
    [sym_year] = ACTIONS(47),
    [aux_sym_month_token1] = ACTIONS(47),
    [aux_sym_postings_token1] = ACTIONS(45),
  },
  [10] = {
    [aux_sym_account_repeat1] = STATE(8),
    [anon_sym_LF] = ACTIONS(49),
    [aux_sym_posting_token1] = ACTIONS(49),
    [anon_sym_COLON] = ACTIONS(51),
  },
  [11] = {
    [anon_sym_LF] = ACTIONS(53),
    [sym_payee] = ACTIONS(53),
    [anon_sym_STAR] = ACTIONS(53),
    [anon_sym_BANG] = ACTIONS(53),
  },
  [12] = {
    [aux_sym_account_repeat1] = STATE(10),
    [anon_sym_LF] = ACTIONS(55),
    [aux_sym_posting_token1] = ACTIONS(55),
    [anon_sym_COLON] = ACTIONS(51),
  },
  [13] = {
    [anon_sym_LF] = ACTIONS(57),
    [sym_payee] = ACTIONS(57),
    [anon_sym_STAR] = ACTIONS(57),
    [anon_sym_BANG] = ACTIONS(57),
  },
  [14] = {
    [anon_sym_LF] = ACTIONS(59),
    [sym_payee] = ACTIONS(59),
    [anon_sym_STAR] = ACTIONS(59),
    [anon_sym_BANG] = ACTIONS(59),
  },
  [15] = {
    [sym_postings] = STATE(20),
    [aux_sym_postings_repeat1] = STATE(7),
    [aux_sym_postings_token1] = ACTIONS(38),
  },
  [16] = {
    [anon_sym_DASH] = ACTIONS(61),
    [anon_sym_SLASH] = ACTIONS(63),
    [anon_sym_DOT] = ACTIONS(65),
  },
  [17] = {
    [anon_sym_DASH] = ACTIONS(67),
    [anon_sym_SLASH] = ACTIONS(67),
    [anon_sym_DOT] = ACTIONS(67),
  },
  [18] = {
    [anon_sym_LF] = ACTIONS(40),
    [aux_sym_posting_token1] = ACTIONS(40),
    [anon_sym_COLON] = ACTIONS(40),
  },
  [19] = {
    [anon_sym_DASH] = ACTIONS(69),
    [anon_sym_SLASH] = ACTIONS(69),
    [anon_sym_DOT] = ACTIONS(69),
  },
  [20] = {
    [ts_builtin_sym_end] = ACTIONS(71),
    [sym_year] = ACTIONS(71),
    [aux_sym_month_token1] = ACTIONS(73),
  },
  [21] = {
    [anon_sym_LF] = ACTIONS(75),
    [sym_payee] = ACTIONS(77),
  },
  [22] = {
    [sym_month] = STATE(40),
    [aux_sym_month_token1] = ACTIONS(79),
  },
  [23] = {
    [sym_amount] = STATE(47),
    [sym_commodity] = ACTIONS(81),
  },
  [24] = {
    [anon_sym_LF] = ACTIONS(83),
    [aux_sym_posting_token1] = ACTIONS(85),
  },
  [25] = {
    [sym_day] = STATE(13),
    [aux_sym_month_token1] = ACTIONS(87),
  },
  [26] = {
    [sym_month] = STATE(38),
    [aux_sym_month_token1] = ACTIONS(79),
  },
  [27] = {
    [sym_day] = STATE(11),
    [aux_sym_month_token1] = ACTIONS(87),
  },
  [28] = {
    [sym_month] = STATE(34),
    [aux_sym_month_token1] = ACTIONS(79),
  },
  [29] = {
    [sym_amount] = STATE(44),
    [sym_commodity] = ACTIONS(81),
  },
  [30] = {
    [sym_account] = STATE(24),
    [sym__part] = ACTIONS(19),
  },
  [31] = {
    [anon_sym_LF] = ACTIONS(89),
    [aux_sym_posting_token1] = ACTIONS(91),
  },
  [32] = {
    [aux_sym__entry_token1] = ACTIONS(93),
  },
  [33] = {
    [anon_sym_LF] = ACTIONS(95),
  },
  [34] = {
    [anon_sym_SLASH] = ACTIONS(97),
  },
  [35] = {
    [sym__part] = ACTIONS(99),
  },
  [36] = {
    [anon_sym_LF] = ACTIONS(101),
  },
  [37] = {
    [ts_builtin_sym_end] = ACTIONS(103),
  },
  [38] = {
    [anon_sym_DOT] = ACTIONS(97),
  },
  [39] = {
    [anon_sym_] = ACTIONS(105),
  },
  [40] = {
    [anon_sym_DASH] = ACTIONS(97),
  },
  [41] = {
    [anon_sym_LF] = ACTIONS(107),
  },
  [42] = {
    [anon_sym_LF] = ACTIONS(109),
  },
  [43] = {
    [sym_quantity] = ACTIONS(111),
  },
  [44] = {
    [anon_sym_LF] = ACTIONS(113),
  },
  [45] = {
    [aux_sym__entry_token1] = ACTIONS(115),
  },
  [46] = {
    [anon_sym_LF] = ACTIONS(117),
  },
  [47] = {
    [anon_sym_LF] = ACTIONS(119),
  },
  [48] = {
    [anon_sym_] = ACTIONS(115),
  },
};

static TSParseActionEntry ts_parse_actions[] = {
  [0] = {.count = 0, .reusable = false},
  [1] = {.count = 1, .reusable = false}, RECOVER(),
  [3] = {.count = 1, .reusable = true}, SHIFT(16),
  [5] = {.count = 1, .reusable = false}, SHIFT(17),
  [7] = {.count = 1, .reusable = true}, REDUCE(aux_sym_source_file_repeat1, 2),
  [9] = {.count = 2, .reusable = true}, REDUCE(aux_sym_source_file_repeat1, 2), SHIFT_REPEAT(16),
  [12] = {.count = 2, .reusable = false}, REDUCE(aux_sym_source_file_repeat1, 2), SHIFT_REPEAT(17),
  [15] = {.count = 1, .reusable = true}, REDUCE(sym_source_file, 1),
  [17] = {.count = 1, .reusable = true}, SHIFT(48),
  [19] = {.count = 1, .reusable = true}, SHIFT(12),
  [21] = {.count = 1, .reusable = false}, REDUCE(sym__entry, 1),
  [23] = {.count = 1, .reusable = false}, SHIFT(42),
  [25] = {.count = 1, .reusable = false}, SHIFT(45),
  [27] = {.count = 1, .reusable = true}, REDUCE(aux_sym_postings_repeat1, 2),
  [29] = {.count = 1, .reusable = false}, REDUCE(aux_sym_postings_repeat1, 2),
  [31] = {.count = 2, .reusable = true}, REDUCE(aux_sym_postings_repeat1, 2), SHIFT_REPEAT(4),
  [34] = {.count = 1, .reusable = true}, REDUCE(sym_postings, 1),
  [36] = {.count = 1, .reusable = false}, REDUCE(sym_postings, 1),
  [38] = {.count = 1, .reusable = true}, SHIFT(4),
  [40] = {.count = 1, .reusable = false}, REDUCE(aux_sym_account_repeat1, 2),
  [42] = {.count = 2, .reusable = false}, REDUCE(aux_sym_account_repeat1, 2), SHIFT_REPEAT(35),
  [45] = {.count = 1, .reusable = true}, REDUCE(aux_sym_postings_repeat1, 3),
  [47] = {.count = 1, .reusable = false}, REDUCE(aux_sym_postings_repeat1, 3),
  [49] = {.count = 1, .reusable = false}, REDUCE(sym_account, 2),
  [51] = {.count = 1, .reusable = false}, SHIFT(35),
  [53] = {.count = 1, .reusable = false}, REDUCE(sym_date, 5),
  [55] = {.count = 1, .reusable = false}, REDUCE(sym_account, 1),
  [57] = {.count = 1, .reusable = false}, REDUCE(sym_date, 3),
  [59] = {.count = 1, .reusable = false}, REDUCE(sym_day, 1),
  [61] = {.count = 1, .reusable = true}, SHIFT(22),
  [63] = {.count = 1, .reusable = true}, SHIFT(28),
  [65] = {.count = 1, .reusable = true}, SHIFT(26),
  [67] = {.count = 1, .reusable = true}, REDUCE(sym_month, 1),
  [69] = {.count = 1, .reusable = true}, SHIFT(25),
  [71] = {.count = 1, .reusable = true}, REDUCE(sym_transaction, 3),
  [73] = {.count = 1, .reusable = false}, REDUCE(sym_transaction, 3),
  [75] = {.count = 1, .reusable = false}, REDUCE(sym__entry, 3),
  [77] = {.count = 1, .reusable = false}, SHIFT(33),
  [79] = {.count = 1, .reusable = true}, SHIFT(17),
  [81] = {.count = 1, .reusable = true}, SHIFT(43),
  [83] = {.count = 1, .reusable = false}, REDUCE(sym_posting, 3),
  [85] = {.count = 1, .reusable = false}, SHIFT(23),
  [87] = {.count = 1, .reusable = true}, SHIFT(14),
  [89] = {.count = 1, .reusable = false}, REDUCE(sym_posting, 1),
  [91] = {.count = 1, .reusable = false}, SHIFT(29),
  [93] = {.count = 1, .reusable = true}, SHIFT(21),
  [95] = {.count = 1, .reusable = true}, REDUCE(sym__entry, 4),
  [97] = {.count = 1, .reusable = true}, SHIFT(27),
  [99] = {.count = 1, .reusable = true}, SHIFT(18),
  [101] = {.count = 1, .reusable = true}, SHIFT(15),
  [103] = {.count = 1, .reusable = true},  ACCEPT_INPUT(),
  [105] = {.count = 1, .reusable = true}, SHIFT(30),
  [107] = {.count = 1, .reusable = true}, SHIFT(9),
  [109] = {.count = 1, .reusable = true}, REDUCE(sym__entry, 2),
  [111] = {.count = 1, .reusable = true}, SHIFT(46),
  [113] = {.count = 1, .reusable = true}, REDUCE(sym_posting, 3),
  [115] = {.count = 1, .reusable = true}, REDUCE(sym_status, 1),
  [117] = {.count = 1, .reusable = true}, REDUCE(sym_amount, 2),
  [119] = {.count = 1, .reusable = true}, REDUCE(sym_posting, 5),
};

#ifdef _WIN32
#define extern __declspec(dllexport)
#endif

extern const TSLanguage *tree_sitter_hledger(void) {
  static TSLanguage language = {
    .version = LANGUAGE_VERSION,
    .symbol_count = SYMBOL_COUNT,
    .alias_count = ALIAS_COUNT,
    .token_count = TOKEN_COUNT,
    .symbol_metadata = ts_symbol_metadata,
    .parse_table = (const unsigned short *)ts_parse_table,
    .parse_actions = ts_parse_actions,
    .lex_modes = ts_lex_modes,
    .symbol_names = ts_symbol_names,
    .alias_sequences = (const TSSymbol *)ts_alias_sequences,
    .field_count = FIELD_COUNT,
    .max_alias_sequence_length = MAX_ALIAS_SEQUENCE_LENGTH,
    .lex_fn = ts_lex,
    .external_token_count = EXTERNAL_TOKEN_COUNT,
  };
  return &language;
}
