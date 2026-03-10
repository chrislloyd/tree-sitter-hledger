#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { CorpusParser } = require('./corpus-parser');

// Map source test filenames to grammar directories
const FORMAT_MAP = {
  'csv':       'csv',
  'timeclock': 'timeclock',
  'timedot':   'timedot',
  'add':       null, // skip (interactive prompts)
  'run':       null, // skip (batch command scripts)
};

// Parse existing corpus file using the corpus parser
function parseExistingCorpus(corpusFile) {
  if (!fs.existsSync(corpusFile)) {
    return new Map();
  }

  const parser = new CorpusParser();
  parser.parseFile(corpusFile);

  const existingTests = new Map();
  for (const test of parser.tests) {
    existingTests.set(test.name, {
      content: test.input,
      assertion: test.expectedOutput,
      wasManual: test.expectedOutput !== '(source_file)'
    });
  }

  return existingTests;
}

// Extract content from shelltestrunner format
function extractFromTest(content, testName) {
  const tests = [];
  const sections = content.split(/^# /m);

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (!section.trim()) continue;

    const lines = section.split('\n');
    let journalContent = '';
    let inJournal = false;
    let testDescription = '';

    for (let j = 0; j < lines.length; j++) {
      const line = lines[j];

      if (j === 0 && line.includes('*')) {
        testDescription = line.replace(/^\*+\s*/, '').replace(/\s*\*+$/, '').trim();
      }

      if (line.trim() === '<' || line.startsWith('<<')) {
        inJournal = true;
        continue;
      }

      if (inJournal && (line.startsWith('$ ') || line.startsWith('> ') || line.startsWith('>=') || line.startsWith('>>>'))) {
        inJournal = false;
        break;
      }

      if (inJournal && line.trim() !== '') {
        journalContent += line + '\n';
      }
    }

    if (journalContent.trim()) {
      tests.push({
        name: testDescription || `test_${i}`,
        content: journalContent.trim(),
        source: testName
      });
    }
  }

  return tests;
}

function findTestFiles(dir) {
  const files = fs.readdirSync(dir);
  let testFiles = [];

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      testFiles = testFiles.concat(findTestFiles(fullPath));
    } else if (file.endsWith('.test')) {
      testFiles.push(fullPath);
    }
  }

  return testFiles;
}

function formatCorpus(tests, existingTests) {
  let preservedCount = 0;
  let newCount = 0;
  let updatedCount = 0;

  const content = tests.map((test) => {
    const name = test.name.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
    const existing = existingTests.get(name);

    let assertion = '(source_file)';
    let comment = '';

    if (existing) {
      if (existing.content === test.content) {
        assertion = existing.assertion;
        preservedCount++;
      } else {
        assertion = existing.assertion;
        if (existing.wasManual) {
          comment = `; NOTICE: Content updated from hledger, but preserved manual assertion\n; Previous content length: ${existing.content.length}, new: ${test.content.length}\n`;
        }
        updatedCount++;
      }
    } else {
      newCount++;
    }

    return `==================
${name}
==================

${test.content}

---

${comment}${assertion}`;
  }).join('\n\n');

  return { content, preservedCount, newCount, updatedCount };
}

function extractTestCases() {
  const testDir = './hledger/hledger/test';

  // Group tests by target grammar
  const testsByFormat = { journal: [], csv: [], timeclock: [], timedot: [] };

  const testFiles = findTestFiles(testDir);
  console.log(`Found ${testFiles.length} test files`);

  for (const testFile of testFiles) {
    try {
      const content = fs.readFileSync(testFile, 'utf8');
      const testName = path.basename(testFile, '.test');

      if (FORMAT_MAP[testName] === null) {
        console.log(`Skipping ${testFile} (excluded format)`);
        continue;
      }

      const tests = extractFromTest(content, testName);
      if (tests.length === 0) continue;

      const targetFormat = FORMAT_MAP[testName] || 'journal';
      testsByFormat[targetFormat] = testsByFormat[targetFormat].concat(tests);
      console.log(`Extracted ${tests.length} tests from ${testFile} → ${targetFormat}`);
    } catch (error) {
      console.warn(`Error processing ${testFile}: ${error.message}`);
    }
  }

  // Sample journals go to journal
  const sampleFiles = [
    './hledger/hledger/test/sample.journal',
    './hledger/hledger/test/sample2.journal'
  ];
  for (const sampleFile of sampleFiles) {
    if (fs.existsSync(sampleFile)) {
      try {
        const content = fs.readFileSync(sampleFile, 'utf8');
        testsByFormat.journal.push({
          name: path.basename(sampleFile, '.journal'),
          content: content.trim(),
          source: 'sample'
        });
      } catch (error) {
        console.warn(`Error processing ${sampleFile}: ${error.message}`);
      }
    }
  }

  // Output paths for each format
  const outputPaths = {
    journal:   'journal/test/corpus/extracted_from_hledger.txt',
    csv:       'csv/test/corpus/extracted_from_hledger.txt',
    timeclock: 'timeclock/test/corpus/extracted_from_hledger.txt',
    timedot:   'timedot/test/corpus/extracted_from_hledger.txt',
  };

  let totalTests = 0;

  for (const [format, tests] of Object.entries(testsByFormat)) {
    if (tests.length === 0) continue;

    const outputFile = outputPaths[format];
    const outputDir = path.dirname(outputFile);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const existingTests = parseExistingCorpus(outputFile);
    const result = formatCorpus(tests, existingTests);

    fs.writeFileSync(outputFile, result.content);
    totalTests += tests.length;
    console.log(`${format}: ${tests.length} tests (${result.preservedCount} preserved, ${result.newCount} new, ${result.updatedCount} updated) → ${outputFile}`);
  }

  // Write summary to journal dir
  const summary = [
    `# Extraction Summary - ${new Date().toISOString()}`,
    '',
    ...Object.entries(testsByFormat).map(([format, tests]) =>
      `${format}: ${tests.length} tests`
    ),
    '',
    `Total: ${totalTests} tests`,
  ].join('\n');
  fs.writeFileSync('journal/test/corpus/extraction_summary.md', summary);

  return { total: totalTests };
}

if (require.main === module) {
  const result = extractTestCases();
  console.log(`\n✅ Extraction complete: ${result.total} test cases processed`);
}

module.exports = { extractTestCases };
