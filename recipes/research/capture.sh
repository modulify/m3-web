#!/usr/bin/env bash

set -euo pipefail

usage() {
	printf '%s\n' \
		"usage:" \
		"  recipes/research/capture.sh --url https://... [--out path.png] [--out-dir dir]" \
		"  recipes/research/capture.sh --manifest recipes/research/packs/<pack>.urls.txt [--out-dir dir]" \
		"  recipes/research/capture.sh --in drafts/urls.txt [--out-dir dir]" \
		"" \
		"options:" \
		"  --url URL              capture one URL; may be repeated for batch mode" \
		"  --manifest FILE        URL manifest file (one URL per line)" \
		"  --in FILE              arbitrary URL file (one URL per line)" \
		"  --out FILE             output path for single-URL mode only" \
		"  --out-dir DIR          output directory for generated images/meta" \
		"  --width PX             viewport width (default: 1440)" \
		"  --height PX            viewport height (default: 1024)" \
		"  --wait-ms MS           extra wait before screenshot (default: 1200)" \
		"  --wait-until STATE     Playwright waitUntil (default: networkidle)" \
		"  --full-page BOOL       full-page screenshot flag (default: true)" \
		"  --wait-selector CSS    optional selector to wait for before capture"
}

node_cmd_string="${PLAYWRIGHT_NODE_CMD:-docker-compose run --rm playwright node}"
read -r -a node_cmd <<< "$node_cmd_string"

urls=()
input_file=''
manifest_file=''
out=''
out_dir=''
width='1440'
height='1024'
wait_ms='1200'
wait_until='networkidle'
full_page='true'
wait_selector=''

while [ "$#" -gt 0 ]; do
	case "$1" in
		--url)
			[ "$#" -ge 2 ] || { echo "missing value for --url" >&2; usage >&2; exit 2; }
			urls+=("$2")
			shift 2
			;;
		--in)
			[ "$#" -ge 2 ] || { echo "missing value for --in" >&2; usage >&2; exit 2; }
			input_file="$2"
			shift 2
			;;
		--manifest)
			[ "$#" -ge 2 ] || { echo "missing value for --manifest" >&2; usage >&2; exit 2; }
			manifest_file="$2"
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
		--width)
			[ "$#" -ge 2 ] || { echo "missing value for --width" >&2; usage >&2; exit 2; }
			width="$2"
			shift 2
			;;
		--height)
			[ "$#" -ge 2 ] || { echo "missing value for --height" >&2; usage >&2; exit 2; }
			height="$2"
			shift 2
			;;
		--wait-ms)
			[ "$#" -ge 2 ] || { echo "missing value for --wait-ms" >&2; usage >&2; exit 2; }
			wait_ms="$2"
			shift 2
			;;
		--wait-until)
			[ "$#" -ge 2 ] || { echo "missing value for --wait-until" >&2; usage >&2; exit 2; }
			wait_until="$2"
			shift 2
			;;
		--full-page)
			[ "$#" -ge 2 ] || { echo "missing value for --full-page" >&2; usage >&2; exit 2; }
			full_page="$2"
			shift 2
			;;
		--wait-selector)
			[ "$#" -ge 2 ] || { echo "missing value for --wait-selector" >&2; usage >&2; exit 2; }
			wait_selector="$2"
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

source_modes=0
[ "${#urls[@]}" -gt 0 ] && source_modes=$((source_modes + 1))
[ -n "$input_file" ] && source_modes=$((source_modes + 1))
[ -n "$manifest_file" ] && source_modes=$((source_modes + 1))

if [ "$source_modes" -eq 0 ]; then
	echo "expected one source: --url, --in, or --manifest" >&2
	usage >&2
	exit 2
fi

if [ "$source_modes" -gt 1 ]; then
	echo "use exactly one source mode: --url, --in, or --manifest" >&2
	usage >&2
	exit 2
fi

if [ -n "$input_file" ] && [ ! -f "$input_file" ]; then
	echo "input file not found: $input_file" >&2
	exit 2
fi

if [ -n "$manifest_file" ] && [ ! -f "$manifest_file" ]; then
	echo "manifest file not found: $manifest_file" >&2
	exit 2
fi

if [ -n "$out" ] && [ "${#urls[@]}" -ne 1 ]; then
	echo "--out is supported only with a single --url" >&2
	exit 2
fi

capture_one() {
	local url="$1"
	local -a cmd=("${node_cmd[@]}" "scripts/playwright-capture.mjs" "--url" "$url" "--width" "$width" "--height" "$height" "--wait-ms" "$wait_ms" "--wait-until" "$wait_until" "--full-page" "$full_page")

	if [ -n "$out" ]; then
		cmd+=("--out" "$out")
	elif [ -n "$out_dir" ]; then
		cmd+=("--out-dir" "$out_dir")
	fi

	if [ -n "$wait_selector" ]; then
		cmd+=("--wait-selector" "$wait_selector")
	fi

	"${cmd[@]}"
}

collect_file_urls() {
	local file="$1"
	local line
	while IFS= read -r line; do
		[ -z "$line" ] && continue
		case "$line" in
			\#*) continue ;;
		esac
		urls+=("$line")
	done < "$file"
}

if [ -n "$input_file" ]; then
	collect_file_urls "$input_file"
elif [ -n "$manifest_file" ]; then
	collect_file_urls "$manifest_file"
fi

if [ "${#urls[@]}" -eq 0 ]; then
	echo "no URLs found to capture" >&2
	exit 2
fi

if [ "${#urls[@]}" -gt 1 ] && [ -n "$out" ]; then
	echo "--out cannot be used for multi-URL capture" >&2
	exit 2
fi

if [ -z "$out_dir" ] && [ -z "$out" ]; then
	source_name="${manifest_file:-$input_file}"
	if [ -n "$source_name" ]; then
		pack_name="$(basename "$source_name")"
		pack_name="${pack_name%.urls.txt}"
		pack_name="${pack_name%.txt}"
		out_dir="drafts/screenshots/${pack_name}-$(date +%Y%m%d-%H%M%S)"
	elif [ "${#urls[@]}" -gt 1 ]; then
		out_dir="drafts/screenshots/capture-batch-$(date +%Y%m%d-%H%M%S)"
	fi
fi

for url in "${urls[@]}"; do
	capture_one "$url"
done

if [ "${#urls[@]}" -gt 1 ] || [ -n "$input_file" ] || [ -n "$manifest_file" ]; then
	if [ -n "$out_dir" ]; then
		echo "$out_dir"
	fi
fi
