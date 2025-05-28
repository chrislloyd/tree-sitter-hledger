#!/usr/bin/env node

const fs = require('fs');

/**
 * Parse tree-sitter corpus test files
 * Format:
 * ==================
 * test_name
 * ==================
 * 
 * input content
 * 
 * ---
 * 
 * (expected_tree)
 */
class CorpusParser {
  constructor() {
    this.tests = [];
  }

  parseFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    return this.parseString(content);
  }

  parseString(content) {
    // Split by test separator (lines of === characters)
    const sections = content.split(/^={10,}$/m);
    
    for (let i = 1; i < sections.length; i += 2) {
      if (i + 1 >= sections.length) break;
      
      const nameSection = sections[i];
      const bodySection = sections[i + 1];
      
      if (!nameSection || !bodySection) continue;
      
      // Extract test name (first non-empty line)
      const testName = nameSection.trim().split('\n').find(line => line.trim()).trim();
      
      // Split body by --- separator
      const parts = bodySection.split(/^-{3,}$/m);
      if (parts.length < 2) continue;
      
      const input = parts[0].trim();
      const expectedOutput = parts[1].trim();
      
      // Parse attributes from test name section
      const attributes = this.parseAttributes(nameSection);
      
      this.tests.push({
        name: testName,
        input: input,
        expectedOutput: expectedOutput,
        attributes: attributes,
        raw: {
          nameSection,
          bodySection
        }
      });
    }
    
    return this.tests;
  }

  parseAttributes(nameSection) {
    const attributes = {};
    const lines = nameSection.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith(':')) {
        const attrMatch = trimmed.match(/^:(\w+)(?:\(([^)]+)\))?/);
        if (attrMatch) {
          const [, name, value] = attrMatch;
          attributes[name] = value || true;
        }
      }
    }
    
    return attributes;
  }

  getTestByName(name) {
    return this.tests.find(test => test.name === name);
  }

  getTestsByAttribute(attribute, value = true) {
    return this.tests.filter(test => test.attributes[attribute] === value);
  }

  updateTest(name, updates) {
    const test = this.getTestByName(name);
    if (test) {
      Object.assign(test, updates);
      return test;
    }
    return null;
  }

  addTest(test) {
    this.tests.push(test);
  }

  removeTest(name) {
    const index = this.tests.findIndex(test => test.name === name);
    if (index !== -1) {
      return this.tests.splice(index, 1)[0];
    }
    return null;
  }

  toString() {
    return this.tests.map(test => {
      const attributeLines = Object.entries(test.attributes)
        .map(([key, value]) => value === true ? `:${key}` : `:${key}(${value})`)
        .join('\n');
      
      const nameSection = [test.name, attributeLines].filter(Boolean).join('\n');
      
      return `==================
${nameSection}
==================

${test.input}

---

${test.expectedOutput}`;
    }).join('\n\n');
  }

  writeFile(filePath) {
    fs.writeFileSync(filePath, this.toString());
  }

  stats() {
    return {
      total: this.tests.length,
      withAttributes: this.tests.filter(t => Object.keys(t.attributes).length > 0).length,
      skipped: this.getTestsByAttribute('skip').length,
      errorTests: this.getTestsByAttribute('error').length,
      manualAssertions: this.tests.filter(t => t.expectedOutput !== '(source_file)').length
    };
  }
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log('Usage: node corpus-parser.js <corpus-file>');
    console.log('       node corpus-parser.js <corpus-file> stats');
    process.exit(1);
  }
  
  const filePath = args[0];
  const command = args[1];
  
  const parser = new CorpusParser();
  
  try {
    parser.parseFile(filePath);
    
    if (command === 'stats') {
      const stats = parser.stats();
      console.log('📊 Corpus Statistics:');
      console.log(`  Total tests: ${stats.total}`);
      console.log(`  Manual assertions: ${stats.manualAssertions}`);
      console.log(`  With attributes: ${stats.withAttributes}`);
      console.log(`  Skipped: ${stats.skipped}`);
      console.log(`  Error tests: ${stats.errorTests}`);
    } else {
      console.log(`Parsed ${parser.tests.length} tests from ${filePath}`);
      parser.tests.slice(0, 3).forEach(test => {
        console.log(`\n📝 ${test.name}`);
        console.log(`   Input: ${test.input.substring(0, 50)}${test.input.length > 50 ? '...' : ''}`);
        console.log(`   Expected: ${test.expectedOutput.substring(0, 50)}${test.expectedOutput.length > 50 ? '...' : ''}`);
        if (Object.keys(test.attributes).length > 0) {
          console.log(`   Attributes: ${JSON.stringify(test.attributes)}`);
        }
      });
      if (parser.tests.length > 3) {
        console.log(`\n... and ${parser.tests.length - 3} more tests`);
      }
    }
  } catch (error) {
    console.error(`Error parsing corpus file: ${error.message}`);
    process.exit(1);
  }
}

module.exports = { CorpusParser };