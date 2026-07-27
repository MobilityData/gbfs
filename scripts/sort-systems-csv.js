#!/usr/bin/env node
'use strict';
//
// Sort systems.csv: keep the header row in place, then sort the remaining rows
// by the first four columns, in order: column 1 (Country Code), column 2
// (Name), column 3 (Location), column 4 (System ID).
//
// This is CSV-quoting-aware: a field that is quoted because it contains a comma
// (e.g. "Veo University of Illinois, Urbana-Champaign") is sorted by its real
// value, not by the text up to the first raw comma. Rows are re-emitted exactly
// as they appeared in the file (original quoting preserved) - only their order
// changes.
//
// Ordering is byte-wise (equivalent to LC_ALL=C): comparison is on the UTF-8
// bytes of each field, so uppercase sorts before lowercase and non-ASCII sorts
// after ASCII. Because the comparison is implemented here rather than delegated
// to the platform `sort`, the result is identical on macOS and on the Linux CI
// runner, so local sorting always matches what the workflow produces.
//
// Usage:
//   node scripts/sort-systems-csv.js [path-to-csv]   # sort in place (default: systems.csv)
//   node scripts/sort-systems-csv.js --check [path]  # exit 1 if not already sorted
//
const fs = require('fs');

let check = false;
const args = process.argv.slice(2);
if (args[0] === '--check') {
  check = true;
  args.shift();
}
const FILE = args[0] || 'systems.csv';

// Parse a single CSV line into fields, honoring double-quote quoting and ""
// escapes. systems.csv has no fields containing embedded newlines, so a
// physical line maps 1:1 to a record; we assert this below.
function parseLine(line) {
  const fields = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQuotes) {
      if (c === '"') {
        if (line[i + 1] === '"') { field += '"'; i++; } else { inQuotes = false; }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      fields.push(field);
      field = '';
    } else {
      field += c;
    }
  }
  fields.push(field);
  return { fields, balanced: !inQuotes };
}

// Byte-wise (UTF-8) comparison, matching `sort` under LC_ALL=C.
function byteCompare(a, b) {
  return Buffer.compare(Buffer.from(a, 'utf8'), Buffer.from(b, 'utf8'));
}

function sortedText(raw) {
  const hadTrailingNewline = raw.endsWith('\n');
  const lines = raw.split('\n');
  if (hadTrailingNewline) lines.pop(); // drop the empty element after the final newline

  if (lines.length <= 1) return raw; // header only (or empty) - nothing to sort

  const header = lines[0];
  const body = lines.slice(1);

  // Sort keys: the first four columns, in order.
  const KEY_COLUMNS = 4;

  const decorated = body.map((line, index) => {
    const { fields, balanced } = parseLine(line);
    if (!balanced) {
      throw new Error(
        `Unbalanced quotes on data line ${index + 2}; refusing to sort a malformed CSV. ` +
        `Run the structure validation first.`
      );
    }
    const keys = [];
    for (let k = 0; k < KEY_COLUMNS; k++) keys.push(fields[k] || '');
    return { line, keys };
  });

  decorated.sort((a, b) => {
    for (let k = 0; k < KEY_COLUMNS; k++) {
      const c = byteCompare(a.keys[k], b.keys[k]);
      if (c) return c;
    }
    return byteCompare(a.line, b.line); // deterministic tie-break on the full row
  });

  let out = [header, ...decorated.map((d) => d.line)].join('\n');
  if (hadTrailingNewline) out += '\n';
  return out;
}

function main() {
  let raw;
  try {
    raw = fs.readFileSync(FILE, 'utf8');
  } catch (e) {
    console.error(`error: cannot read ${FILE}: ${e.message}`);
    process.exit(2);
  }

  const sorted = sortedText(raw);

  if (check) {
    if (sorted === raw) {
      console.log(`${FILE} is already sorted.`);
      process.exit(0);
    }
    console.error(`error: ${FILE} is not sorted. Run: node scripts/sort-systems-csv.js ${FILE}`);
    process.exit(1);
  }

  if (sorted === raw) {
    console.log(`${FILE} is already sorted; no changes.`);
  } else {
    fs.writeFileSync(FILE, sorted);
    console.log(`Sorted ${FILE}.`);
  }
}

main();
