#!/usr/bin/env bash

set -euo pipefail

if [ "$#" -eq 0 ]; then
	set -- Makefile
fi

declare -A seen_files=()
unique_files=()

for file in "$@"; do
	if [ -n "${seen_files[$file]:-}" ]; then
		continue
	fi
	seen_files["$file"]=1
	unique_files+=("$file")
done

set -- "${unique_files[@]}"

if [ -t 1 ] && [ -z "${CI:-}" ] && [ -z "${NO_COLOR:-}" ]; then
	C_HEAD="$(printf '\033[1;37m')"
	C_TGT="$(printf '\033[34m')"
	C_TAG="$(printf '\033[90m')"
	C_WARN="$(printf '\033[33m')"
	C_RST="$(printf '\033[0m')"
else
	C_HEAD=''
	C_TGT=''
	C_TAG=''
	C_WARN=''
	C_RST=''
fi

FILTER="$(printf '%s' "${HELP_FILTER:-}" | tr '[:upper:]' '[:lower:]')"
SHOW_INTERNAL="${HELP_SHOW_INTERNAL:-}"
TAB="$(printf '\t')"

entries="$(
	awk -v filter="$FILTER" -v show_internal="$SHOW_INTERNAL" '
		function trim(s){ sub(/^[ \t\r\n]+/, "", s); sub(/[ \t\r\n]+$/, "", s); return s }
		function group_order(g){
			if (g=="General") return 1;
			if (g=="Setup") return 2;
			if (g=="Dev") return 3;
			if (g=="Build") return 4;
			if (g=="Quality") return 5;
			if (g=="Tests") return 6;
			if (g=="CI") return 7;
			if (g=="Research") return 8;
			if (g=="Experiment") return 9;
			return 99;
		}
		/^[a-zA-Z0-9_./-]+:.*##[[:space:]]+/ {
			target = $1; sub(/:.*/, "", target);
			if (show_internal != "1" && target ~ /^\./) next;
			desc = $0; sub(/^.*##[[:space:]]*/, "", desc);
			group = "Other"; tags = "";
			if (match(desc, /^\[[^]]+\]/)) {
				group = substr(desc, 2, RLENGTH - 2);
				desc = substr(desc, RLENGTH + 1);
			}
			while (match(desc, /^[[:space:]]*\[[^]]+\]/)) {
				sub(/^[[:space:]]*/, "", desc);
				rb = index(desc, "]");
				if (rb == 0) break;
				tags = tags "[" substr(desc, 2, rb - 2) "]";
				desc = substr(desc, rb + 1);
			}
			desc = trim(desc);
			hay = tolower(target " " group " " tags " " desc);
			if (filter != "" && index(hay, filter) == 0) next;
			printf "%02d\t%s\t%s\t%s\t%s\n", group_order(group), group, target, tags, desc;
		}
	' "$@" | sort -t "$TAB" -k1,1n -k3,3
)"

if [ -n "$entries" ]; then
	printf '%s\n' "$entries" | awk -F "$TAB" -v c_head="$C_HEAD" -v c_tgt="$C_TGT" -v c_tag="$C_TAG" -v c_rst="$C_RST" '
		{
			rows[NR] = $0;
			if (length($3) > width) width = length($3);
		}
		END {
			current = "";
			for (i = 1; i <= NR; i++) {
				split(rows[i], cols, FS);
				if (cols[2] != current) {
					if (current != "") print "";
					printf "%s%s%s\n", c_head, cols[2], c_rst;
					current = cols[2];
				}
				printf "  %s%-*s%s %s", c_tgt, width, cols[3], c_rst, cols[5];
				if (cols[4] != "") printf " %s%s%s", c_tag, cols[4], c_rst;
				printf "\n";
			}
		}
	'
else
	printf 'No targets matched the current filter.\n'
fi

printf '\n'
printf '%sQuick Start%s\n' "$C_HEAD" "$C_RST"
printf '  make up\n'
printf '  make test\n'
printf '  make eslint\n'
printf '  make help filter=experiment\n'

printf '\n'
printf '%sExamples%s\n' "$C_HEAD" "$C_RST"
printf '  make help filter=playwright\n'
printf "  make help filter='[safe]'\n"
printf '  make help show_internal=1\n'
printf "  make test cli='m3-react'\n"

dup_targets="$(
	awk -F: '/^[a-zA-Z0-9_./-]+:/ && $1 != ".PHONY" { print $1 }' "$@" | sort | uniq -d | tr '\n' ' '
)"
dup_phony="$(
	awk '/^\.PHONY:[[:space:]]*/ { for (i = 2; i <= NF; i++) print $i }' "$@" | sort | uniq -d | tr '\n' ' '
)"

if [ -n "$dup_targets$dup_phony" ]; then
	printf '\n'
	printf '%sWarnings%s\n' "$C_WARN" "$C_RST"
	if [ -n "$dup_targets" ]; then
		printf '  duplicate targets: %s\n' "$dup_targets"
	fi
	if [ -n "$dup_phony" ]; then
		printf '  duplicate .PHONY entries: %s\n' "$dup_phony"
	fi
fi
