; Keywords and directives
[
  "account"
  "commodity"
  "P"
  "include"
  "alias"
  "payee"
  "tag"
  "decimal-mark"
] @keyword

; Date components
(date) @constant.numeric.date

; Transaction status markers
(status) @attribute

; Transaction code (in parentheses)
(code) @string.special

; Description/payee text
(description) @string

; Account names
(account) @variable

; Virtual accounts (in parentheses or brackets)
(posting (account) @variable.special
  (#match? @variable.special "^\\(.*\\)$"))
(posting (account) @variable.special
  (#match? @variable.special "^\\[.*\\]$"))

; Amounts and numbers
(amount) @constant.numeric

; Commodities (currency symbols and codes)
(commodity) @type

; Comments
[
  (comment)
  (comment_line)
] @comment

; Balance assertions
(balance_assertion) @operator
(balance_assertion (amount) @constant.numeric)

; Cost/price specifications
(cost_spec) @operator
(cost_spec (amount) @constant.numeric)

; Periodic transaction marker and intervals
"~" @keyword.repeat
[
  "daily"
  "weekly"
  "monthly"
  "quarterly"
  "yearly"
] @keyword.repeat

; Operators
[
  "="
  "=="
  "@"
  "@@"
] @operator

; Punctuation
[
  "("
  ")"
  "["
  "]"
] @punctuation.bracket

";" @punctuation.delimiter
"#" @punctuation.delimiter

; Error nodes
(ERROR) @error