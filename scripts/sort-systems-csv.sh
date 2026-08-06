#!/usr/bin/env bash
#
# Sort systems.csv: keep the header row in place, then sort the remaining rows
# by the first four columns, in order: column 1 (Country Code), column 2 (Name),
# column 3 (Location), column 4 (System ID).
#
# This is a shell equivalent of scripts/sort-systems-csv.js, provided for
# convenience. Both implementations produce byte-identical output; the CI
# workflow runs the Node one. Use whichever you prefer locally.
#
# Like the Node sorter, this is CSV-quoting-aware: a field that is quoted
# because it contains a comma (e.g. "Veo University of Illinois,
# Urbana-Champaign") is sorted by its real value, not by the text up to the
# first raw comma. Rows are re-emitted verbatim - only their order changes.
#
# Sorting is case-insensitive (A-Z folded to a-z), so "nextbike" sorts right
# after "LiBike" rather than below every uppercase name. Folding is ASCII-only;
# see scripts/sort-systems-csv.js for why full Unicode folding is avoided.
#
# How it works: awk parses each data row and prepends the four sort keys,
# separated by a control character (\x01) that cannot occur in the CSV. The
# result is sorted byte-wise (LC_ALL=C) on those key fields, with the original
# row as a final tie-break, then the key prefix is stripped off.
#
# Usage:
#   ./scripts/sort-systems-csv.sh [path-to-csv]   # sort in place (default: systems.csv)
#   ./scripts/sort-systems-csv.sh --check [path]  # exit 1 if not already sorted
#
set -euo pipefail

CHECK=0
if [[ "${1:-}" == "--check" ]]; then
  CHECK=1
  shift
fi

CSV="${1:-systems.csv}"

if [[ ! -f "$CSV" ]]; then
  echo "error: file not found: $CSV" >&2
  exit 2
fi

SEP=$'\001'

sorted="$(mktemp)"
trap 'rm -f "$sorted"' EXIT

{
  head -n 1 "$CSV"

  # Decorate: <k1><SEP><k2><SEP><k3><SEP><k4><SEP><original row>
  # LC_ALL=C keeps awk byte-oriented, so the ASCII fold below cannot be affected
  # by the ambient locale.
  tail -n +2 "$CSV" | LC_ALL=C awk -v SEP="$SEP" '
    BEGIN {
      # Explicit A-Z -> a-z map. Not tolower(): its treatment of non-ASCII
      # varies by awk implementation and locale, which would desynchronize this
      # script from scripts/sort-systems-csv.js.
      u = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
      l = "abcdefghijklmnopqrstuvwxyz"
      for (i = 1; i <= 26; i++) fold[substr(u, i, 1)] = substr(l, i, 1)
    }

    # Fold A-Z to a-z, passing every other byte through untouched.
    function ascii_lower(s,    i, c, out) {
      out = ""
      for (i = 1; i <= length(s); i++) {
        c = substr(s, i, 1)
        out = out ((c in fold) ? fold[c] : c)
      }
      return out
    }

    # Parse a CSV record into the array out[1..n], honoring "" escapes.
    function parse_csv(line, out,    i, c, field, inq, n) {
      n = 0; field = ""; inq = 0
      for (i = 1; i <= length(line); i++) {
        c = substr(line, i, 1)
        if (inq) {
          if (c == "\"") {
            if (substr(line, i + 1, 1) == "\"") { field = field "\""; i++ }
            else { inq = 0 }
          } else { field = field c }
        } else if (c == "\"") {
          inq = 1
        } else if (c == ",") {
          out[++n] = field; field = ""
        } else {
          field = field c
        }
      }
      out[++n] = field
      return inq   # nonzero => unbalanced quotes
    }
    {
      if (length($0) == 0) next   # skip blank lines
      delete f
      if (parse_csv($0, f) != 0) {
        printf "error: unbalanced quotes on data line %d; refusing to sort a malformed CSV.\n", NR + 1 > "/dev/stderr"
        exit 3
      }
      printf "%s%s%s%s%s%s%s%s%s\n", ascii_lower(f[1]), SEP, ascii_lower(f[2]), SEP,
                                     ascii_lower(f[3]), SEP, ascii_lower(f[4]), SEP, $0
    }
  ' | LC_ALL=C sort -t "$SEP" -k1,1 -k2,2 -k3,3 -k4,4 -k5,5 |
    # Strip the four key fields, leaving the original row. The row itself cannot
    # contain SEP, so field 5 onward is exactly the original line.
    cut -d "$SEP" -f5-
} > "$sorted"

if [[ "$CHECK" -eq 1 ]]; then
  if cmp -s "$CSV" "$sorted"; then
    echo "$CSV is already sorted."
    exit 0
  fi
  echo "error: $CSV is not sorted. Run: ./scripts/sort-systems-csv.sh $CSV" >&2
  diff -u "$CSV" "$sorted" || true
  exit 1
fi

if cmp -s "$CSV" "$sorted"; then
  echo "$CSV is already sorted; no changes."
else
  cat "$sorted" > "$CSV"
  echo "Sorted $CSV."
fi
