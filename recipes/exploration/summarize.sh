#!/usr/bin/env sh

set -eu

activity_dir="${ACTIVITY_DIR:-}"
out=""

while [ "$#" -gt 0 ]; do
	case "$1" in
		--out)
			shift
			out="${1:-}"
			;;
		*)
			echo "usage: ACTIVITY_DIR=<dir> $0 [--out <file>]" >&2
			exit 2
			;;
	esac
	shift
done

if [ -z "$activity_dir" ]; then
	echo "usage: make exploration-summarize activity_dir=drafts/explorations/<id> [out=...]" >&2
	exit 2
fi

if [ -z "$out" ]; then
	out="$activity_dir/summary.md"
fi

fetch_dir="$activity_dir/artifacts/fetch"
screens_dir="$activity_dir/artifacts/screenshots"

if [ ! -d "$fetch_dir" ] && [ -d "$activity_dir/fetch" ]; then
	fetch_dir="$activity_dir/fetch"
fi

if [ ! -d "$screens_dir" ] && [ -d "$activity_dir/screenshots" ]; then
	screens_dir="$activity_dir/screenshots"
fi

mkdir -p "$(dirname "$out")"

fetch_count="$(find "$fetch_dir" -maxdepth 1 -type f -name '*.json' 2>/dev/null | wc -l | tr -d ' ')"

{
	printf '# Exploration Summary\n\n'
	printf -- '- Activity dir: `%s`\n' "$activity_dir"
	printf -- '- Fetch JSON: %s\n' "$fetch_count"
	printf '\n## Screenshot Sets\n'

	found=0
	for dir in "$screens_dir"/*; do
		if [ ! -d "$dir" ]; then
			continue
		fi

		found=1
		name="$(basename "$dir")"
		meta_count="$(find "$dir" -maxdepth 1 -type f -name '*.meta.json' 2>/dev/null | wc -l | tr -d ' ')"
		png_count="$(find "$dir" -maxdepth 1 -type f -name '*.png' 2>/dev/null | wc -l | tr -d ' ')"
		printf -- '- `%s`: png=%s meta=%s\n' "$name" "$png_count" "$meta_count"
	done

	if [ "$found" -eq 0 ]; then
		printf -- '- No screenshot directories found.\n'
	fi
} > "$out"

cat "$out"
printf '\nsummary_file=%s\n' "$out"
