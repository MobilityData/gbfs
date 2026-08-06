#!/usr/bin/env node
'use strict';
//
// Validate the structural integrity of systems.csv.
//
// Checks:
//   1. The header row exactly matches the expected GBFS systems schema (order + names).
//   2. Every data row parses to exactly 10 correctly-quoted fields (catches missing
//      values, extra commas, and broken/unterminated quoting).
//   3. Required columns must be non-empty -> ERROR (fails the build).
//        Country Code, Name, Location, System ID, URL, Auto-Discovery URL
//   4. "Supported Versions" empty -> WARNING (surfaced to author/reviewers, non-fatal).
//   5. The last 3 Authentication columns are optional and may be empty.
//
// Emits GitHub Actions annotations (::error / ::warning) so issues appear inline on the PR.
//
// Usage: node scripts/validate-systems-csv.js [path-to-csv]   (default: systems.csv)
//
const fs = require('fs');

const FILE = process.argv[2] || 'systems.csv';

const EXPECTED_HEADER = [
  'Country Code',
  'Name',
  'Location',
  'System ID',
  'URL',
  'Auto-Discovery URL',
  'Supported Versions',
  'Authentication Info URL',
  'Authentication Type',
  'Authentication Parameter Name',
];

// Columns that may legitimately be empty (no error, no warning).
const OPTIONAL = new Set([
  'Authentication Info URL',
  'Authentication Type',
  'Authentication Parameter Name',
]);

// Columns whose emptiness is only a warning.
const WARN_IF_EMPTY = new Set(['Supported Versions']);

// Escape a GitHub Actions workflow-command message so newlines, carriage
// returns, and percent signs survive intact instead of truncating the
// annotation at the first newline.
function ghEscapeData(s) {
  return String(s).replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A');
}

// Parse CSV into records, tracking the 1-based source line where each record starts.
// Returns { records: [{ fields, line }], error: {line, message} | null }.
function parseCSV(text) {
  const records = [];
  let field = '';
  let fields = [];
  let inQuotes = false;
  let line = 1; // current line number in the source
  let recordStartLine = 1;
  let started = false; // whether the current record has any content
  let i = 0;

  const pushField = () => { fields.push(field); field = ''; };
  const pushRecord = () => { records.push({ fields, line: recordStartLine }); fields = []; started = false; };

  while (i < text.length) {
    const c = text[i];

    if (!started && !inQuotes) {
      recordStartLine = line;
      started = true;
    }

    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i += 2; continue; }
        inQuotes = false; i++; continue;
      }
      if (c === '\n') { field += '\n'; line++; i++; continue; }
      field += c; i++; continue;
    }

    if (c === '"') { inQuotes = true; i++; continue; }
    if (c === ',') { pushField(); i++; continue; }
    if (c === '\r') { i++; continue; }
    if (c === '\n') {
      pushField();
      pushRecord();
      line++; i++;
      continue;
    }
    field += c; i++;
  }

  if (inQuotes) {
    return { records, error: { line: recordStartLine, message: 'Unterminated quoted field (broken CSV quoting).' } };
  }

  // Flush trailing record if the file did not end with a newline and had content.
  if (started || field.length > 0 || fields.length > 0) {
    pushField();
    pushRecord();
  }

  return { records, error: null };
}

function isBlankRecord(fields) {
  return fields.length === 1 && fields[0].trim() === '';
}

function main() {
  let text;
  try {
    text = fs.readFileSync(FILE, 'utf8');
  } catch (e) {
    console.error(`::error file=${FILE}::Cannot read ${FILE}: ${e.message}`);
    process.exit(2);
  }

  const { records, error } = parseCSV(text);
  const errors = [];
  const warnings = [];

  if (error) {
    errors.push({ line: error.line, message: error.message });
  }

  if (records.length === 0) {
    console.error(`::error file=${FILE}::${FILE} is empty.`);
    process.exit(1);
  }

  // 1. Header check.
  const header = records[0].fields;
  const headerOk =
    header.length === EXPECTED_HEADER.length &&
    EXPECTED_HEADER.every((h, idx) => header[idx] === h);
  if (!headerOk) {
    errors.push({
      line: 1,
      message:
        `Header does not match the expected schema.\n` +
        `  expected: ${EXPECTED_HEADER.join(',')}\n` +
        `  found:    ${header.join(',')}`,
    });
  }

  const N = EXPECTED_HEADER.length;

  // 2 + 3 + 4. Per-row checks.
  for (let r = 1; r < records.length; r++) {
    const { fields, line } = records[r];

    // Ignore fully blank lines (e.g. a trailing newline at end of file).
    if (isBlankRecord(fields)) continue;

    if (fields.length !== N) {
      errors.push({
        line,
        message: `Expected ${N} fields but found ${fields.length}. Check for missing values, stray commas, or unquoted commas.`,
      });
      // Field-count is wrong; skip per-column emptiness to avoid noise.
      continue;
    }

    for (let c = 0; c < N; c++) {
      const name = EXPECTED_HEADER[c];
      const empty = fields[c].trim() === '';
      if (!empty) continue;
      if (OPTIONAL.has(name)) continue;
      if (WARN_IF_EMPTY.has(name)) {
        warnings.push({ line, message: `Column "${name}" is empty.` });
      } else {
        errors.push({ line, message: `Required column "${name}" is empty.` });
      }
    }
  }

  for (const w of warnings) {
    console.log(`::warning file=${FILE},line=${w.line}::${ghEscapeData(w.message)}`);
  }
  for (const e of errors) {
    console.log(`::error file=${FILE},line=${e.line}::${ghEscapeData(e.message)}`);
  }

  const dataRows = records.length - 1;
  console.log(
    `\nsystems.csv structure check: ${dataRows} data rows, ` +
    `${errors.length} error(s), ${warnings.length} warning(s).`
  );

  process.exit(errors.length > 0 ? 1 : 0);
}

main();
