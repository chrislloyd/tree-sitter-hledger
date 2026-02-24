#!/usr/bin/env node

const { execSync, spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

// --

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const maybe = (fn, prob = 0.5) => (Math.random() < prob ? fn() : "");
const times = (n, fn) => Array.from({ length: n }, (_, i) => fn(i));

// --

function randomDate() {
  const year = 2020 + Math.floor(Math.random() * 5);
  const month = String(1 + Math.floor(Math.random() * 12)).padStart(2, "0");
  const day = String(1 + Math.floor(Math.random() * 28)).padStart(2, "0");
  const sep = pick(["-", "/", "."]);
  return `${year}${sep}${month}${sep}${day}`;
}

function randomAccountName() {
  const segments = [
    ["assets", "liabilities", "expenses", "income", "equity"],
    ["checking", "savings", "cash", "credit", "food", "rent", "salary"],
    ["bank", "groceries", "utilities", "transport", "entertainment"],
  ];
  const depth = 1 + Math.floor(Math.random() * 3);
  return times(depth, (i) => pick(segments[Math.min(i, segments.length - 1)])).join(":");
}

function randomCommodity() {
  return pick(["$", "€", "£", "¥", "USD", "EUR", "GBP", "BTC", "VTI", '"VTSAX"', ""]);
}

function randomNumber() {
  const format = pick(["simple", "thousands", "european", "scientific"]);
  const negative = maybe(() => "-", 0.2);

  switch (format) {
    case "thousands": {
      const n = Math.floor(Math.random() * 10000000);
      const formatted = n.toLocaleString("en-US");
      const decimal = maybe(() => "." + String(Math.floor(Math.random() * 100)).padStart(2, "0"), 0.3);
      return `${negative}${formatted}${decimal}`;
    }
    case "european": {
      const n = Math.floor(Math.random() * 10000);
      const decimal = maybe(() => "," + String(Math.floor(Math.random() * 100)).padStart(2, "0"), 0.3);
      return `${negative}${n}${decimal}`;
    }
    case "scientific": {
      const mantissa = (Math.random() * 10).toFixed(2);
      const exp = Math.floor(Math.random() * 6) - 2;
      return `${negative}${mantissa}e${exp}`;
    }
    default: {
      const integer = Math.floor(Math.random() * 10000);
      const decimal = maybe(() => "." + String(Math.floor(Math.random() * 100)).padStart(2, "0"), 0.5);
      return `${negative}${integer}${decimal}`;
    }
  }
}

function randomAmount() {
  const commodity = randomCommodity();
  const number = randomNumber();

  if (!commodity) return number;

  // commodity before or after number
  if (Math.random() < 0.5) {
    return `${commodity}${number}`;
  } else {
    return `${number} ${commodity}`;
  }
}

function randomStatus() {
  return pick(["", "* ", "! "]);
}

function randomCode() {
  return maybe(() => `(${Math.floor(Math.random() * 10000)}) `, 0.2);
}

function randomDescription() {
  const words = ["payment", "groceries", "rent", "salary", "transfer", "refund", "purchase"];
  const count = 1 + Math.floor(Math.random() * 3);
  return times(count, () => pick(words)).join(" ");
}

function randomBalanceAssertion() {
  const op = pick(["=", "=="]);
  return `${op} ${randomAmount()}`;
}

function randomCostSpec() {
  const op = pick(["@", "@@"]);
  return `${op} ${randomAmount()}`;
}

function randomPosting() {
  const indent = "    ";
  const account = randomAccountName();

  // Virtual posting wrapper
  const wrapper = pick(["none", "none", "none", "virtual", "balanced"]);
  let acct;
  switch (wrapper) {
    case "virtual":
      acct = `(${account})`;
      break;
    case "balanced":
      acct = `[${account}]`;
      break;
    default:
      acct = account;
  }

  const amount = maybe(() => "  " + randomAmount(), 0.8);
  const cost = maybe(() => " " + randomCostSpec(), 0.1);
  const assertion = maybe(() => " " + randomBalanceAssertion(), 0.1);
  const comment = maybe(() => "  ; " + pick(["note", "tag:value", "memo"]), 0.1);

  return `${indent}${acct}${amount}${cost}${assertion}${comment}`;
}

function randomTransaction() {
  const date = randomDate();
  const status = randomStatus();
  const code = randomCode();
  const description = randomDescription();
  const postingCount = 2 + Math.floor(Math.random() * 3);
  const postings = times(postingCount, () => randomPosting()).join("\n");

  return `${date} ${status}${code}${description}\n${postings}`;
}

function randomPeriodicTransaction() {
  const interval = pick(["daily", "weekly", "monthly", "quarterly", "yearly", "every 2 weeks", "every 3 months"]);
  const description = randomDescription();
  const postingCount = 2 + Math.floor(Math.random() * 2);
  const postings = times(postingCount, () => randomPosting()).join("\n");

  return `~ ${interval} ${description}\n${postings}`;
}

function randomComment() {
  const prefix = pick([";", "#"]);
  return `${prefix} ${pick(["comment", "note", "todo", "fixme"])}`;
}

function randomDirective() {
  const directives = [
    () => `account ${randomAccountName()}`,
    () => `commodity ${randomCommodity() || "USD"}`,
    () => `P ${randomDate()} ${randomCommodity() || "EUR"} ${randomAmount()}`,
    () => `payee ${pick(["Amazon", "Whole Foods", "Landlord", "Employer Inc"])}`,
    () => `tag ${pick(["project", "client", "trip"])}`,
    () => `decimal-mark ${pick([".", ","])}`,
    () => `alias ${randomAccountName()} = ${randomAccountName()}`,
  ];
  return pick(directives)();
}

function generateJournal() {
  const parts = [];
  const itemCount = 1 + Math.floor(Math.random() * 5);

  for (let i = 0; i < itemCount; i++) {
    const type = pick([
      "transaction", "transaction", "transaction", "transaction",
      "periodic", "comment", "directive"
    ]);
    switch (type) {
      case "transaction":
        parts.push(randomTransaction());
        break;
      case "periodic":
        parts.push(randomPeriodicTransaction());
        break;
      case "comment":
        parts.push(randomComment());
        break;
      case "directive":
        parts.push(randomDirective());
        break;
    }
  }

  return parts.join("\n\n");
}

// --

function checkWithHledger(journalPath) {
  const result = spawnSync("hledger", ["-f", journalPath, "check"], {
    encoding: "utf8",
    timeout: 5000,
  });
  return {
    valid: result.status === 0,
    error: result.stderr || result.stdout,
  };
}

function checkWithTreeSitter(journalPath) {
  const result = spawnSync("npx", ["tree-sitter", "parse", journalPath], {
    encoding: "utf8",
    timeout: 5000,
    cwd: process.cwd(),
  });

  const output = result.stdout || "";
  const hasError = output.includes("ERROR") || output.includes("MISSING");

  return {
    valid: !hasError,
    output: output,
    error: result.stderr,
  };
}

// --

function runFuzzIteration(i) {
  const journal = generateJournal();
  const tmpFile = path.join(os.tmpdir(), `fuzz-${process.pid}-${i}.journal`);

  fs.writeFileSync(tmpFile, journal);

  const hledger = checkWithHledger(tmpFile);
  const treeSitter = checkWithTreeSitter(tmpFile);

  fs.unlinkSync(tmpFile);

  return {
    journal,
    hledger,
    treeSitter,
    mismatch: hledger.valid !== treeSitter.valid,
  };
}

function printMismatch(result, index) {
  console.log("\n" + "=".repeat(60));
  console.log(`MISMATCH #${index}`);
  console.log("=".repeat(60));
  console.log("\nJournal content:");
  console.log("-".repeat(40));
  console.log(result.journal);
  console.log("-".repeat(40));
  console.log(`\nhledger: ${result.hledger.valid ? "✓ valid" : "✗ invalid"}`);
  if (!result.hledger.valid && result.hledger.error) {
    console.log(`  Error: ${result.hledger.error.split("\n")[0]}`);
  }
  console.log(`tree-sitter: ${result.treeSitter.valid ? "✓ valid" : "✗ invalid"}`);
  if (!result.treeSitter.valid) {
    const errorLines = result.treeSitter.output
      .split("\n")
      .filter((l) => l.includes("ERROR") || l.includes("MISSING"))
      .slice(0, 3);
    errorLines.forEach((l) => console.log(`  ${l.trim()}`));
  }
}

// --

function main() {
  const args = process.argv.slice(2);
  const bugsOnly = args.includes("--bugs");
  const iterations = parseInt(args.find((a) => !a.startsWith("-"))) || 100;

  console.log(`Running ${iterations} fuzz iterations...`);
  if (bugsOnly) console.log("(showing only tree-sitter bugs: hledger valid, tree-sitter invalid)");
  console.log("");

  let mismatches = [];
  let hledgerValid = 0;
  let treeSitterValid = 0;

  for (let i = 0; i < iterations; i++) {
    const result = runFuzzIteration(i);

    if (result.hledger.valid) hledgerValid++;
    if (result.treeSitter.valid) treeSitterValid++;

    if (result.mismatch) {
      mismatches.push(result);
      process.stdout.write("X");
    } else if (result.hledger.valid) {
      process.stdout.write(".");
    } else {
      process.stdout.write("x");
    }

    if ((i + 1) % 50 === 0) {
      process.stdout.write(` ${i + 1}\n`);
    }
  }

  console.log("\n");
  console.log("=".repeat(60));
  console.log("SUMMARY");
  console.log("=".repeat(60));
  const bugs = mismatches.filter((m) => m.hledger.valid && !m.treeSitter.valid);
  const displayMismatches = bugsOnly ? bugs : mismatches;

  console.log(`Iterations: ${iterations}`);
  console.log(`hledger valid: ${hledgerValid} (${((hledgerValid / iterations) * 100).toFixed(1)}%)`);
  console.log(`tree-sitter valid: ${treeSitterValid} (${((treeSitterValid / iterations) * 100).toFixed(1)}%)`);
  console.log(`Mismatches: ${mismatches.length}`);
  console.log(`Tree-sitter bugs: ${bugs.length} (hledger valid, tree-sitter invalid)`);

  if (displayMismatches.length > 0) {
    console.log("\n" + "=".repeat(60));
    console.log(bugsOnly ? "TREE-SITTER BUGS (first 10)" : "MISMATCHES (first 10)");
    console.log("=".repeat(60));
    displayMismatches.slice(0, 10).forEach((m, i) => printMismatch(m, i + 1));
  }

  // Write bugs to file for later analysis
  if (bugs.length > 0) {
    const outFile = "fuzz-bugs.json";
    fs.writeFileSync(
      outFile,
      JSON.stringify(
        bugs.map((m) => ({
          journal: m.journal,
          treeSitterOutput: m.treeSitter.output,
        })),
        null,
        2
      )
    );
    console.log(`\nBugs written to ${outFile}`);
  }

  process.exit(bugs.length > 0 ? 1 : 0);
}

main();
