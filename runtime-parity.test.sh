#!/usr/bin/env sh

set -eu

if command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then
  DC_CMD='docker compose'
elif command -v docker-compose >/dev/null 2>&1; then
  DC_CMD='docker-compose'
else
  echo "Error: neither 'docker compose' nor 'docker-compose' is available." >&2
  exit 1
fi

compose() {
  # shellcheck disable=SC2086
  $DC_CMD "$@"
}

version_for() {
  service="$1"
  binary="$2"

  compose run --rm "$service" "$binary" --version | awk 'END { print }' | tr -d '\r'
}

expected_node="$(version_for node node)"
expected_yarn="$(version_for node yarn)"

for service in node storybook-react storybook-vue playwright; do
  node_version="$(version_for "$service" node)"
  yarn_version="$(version_for "$service" yarn)"

  if [ "$node_version" != "$expected_node" ]; then
    echo "Node mismatch in $service: $node_version (expected $expected_node)"
    exit 1
  fi

  if [ "$yarn_version" != "$expected_yarn" ]; then
    echo "Yarn mismatch in $service: $yarn_version (expected $expected_yarn)"
    exit 1
  fi

  echo "$service: node=$node_version yarn=$yarn_version"
done
