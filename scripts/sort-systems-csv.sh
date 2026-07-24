#!/usr/bin/env bash
#
# Sort systems.csv in place: keep the header row, then sort the remaining rows
# by column 1 (Country Code) and column 2 (Name), comma-separated.
#
# Mirrors the canonical one-liner:
#   (head -n 1; LC_ALL=C sort -t, -k1,1 -k2,2) < systems.csv
#
# LC_ALL=C forces a byte-wise ordering, which is identical on every platform
# (macOS BSD sort, Linux/CI GNU sort). This is deliberate: a locale-aware sort
# (e.g. en_US.UTF-8) orders punctuation, spacing, case, and accented characters
# differently between macOS and glibc, so the CI auto-sort and a contributor
# sorting locally would disagree and fight in a loop. Byte order avoids that.
#
# Usage:
#   ./scripts/sort-systems-csv.sh [path-to-csv]   # sort in place (default: systems.csv)
#   ./scripts/sort-systems-csv.sh --check [path]  # exit 1 if the file is not already sorted
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

sorted="$(mktemp)"
trap 'rm -f "$sorted"' EXIT

{
  head -n 1 "$CSV"
  tail -n +2 "$CSV" | LC_ALL=C sort -t, -k1,1 -k2,2
} > "$sorted"

if [[ "$CHECK" -eq 1 ]]; then
  if cmp -s "$CSV" "$sorted"; then
    echo "$CSV is already sorted."
    exit 0
  fi
  echo "error: $CSV is not sorted. Run ./scripts/sort-systems-csv.sh to fix it." >&2
  diff -u "$CSV" "$sorted" || true
  exit 1
fi

if cmp -s "$CSV" "$sorted"; then
  echo "$CSV is already sorted; no changes."
else
  cat "$sorted" > "$CSV"
  echo "Sorted $CSV."
fi
