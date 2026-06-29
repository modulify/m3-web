ACT_VERSION ?= v0.2.89

.PHONY: ci-actionlint
ci-actionlint: ## [CI][docker][lint] Lints GitHub Actions workflows locally (actionlint binary or docker image)
	$(TARGET_HEADER)
	@if command -v actionlint >/dev/null 2>&1; then \
		actionlint; \
	elif command -v docker >/dev/null 2>&1; then \
		docker run --rm -v "$$(pwd):/repo" -w /repo rhysd/actionlint:latest; \
	else \
		echo "actionlint is not installed and docker is unavailable"; \
		exit 1; \
	fi
	$(TARGET_OK)

.PHONY: ci-act-plan
ci-act-plan: ## [CI][docker] Shows act execution plan for tests workflow without running jobs
	$(TARGET_HEADER)
	@if command -v act >/dev/null 2>&1; then \
		act -P ubuntu-latest=catthehacker/ubuntu:act-latest -n pull_request -W .github/workflows/tests.yml; \
	elif command -v docker >/dev/null 2>&1; then \
		docker run --rm -v /var/run/docker.sock:/var/run/docker.sock -v "$$(pwd):/repo" -w /repo alpine:3.20 sh -lc "apk add --no-cache curl tar >/dev/null && curl -fsSL https://github.com/nektos/act/releases/download/$(ACT_VERSION)/act_Linux_x86_64.tar.gz | tar -xz -C /tmp && /tmp/act -P ubuntu-latest=catthehacker/ubuntu:act-latest -n pull_request -W .github/workflows/tests.yml"; \
	else \
		echo "act is not installed and docker is unavailable"; \
		exit 1; \
	fi
	$(TARGET_OK)

.PHONY: ci-act-tests
ci-act-tests: ## [CI][docker][heavy][network] Runs tests workflow locally via act (pr-check, eslint, tests, storybook-tests)
	$(TARGET_HEADER)
	@if command -v act >/dev/null 2>&1; then \
		act -P ubuntu-latest=catthehacker/ubuntu:act-latest pull_request -W .github/workflows/tests.yml -j pr-check -j eslint -j tests -j storybook-tests; \
	elif command -v docker >/dev/null 2>&1; then \
		docker run --rm -v /var/run/docker.sock:/var/run/docker.sock -v "$$(pwd):/repo" -w /repo alpine:3.20 sh -lc "apk add --no-cache curl tar >/dev/null && curl -fsSL https://github.com/nektos/act/releases/download/$(ACT_VERSION)/act_Linux_x86_64.tar.gz | tar -xz -C /tmp && /tmp/act -P ubuntu-latest=catthehacker/ubuntu:act-latest pull_request -W .github/workflows/tests.yml -j pr-check -j eslint -j tests -j storybook-tests"; \
	else \
		echo "act is not installed and docker is unavailable"; \
		exit 1; \
	fi
	$(TARGET_OK)

.PHONY: ci-check
ci-check: ci-actionlint ci-act-plan ## [CI][alias] Validates CI workflow config and prints local act plan
	$(TARGET_OK)
