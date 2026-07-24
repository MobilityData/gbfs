#!/usr/bin/env bash
#
# Sort systems.csv in place: keep the header row, then sort the remaining rows
# by column 1 (Country Code) and column 2 (Name), comma-separated, en_US.UTF-8.
#
# Mirrors the canonical one-liner:
#   (head -n 1; LC_ALL=en_US.UTF-8 sort --field-separator=',' --key=1,1 --key=2,2) < systems.csv
#
# On Linux / GitHub Actions runners, `sort` is GNU sort, so no override is needed.
# On macOS, install GNU coreutils (`brew install coreutils`) and run with:
#   GNUSORT=gsort ./scripts/sort-systems-csv.sh
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

# GNU sort binary. Override with GNUSORT=gsort on macOS.
SORT_BIN="${GNUSORT:-sort}"

if [[ ! -f "$CSV" ]]; then
  echo "error: file not found: $CSV" >&2
  exit 2
fi

sorted="$(mktemp)"
trap 'rm -f "$sorted"' EXIT

{
  head -n 1 "$CSV"
  tail -n +2 "$CSV" | LC_ALL=en_US.UTF-8 "$SORT_BIN" --field-separator=',' --key=1,1 --key=2,2
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
