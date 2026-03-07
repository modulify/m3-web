.DEFAULT_GOAL := help

TARGET_HEADER=@echo -e '===== \e[34m' $@ '\e[0m'
TARGET_OK=@echo -e '\e[32mOK\e[0m'
YARN=@docker-compose run --rm node yarn
YARN_PLAYWRIGHT=@docker-compose run --rm playwright yarn
PLAYWRIGHT_NODE=@docker-compose run --rm playwright node
PLAYWRIGHT_NODE_CMD=$(patsubst @%,%,$(PLAYWRIGHT_NODE))
COVERAGE_PARTS_DIR=coverage/.parts
COVERAGE_UNIT_DIR=coverage/unit
COVERAGE_E2E_REACT_DIR=coverage/e2e-react
COVERAGE_E2E_VUE_DIR=coverage/e2e-vue
NYC_OUTPUT_DIR=.nyc_output
M3_FETCH_OUT_DIR?=/tmp/m3-fetch
M3_UA?=m3-web-research/1.0
M3_CAPTURE_OUT_DIR?=drafts/screenshots
M3_RESEARCH_PACKS_DIR?=recipes/research/packs
M3_DEFAULT_RESEARCH_PACK?=surfaces
M3_EXPERIMENT_ROOT?=drafts/experiment
M3_EXPERIMENT_URLS_DIR?=$(M3_EXPERIMENT_ROOT)/urls
M3_EXPERIMENT_BOOTSTRAP_PROFILES?=compact medium expanded

.PHONY: up
up: ## [Dev][docker] Starts storybook
	$(TARGET_HEADER)
	docker-compose up -d

.PHONY: restart
restart: ## [Dev][docker] Restarts all docker services or a particular service, if argument "service" is specified (example: make restart service="storybook")
	$(TARGET_HEADER)

ifdef service
	yes | docker-compose rm -s -v $(service) && docker-compose up -d $(service)
else
	docker-compose stop && docker-compose up -d
endif

.PHONY: stop
stop: ## [Dev][docker] Stops all docker services
	$(TARGET_HEADER)
	docker-compose stop

include recipes/common.mk

.PHONY: build
build: node_modules ## [Build][docker] Creates a dist catalogue with library build
	$(TARGET_HEADER)
	$(YARN) build

include recipes/storybook.mk
include recipes/lint.mk
include recipes/tests.mk
include recipes/research.mk

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
		docker run --rm -v /var/run/docker.sock:/var/run/docker.sock -v "$$(pwd):/repo" -w /repo alpine:3.20 sh -lc "apk add --no-cache curl tar >/dev/null && curl -fsSL https://github.com/nektos/act/releases/download/v0.2.84/act_Linux_x86_64.tar.gz | tar -xz -C /tmp && /tmp/act -P ubuntu-latest=catthehacker/ubuntu:act-latest -n pull_request -W .github/workflows/tests.yml"; \
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
		docker run --rm -v /var/run/docker.sock:/var/run/docker.sock -v "$$(pwd):/repo" -w /repo alpine:3.20 sh -lc "apk add --no-cache curl tar >/dev/null && curl -fsSL https://github.com/nektos/act/releases/download/v0.2.84/act_Linux_x86_64.tar.gz | tar -xz -C /tmp && /tmp/act -P ubuntu-latest=catthehacker/ubuntu:act-latest pull_request -W .github/workflows/tests.yml -j pr-check -j eslint -j tests -j storybook-tests"; \
	else \
		echo "act is not installed and docker is unavailable"; \
		exit 1; \
	fi
	$(TARGET_OK)

.PHONY: ci-check
ci-check: ci-actionlint ci-act-plan ## [CI][alias] Validates CI workflow config and prints local act plan
	$(TARGET_OK)

.PHONY: m3/experiment/list
m3/experiment/list: ## [Experiment][safe] Lists experiment-tagged recipes and their purpose
	@$(MAKE) --no-print-directory help filter=experiment

.PHONY: m3/experiment/list-escalation
m3/experiment/list-escalation: ## [Experiment][safe] Lists recipes blocked in no-escalation experiment mode
	@$(MAKE) --no-print-directory help filter='[escalated]'

.PHONY: m3/experiment/list-safe
m3/experiment/list-safe: ## [Experiment][safe] Lists local-only recipes safe in no-escalation mode
	@$(MAKE) --no-print-directory help filter='[safe]'

.PHONY: m3/experiment/init
m3/experiment/init: ## [Experiment][safe] Creates an experiment run directory with standard subfolders
	$(TARGET_HEADER)
	@RUN_DIR="$(if $(run_dir),$(run_dir),$(M3_EXPERIMENT_ROOT)/runs/$$(date +%Y%m%d-%H%M%S))"; \
	mkdir -p "$$RUN_DIR"/screenshots "$$RUN_DIR"/fetch "$$RUN_DIR"/notes; \
	echo "$$RUN_DIR"
	$(TARGET_OK)

.PHONY: m3/experiment/preflight
m3/experiment/preflight: ## [Experiment][escalated][docker][network] Validates docker/playwright/network prerequisites for long runs
	$(TARGET_HEADER)
	@set -e; \
	command -v jq >/dev/null; \
	command -v rg >/dev/null; \
	docker-compose ps >/dev/null; \
	$(PLAYWRIGHT_NODE_CMD) -e "console.log('playwright node', process.version)"; \
	curl -fLsS -A "$(M3_UA)" "https://m3.material.io/" -o /dev/null; \
	echo "preflight:ok"
	$(TARGET_OK)

.PHONY: m3/experiment/bootstrap
m3/experiment/bootstrap: ## [Experiment][escalated][docker] One-shot setup: list recipes, init run dir, run preflight checks
	$(TARGET_HEADER)
	@$(MAKE) --no-print-directory m3/experiment/list
	@$(MAKE) --no-print-directory m3/experiment/init $(if $(run_dir),run_dir="$(run_dir)",)
	@$(MAKE) --no-print-directory m3/experiment/preflight
	$(TARGET_OK)

.PHONY: m3/experiment/bootstrap/evidence
# Example:
#   make m3/experiment/bootstrap/evidence pack=surfaces profiles='compact medium expanded'
m3/experiment/bootstrap/evidence: ## [Experiment][escalated][docker][network][heavy] One-shot privileged bootstrap: preflight + fetch + multi-profile capture
	$(TARGET_HEADER)
	@set -e; \
	RUN_DIR="$(if $(run_dir),$(run_dir),$(M3_EXPERIMENT_ROOT)/runs/$$(date +%Y%m%d-%H%M%S))"; \
	PACK="$(if $(pack),$(pack),$(M3_DEFAULT_RESEARCH_PACK))"; \
	PROFILES="$(if $(profiles),$(profiles),$(M3_EXPERIMENT_BOOTSTRAP_PROFILES))"; \
	$(MAKE) --no-print-directory m3/experiment/init run_dir="$$RUN_DIR"; \
	$(MAKE) --no-print-directory m3/experiment/preflight; \
	$(MAKE) --no-print-directory m3/experiment/fetch/pack pack="$$PACK" out_dir="$$RUN_DIR/fetch"; \
	for profile in $$PROFILES; do \
		$(MAKE) --no-print-directory m3/experiment/capture/pack \
			pack="$$PACK" \
			profile="$$profile" \
			out_dir="$$RUN_DIR/screenshots/$${profile}-$${PACK}" \
			wait_ms="$(if $(wait_ms),$(wait_ms),1200)" \
			full_page="$(if $(full_page),$(full_page),true)"; \
	done; \
	echo "$$RUN_DIR"
	$(TARGET_OK)

.PHONY: m3/experiment/capture/pack
# Example:
#   make m3/experiment/capture/pack pack=surfaces profile=compact
#   make m3/experiment/capture/pack manifest=recipes/research/packs/surfaces.urls.txt profile=expanded
m3/experiment/capture/pack: ## [Experiment][escalated][docker][playwright] Captures a research URL pack with viewport profile (compact|medium|expanded)
	$(TARGET_HEADER)
	@set -e; \
	PROFILE="$(if $(profile),$(profile),expanded)"; \
	PACK="$(if $(pack),$(pack),$(M3_DEFAULT_RESEARCH_PACK))"; \
	MANIFEST="$(if $(manifest),$(manifest),$(M3_RESEARCH_PACKS_DIR)/$${PACK}.urls.txt)"; \
	case "$$PROFILE" in \
		compact) WIDTH=390; HEIGHT=844 ;; \
		medium) WIDTH=840; HEIGHT=1080 ;; \
		expanded) WIDTH=1440; HEIGHT=1024 ;; \
		*) echo "unsupported profile: $$PROFILE (expected compact|medium|expanded)"; exit 2 ;; \
	esac; \
	OUT_DIR="$(if $(out_dir),$(out_dir),$(M3_EXPERIMENT_ROOT)/runs/$$(date +%Y%m%d-%H%M%S)/screenshots/$$PROFILE-$${PACK})"; \
	$(MAKE) --no-print-directory research-capture-batch \
		manifest="$$MANIFEST" \
		out_dir="$$OUT_DIR" \
		width="$$WIDTH" \
		height="$$HEIGHT" \
		wait_ms="$(if $(wait_ms),$(wait_ms),1200)" \
		full_page="$(if $(full_page),$(full_page),true)"; \
	echo "$$OUT_DIR"
	$(TARGET_OK)

.PHONY: m3/experiment/capture/urls-file
m3/experiment/capture/urls-file: ## [Experiment][escalated][docker][playwright] Captures URLs from a file with viewport profile (compact|medium|expanded)
	$(TARGET_HEADER)
	@if [ -z "$(in)" ]; then echo "usage: make m3/experiment/capture/urls-file in=$(M3_EXPERIMENT_URLS_DIR)/<pack>.txt [profile=compact|medium|expanded] [out_dir=...]"; exit 2; fi
	@set -e; \
	PROFILE="$(if $(profile),$(profile),expanded)"; \
	case "$$PROFILE" in \
		compact) WIDTH=390; HEIGHT=844 ;; \
		medium) WIDTH=840; HEIGHT=1080 ;; \
		expanded) WIDTH=1440; HEIGHT=1024 ;; \
		*) echo "unsupported profile: $$PROFILE (expected compact|medium|expanded)"; exit 2 ;; \
	esac; \
	OUT_DIR="$(if $(out_dir),$(out_dir),$(M3_EXPERIMENT_ROOT)/runs/$$(date +%Y%m%d-%H%M%S)/screenshots/$$PROFILE)"; \
	$(MAKE) --no-print-directory research-capture-batch \
		in="$(in)" \
		out_dir="$$OUT_DIR" \
		width="$$WIDTH" \
		height="$$HEIGHT" \
		wait_ms="$(if $(wait_ms),$(wait_ms),1200)" \
		full_page="$(if $(full_page),$(full_page),true)" \
		$(if $(wait_selector),wait_selector="$(wait_selector)",); \
	echo "$$OUT_DIR"
	$(TARGET_OK)

.PHONY: m3/experiment/fetch/pack
# Example:
#   make m3/experiment/fetch/pack pack=surfaces out_dir=drafts/experiment/run-1/fetch
#   make m3/experiment/fetch/pack manifest=recipes/research/packs/surfaces.page-data.tsv
m3/experiment/fetch/pack: ## [Experiment][escalated][network][fetch] Fetches a research page-data pack into an experiment run directory
	$(TARGET_HEADER)
	@set -e; \
	PACK="$(if $(pack),$(pack),$(M3_DEFAULT_RESEARCH_PACK))"; \
	MANIFEST="$(if $(manifest),$(manifest),$(M3_RESEARCH_PACKS_DIR)/$${PACK}.page-data.tsv)"; \
	OUT_DIR="$(if $(out_dir),$(out_dir),$(M3_EXPERIMENT_ROOT)/runs/$$(date +%Y%m%d-%H%M%S)/fetch)"; \
	mkdir -p "$$OUT_DIR"; \
	$(MAKE) --no-print-directory research-fetch-batch format=json manifest="$$MANIFEST" out_dir="$$OUT_DIR"; \
	echo "$$OUT_DIR"
	$(TARGET_OK)

.PHONY: m3/experiment/urls-template
# Example:
#   make m3/experiment/urls-template pack=surfaces
#   make m3/experiment/urls-template manifest=recipes/research/packs/surfaces.urls.txt out=drafts/experiment/urls/custom.txt
m3/experiment/urls-template: ## [Experiment][safe] Creates a starter URL list for batch captures from a research pack
	$(TARGET_HEADER)
	@set -e; \
	PACK="$(if $(pack),$(pack),$(M3_DEFAULT_RESEARCH_PACK))"; \
	MANIFEST="$(if $(manifest),$(manifest),$(M3_RESEARCH_PACKS_DIR)/$${PACK}.urls.txt)"; \
	OUT="$(if $(out),$(out),$(M3_EXPERIMENT_URLS_DIR)/$${PACK}.txt)"; \
	mkdir -p "$$(dirname "$$OUT")"; \
	cp "$$MANIFEST" "$$OUT"; \
	echo "$$OUT"
	$(TARGET_OK)

.PHONY: m3/experiment/manifest
m3/experiment/manifest: ## [Experiment][safe] Prints recommended order for a long experiment run
	$(TARGET_HEADER)
	@printf '%s\n' \
		"1) make m3/experiment/list && make m3/experiment/list-escalation" \
		"2) (if sanctioned) make m3/experiment/bootstrap/evidence [pack=surfaces] [run_dir=...] [profiles='compact medium expanded']" \
		"3) switch to no-escalation mode and keep only local analysis" \
		"4) make m3/experiment/analyze/local-summary run_dir=..." \
		"5) continue milestones/decisions based on local artifacts"
	$(TARGET_OK)

.PHONY: m3/experiment/analyze/local-summary
m3/experiment/analyze/local-summary: ## [Experiment][safe] Prints local artifact summary for a completed/ongoing run (no escalation)
	$(TARGET_HEADER)
	@if [ -z "$(run_dir)" ]; then echo "usage: make m3/experiment/analyze/local-summary run_dir=drafts/experiment/runs/<id>"; exit 2; fi
	@set -e; \
	FETCH_DIR="$(run_dir)/fetch"; \
	SCREEN_DIR="$(run_dir)/screenshots"; \
	FETCH_COUNT=$$(find "$$FETCH_DIR" -maxdepth 1 -type f -name '*.json' 2>/dev/null | wc -l); \
	echo "fetch_json=$$FETCH_COUNT"; \
	find "$$SCREEN_DIR" -mindepth 1 -maxdepth 1 -type d 2>/dev/null | sort | while IFS= read -r dir; do \
		name="$$(basename "$$dir")"; \
		META_COUNT=$$(find "$$dir" -maxdepth 1 -type f -name '*.meta.json' 2>/dev/null | wc -l); \
		PNG_COUNT=$$(find "$$dir" -maxdepth 1 -type f -name '*.png' 2>/dev/null | wc -l); \
		echo "$$name: png=$$PNG_COUNT meta=$$META_COUNT"; \
	done
	$(TARGET_OK)

.PHONY: help
help: ## [General] Shows grouped command help
	@HELP_FILTER="$(value filter)" HELP_SHOW_INTERNAL="$(value show_internal)" ./recipes/help.sh $(MAKEFILE_LIST)

# Colors
$(call computable,CC_BLACK,$(shell tput -Txterm setaf 0 2>/dev/null))
$(call computable,CC_RED,$(shell tput -Txterm setaf 1 2>/dev/null))
$(call computable,CC_GREEN,$(shell tput -Txterm setaf 2 2>/dev/null))
$(call computable,CC_YELLOW,$(shell tput -Txterm setaf 3 2>/dev/null))
$(call computable,CC_BLUE,$(shell tput -Txterm setaf 4 2>/dev/null))
$(call computable,CC_MAGENTA,$(shell tput -Txterm setaf 5 2>/dev/null))
$(call computable,CC_CYAN,$(shell tput -Txterm setaf 6 2>/dev/null))
$(call computable,CC_WHITE,$(shell tput -Txterm setaf 7 2>/dev/null))
$(call computable,CC_END,$(shell tput -Txterm sgr0 2>/dev/null))
