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
// Ordering is case-insensitive: keys are compared with A-Z folded to a-z, so
// "nextbike" sorts right after "LiBike" instead of being pushed below every
// uppercase name. Rows whose keys differ only in case fall back to a byte-wise
// comparison of the whole row, keeping the result deterministic.
//
// Case folding is deliberately ASCII-only (A-Z only; accented and other
// non-ASCII characters are left untouched and compared by their UTF-8 bytes).
// Full Unicode folding is avoided because JavaScript's toLowerCase() and awk's
// tolower() disagree about non-ASCII, which would make this script and
// scripts/sort-systems-csv.sh produce different orderings.
//
// Apart from case folding, comparison is byte-wise (equivalent to LC_ALL=C).
// Because the comparison is implemented here rather than delegated to the
// platform `sort`, the result is identical on macOS and on the Linux CI runner,
// so local sorting always matches what the workflow produces.
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

// Fold A-Z to a-z and nothing else. Intentionally not toLowerCase(): full
// Unicode folding differs from awk's tolower(), which would desynchronize this
// script from scripts/sort-systems-csv.sh.
function asciiLower(s) {
  let out = '';
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    out += c >= 65 && c <= 90 ? String.fromCharCode(c + 32) : s[i];
  }
  return out;
}

function sortedText(raw) {
  const hadTrailingNewline = raw.endsWith('\n');
  const lines = raw.split('\n');
  if (hadTrailingNewline) lines.pop(); // drop the empty element after the final newline

  if (lines.length <= 1) return raw; // header only (or empty) - nothing to sort

  const header = lines[0];
  // Blank lines carry no row data; drop them rather than sorting them to the
  // top of the file. scripts/sort-systems-csv.sh does the same, so the two
  // implementations stay byte-identical.
  const body = lines.slice(1).filter((l) => l.length > 0);

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
    for (let k = 0; k < KEY_COLUMNS; k++) keys.push(asciiLower(fields[k] || ''));
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

  let sorted;
  try {
    sorted = sortedText(raw);
  } catch (e) {
    // Malformed CSV: exit 3, matching scripts/sort-systems-csv.sh.
    console.error(`error: ${e.message}`);
    process.exit(3);
  }

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
