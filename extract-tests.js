#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { CorpusParser } = require('./corpus-parser');

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
      wasManual: test.expectedOutput !== '(source_file)' // Track if this has a manual assertion
    });
  }
  
  console.log(`Loaded ${existingTests.size} existing test cases from corpus`);
  return existingTests;
}

// Extract journal content from hledger test files and convert to tree-sitter corpus format
function extractTestCases() {
  const testDir = './hledger/hledger/test';
  const corpusDir = './corpus';
  const corpusFile = path.join(corpusDir, 'extracted_from_hledger.txt');
  
  // Ensure corpus directory exists
  if (!fs.existsSync(corpusDir)) {
    fs.mkdirSync(corpusDir);
  }

  // Parse existing corpus to preserve assertions
  const existingTests = parseExistingCorpus(corpusFile);
  
  let extractedTests = [];
  let preservedCount = 0;
  let newCount = 0;
  let updatedCount = 0;

  // Function to recursively find .test files
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

  // Function to extract journal content from shelltestrunner format
  function extractJournalFromTest(content, testName) {
    const tests = [];
    const sections = content.split(/^# /m);
    
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      if (!section.trim()) continue;
      
      // Look for journal content between < and $ or > markers
      const lines = section.split('\n');
      let journalContent = '';
      let inJournal = false;
      let testDescription = '';
      
      for (let j = 0; j < lines.length; j++) {
        const line = lines[j];
        
        // Get test description from first line
        if (j === 0 && line.includes('*')) {
          testDescription = line.replace(/^\*+\s*/, '').replace(/\s*\*+$/, '').trim();
        }
        
        // Start of journal content
        if (line.trim() === '<' || line.startsWith('<<')) {
          inJournal = true;
          continue;
        }
        
        // End of journal content
        if (inJournal && (line.startsWith('$ ') || line.startsWith('> ') || line.startsWith('>='))) {
          inJournal = false;
          break;
        }
        
        // Collect journal content
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

  // Find and process all test files
  const testFiles = findTestFiles(testDir);
  console.log(`Found ${testFiles.length} test files`);

  for (const testFile of testFiles) {
    try {
      const content = fs.readFileSync(testFile, 'utf8');
      const testName = path.basename(testFile, '.test');
      const journalTests = extractJournalFromTest(content, testName);
      
      if (journalTests.length > 0) {
        console.log(`Extracted ${journalTests.length} journal tests from ${testFile}`);
        extractedTests = extractedTests.concat(journalTests);
      }
    } catch (error) {
      console.warn(`Error processing ${testFile}: ${error.message}`);
    }
  }

  // Also extract from sample journals
  const sampleFiles = [
    './hledger/hledger/test/sample.journal',
    './hledger/hledger/test/sample2.journal'
  ];

  for (const sampleFile of sampleFiles) {
    if (fs.existsSync(sampleFile)) {
      try {
        const content = fs.readFileSync(sampleFile, 'utf8');
        extractedTests.push({
          name: path.basename(sampleFile, '.journal'),
          content: content.trim(),
          source: 'sample'
        });
      } catch (error) {
        console.warn(`Error processing ${sampleFile}: ${error.message}`);
      }
    }
  }

  console.log(`Total extracted tests: ${extractedTests.length}`);

  // Convert to tree-sitter corpus format with smart merging
  const corpusContent = extractedTests.map((test, index) => {
    const name = test.name.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
    const existing = existingTests.get(name);
    
    let assertion = '(source_file)'; // Default assertion
    let comment = '';
    
    if (existing) {
      if (existing.content === test.content) {
        // Content unchanged, preserve existing assertion
        assertion = existing.assertion;
        preservedCount++;
      } else {
        // Content changed, preserve assertion but add comment
        assertion = existing.assertion;
        if (existing.wasManual) {
          comment = `; NOTICE: Content updated from hledger, but preserved manual assertion\n; Previous content length: ${existing.content.length}, new: ${test.content.length}\n`;
        }
        updatedCount++;
      }
    } else {
      // New test case
      newCount++;
    }

    return `==================
${name}
==================

${test.content}

---

${comment}${assertion}`;
  }).join('\n\n');

  // Write to corpus file
  fs.writeFileSync(corpusFile, corpusContent);
  
  console.log(`Generated corpus file: ${corpusFile}`);
  console.log(`📊 Summary:`);
  console.log(`  🔄 Preserved: ${preservedCount} (assertions kept)`);
  console.log(`  🆕 New: ${newCount} (generic assertions)`);
  console.log(`  📝 Updated: ${updatedCount} (content changed, assertions preserved)`);
  
  // Write a detailed summary
  const summary = [
    `# Extraction Summary - ${new Date().toISOString()}`,
    ``,
    `Total tests: ${extractedTests.length}`,
    `Preserved assertions: ${preservedCount}`,
    `New tests: ${newCount}`,
    `Updated content (preserved assertions): ${updatedCount}`,
    ``,
    `## Test Sources:`,
    ...extractedTests.map(test => `${test.name} (from ${test.source})`)
  ].join('\n');
  
  fs.writeFileSync(path.join(corpusDir, 'extraction_summary.md'), summary);
  
  return {
    total: extractedTests.length,
    preserved: preservedCount,
    new: newCount,
    updated: updatedCount
  };
}

if (require.main === module) {
  const result = extractTestCases();
  console.log(`\n✅ Extraction complete: ${result.total} test cases processed`);
  if (result.preserved > 0) {
    console.log(`🎯 Your manual assertions are preserved!`);
  }
}

module.exports = { extractTestCases };