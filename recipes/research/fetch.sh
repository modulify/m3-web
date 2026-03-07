#!/usr/bin/env bash

set -euo pipefail

usage() {
	printf '%s\n' \
		"usage:" \
		"  recipes/research/fetch.sh --format raw --url https://... [--out file]" \
		"  recipes/research/fetch.sh --format json --collection ComponentsM3 --document 5634981699387392 [--out file.json]" \
		"  recipes/research/fetch.sh --format json --manifest recipes/research/packs/<pack>.page-data.tsv [--out-dir dir]" \
		"" \
		"options:" \
		"  --format VALUE         fetch format: raw or json" \
		"  --manifest FILE        TSV manifest for format=json: <slug><TAB><collection><TAB><document_id>" \
		"  --collection VALUE     page-data collection name" \
		"  --document VALUE       page-data document id" \
		"  --url URL              arbitrary URL for format=raw" \
		"  --out FILE             explicit output file path" \
		"  --out-dir DIR          output directory for manifest mode" \
		"  --user-agent VALUE     override HTTP user agent"
}

user_agent="${M3_UA:-m3-web-research/1.0}"
fetch_root="${M3_FETCH_OUT_DIR:-/tmp/m3-fetch}"
format='raw'
manifest_file=''
collection=''
document=''
url=''
out=''
out_dir=''

while [ "$#" -gt 0 ]; do
	case "$1" in
		--format)
			[ "$#" -ge 2 ] || { echo "missing value for --format" >&2; usage >&2; exit 2; }
			format="$2"
			shift 2
			;;
		--manifest)
			[ "$#" -ge 2 ] || { echo "missing value for --manifest" >&2; usage >&2; exit 2; }
			manifest_file="$2"
			shift 2
			;;
		--collection)
			[ "$#" -ge 2 ] || { echo "missing value for --collection" >&2; usage >&2; exit 2; }
			collection="$2"
			shift 2
			;;
		--document)
			[ "$#" -ge 2 ] || { echo "missing value for --document" >&2; usage >&2; exit 2; }
			document="$2"
			shift 2
			;;
		--url)
			[ "$#" -ge 2 ] || { echo "missing value for --url" >&2; usage >&2; exit 2; }
			url="$2"
			shift 2
			;;
		--out)
			[ "$#" -ge 2 ] || { echo "missing value for --out" >&2; usage >&2; exit 2; }
			out="$2"
			shift 2
			;;
		--out-dir)
			[ "$#" -ge 2 ] || { echo "missing value for --out-dir" >&2; usage >&2; exit 2; }
			out_dir="$2"
			shift 2
			;;
		--user-agent)
			[ "$#" -ge 2 ] || { echo "missing value for --user-agent" >&2; usage >&2; exit 2; }
			user_agent="$2"
			shift 2
			;;
		-h|--help)
			usage
			exit 0
			;;
		*)
			echo "unknown argument: $1" >&2
			usage >&2
			exit 2
			;;
	esac
done

case "$format" in
	raw|json) ;;
	*)
		echo "unsupported --format: $format (expected raw or json)" >&2
		usage >&2
		exit 2
		;;
esac

fetch_to_file() {
	local source_url="$1"
	local output_path="$2"
	mkdir -p "$(dirname "$output_path")"
	curl -fLsS -A "$user_agent" "$source_url" -o "$output_path"
	printf '%s\n' "$output_path"
}

if [ "$format" = "raw" ]; then
	if [ -n "$manifest_file" ] || [ -n "$collection" ] || [ -n "$document" ]; then
		echo "format=raw only supports --url" >&2
		usage >&2
		exit 2
	fi
	if [ -z "$url" ]; then
		echo "format=raw requires --url" >&2
		usage >&2
		exit 2
	fi
	output_path="${out:-$fetch_root/raw-response.txt}"
	fetch_to_file "$url" "$output_path"
	exit 0
fi

if [ -n "$url" ] && { [ -n "$manifest_file" ] || [ -n "$collection" ] || [ -n "$document" ]; }; then
	echo "format=json does not support combining --url with page-data options" >&2
	usage >&2
	exit 2
fi

if [ -n "$manifest_file" ]; then
	[ -f "$manifest_file" ] || { echo "manifest file not found: $manifest_file" >&2; exit 2; }
	[ -z "$out" ] || { echo "--out is not supported with --manifest; use --out-dir" >&2; exit 2; }
	output_dir="${out_dir:-$fetch_root}"
	mkdir -p "$output_dir"
	while IFS="$(printf '\t')" read -r slug manifest_collection manifest_document; do
		[ -z "$slug" ] && continue
		case "$slug" in
			\#*) continue ;;
		esac
		if [ -z "$manifest_collection" ] || [ -z "$manifest_document" ]; then
			echo "invalid manifest row in $manifest_file: $slug" >&2
			exit 2
		fi
		fetch_to_file "https://m3.material.io/page-data/$manifest_collection/$manifest_document.json" "$output_dir/$slug.json" >/dev/null
	done < "$manifest_file"
	printf '%s\n' "$output_dir"
	exit 0
fi

if [ -z "$collection" ] || [ -z "$document" ]; then
	echo "format=json requires either --manifest or both --collection and --document" >&2
	usage >&2
	exit 2
fi

output_path="${out:-$fetch_root/page-data_${collection}_${document}.json}"
fetch_to_file "https://m3.material.io/page-data/$collection/$document.json" "$output_path"
