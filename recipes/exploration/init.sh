#!/usr/bin/env sh

set -eu

slug_raw="activity"
activity_dir=""
activities_root="${EXPLORATION_ACTIVITIES_ROOT:-drafts/explorations}"

while [ "$#" -gt 0 ]; do
	case "$1" in
		--slug)
			shift
			slug_raw="${1:-}"
			;;
		--activity-dir)
			shift
			activity_dir="${1:-}"
			;;
		*)
			echo "usage: $0 [--slug <slug>] [--activity-dir <dir>]" >&2
			exit 2
			;;
	esac
	shift
done

slug="$(printf '%s' "$slug_raw" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9._-]/-/g' | sed 's/--*/-/g' | sed 's/^-//; s/-$//')"

if [ -z "$slug" ]; then
	slug="activity"
fi

if [ -z "$activity_dir" ]; then
	activity_dir="$activities_root/$(date +%Y%m%d-%H%M)-$slug"
fi

mkdir -p \
	"$activity_dir" \
	"$activity_dir/inputs" \
	"$activity_dir/artifacts/fetch" \
	"$activity_dir/artifacts/screenshots"

for file in plan.md notes.md decisions.md artifacts.md summary.md; do
	if [ ! -f "$activity_dir/$file" ]; then
		: > "$activity_dir/$file"
	fi
done

if [ ! -f "$activity_dir/index.md" ]; then
	cat > "$activity_dir/index.md" <<EOF
# Exploration: $slug

## Задача
- Заполнить перед фактическим стартом exploration.

## Статус
- Состояние: planned
- Примечание: каталог подготовлен через \`make exploration-init\`, exploration еще не запущен.

## Ссылки
- [План](./plan.md)
- [Лог наблюдений](./notes.md)
- [Решения](./decisions.md)
- [Артефакты](./artifacts.md)
- [Сводка](./summary.md)
EOF
fi

printf '%s\n' "$activity_dir"
