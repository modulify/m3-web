include recipes/common.mk

M3_RESEARCH_PACKS_DIR?=recipes/research/packs
M3_DEFAULT_RESEARCH_PACK?=surfaces
EXPLORATION_ACTIVITIES_ROOT?=drafts/explorations
EXPLORATION_INPUTS_ROOT?=$(EXPLORATION_ACTIVITIES_ROOT)/inputs
EXPLORATION_BOOTSTRAP_PROFILES?=compact medium expanded

.PHONY: exploration-init
exploration-init: ## [Exploration][safe] Creates an activity directory skeleton from exploration-workflow without starting exploration
	$(TARGET_HEADER)
	@EXPLORATION_ACTIVITIES_ROOT='$(EXPLORATION_ACTIVITIES_ROOT)' sh ./recipes/exploration/init.sh \
		$(if $(slug),--slug '$(slug)',) \
		$(if $(activity_dir),--activity-dir '$(activity_dir)',)
	$(TARGET_OK)

.PHONY: exploration-preflight-local
exploration-preflight-local: ## [Exploration][safe] Validates required local CLI tools for exploration support
	$(TARGET_HEADER)
	@command -v jq >/dev/null
	@command -v rg >/dev/null
	@echo "preflight-local:ok"
	$(TARGET_OK)

.PHONY: exploration-preflight-docker
exploration-preflight-docker: ## [Exploration][escalated][docker] Validates Docker Compose and Playwright runtime prerequisites
	$(TARGET_HEADER)
	@set -e; \
	$(DOCKER_COMPOSE) ps >/dev/null; \
	$(PLAYWRIGHT_NODE_CMD) -e "console.log('playwright node', process.version)"; \
	echo "preflight-docker:ok"
	$(TARGET_OK)

.PHONY: exploration-preflight-network
exploration-preflight-network: ## [Exploration][escalated][network] Validates remote network access required for evidence collection
	$(TARGET_HEADER)
	@set -e; \
	curl -fLsS -A "$(M3_UA)" "https://m3.material.io/" -o /dev/null; \
	echo "preflight-network:ok"
	$(TARGET_OK)

.PHONY: exploration-bootstrap
# Example:
#   make exploration-bootstrap activity_dir=drafts/explorations/20260307-2015-surface-layer pack=surfaces profiles='compact medium expanded'
exploration-bootstrap: ## [Exploration][escalated][docker][network][heavy] Runs bounded evidence bootstrap into an initialized activity directory
	$(TARGET_HEADER)
	@if [ -z "$(activity_dir)" ] && [ -z "$(run_dir)" ]; then echo "usage: make exploration-bootstrap activity_dir=drafts/explorations/<id> [pack=surfaces]"; exit 2; fi
	@set -e; \
	ACTIVITY_DIR="$(if $(activity_dir),$(activity_dir),$(run_dir))"; \
	if [ ! -f "$$ACTIVITY_DIR/index.md" ]; then \
		echo "activity_dir is not initialized: $$ACTIVITY_DIR (run make exploration-init first)"; \
		exit 2; \
	fi; \
	PACK="$(if $(pack),$(pack),$(M3_DEFAULT_RESEARCH_PACK))"; \
	PROFILES="$(if $(profiles),$(profiles),$(EXPLORATION_BOOTSTRAP_PROFILES))"; \
	FETCH_MANIFEST="$(if $(fetch_manifest),$(fetch_manifest),$(M3_RESEARCH_PACKS_DIR)/$${PACK}.page-data.tsv)"; \
	CAPTURE_MANIFEST="$(if $(capture_manifest),$(capture_manifest),$(M3_RESEARCH_PACKS_DIR)/$${PACK}.urls.txt)"; \
	$(MAKE) --no-print-directory exploration-preflight-local; \
	$(MAKE) --no-print-directory exploration-preflight-docker; \
	$(MAKE) --no-print-directory exploration-preflight-network; \
	$(MAKE) --no-print-directory research-fetch-batch format=json manifest="$$FETCH_MANIFEST" out_dir="$$ACTIVITY_DIR/artifacts/fetch"; \
	for profile in $$PROFILES; do \
		case "$$profile" in \
			compact) WIDTH=390; HEIGHT=844 ;; \
			medium) WIDTH=840; HEIGHT=1080 ;; \
			expanded) WIDTH=1440; HEIGHT=1024 ;; \
			*) echo "unsupported profile: $$profile (expected compact|medium|expanded)"; exit 2 ;; \
		esac; \
		$(MAKE) --no-print-directory research-capture-batch \
			manifest="$$CAPTURE_MANIFEST" \
			out_dir="$$ACTIVITY_DIR/artifacts/screenshots/$${profile}-$${PACK}" \
			width="$$WIDTH" \
			height="$$HEIGHT" \
			wait_ms="$(if $(wait_ms),$(wait_ms),1200)" \
			full_page="$(if $(full_page),$(full_page),true)" \
			$(if $(wait_selector),wait_selector="$(wait_selector)",); \
	done; \
	echo "$$ACTIVITY_DIR"
	$(TARGET_OK)

.PHONY: exploration-prepare-batch
# Example:
#   make exploration-prepare-batch activity_dir=drafts/explorations/20260307-2015-surface-layer pack=surfaces
#   make exploration-prepare-batch manifest=recipes/research/packs/surfaces.urls.txt out=drafts/explorations/inputs/custom.urls.txt
exploration-prepare-batch: ## [Exploration][safe] Prepares a URL batch input file for research capture recipes from a research pack
	$(TARGET_HEADER)
	@set -e; \
	PACK="$(if $(pack),$(pack),$(M3_DEFAULT_RESEARCH_PACK))"; \
	MANIFEST="$(if $(manifest),$(manifest),$(M3_RESEARCH_PACKS_DIR)/$${PACK}.urls.txt)"; \
	OUT="$(if $(out),$(out),$(if $(activity_dir),$(activity_dir)/inputs/$${PACK}.urls.txt,$(EXPLORATION_INPUTS_ROOT)/$${PACK}.urls.txt))"; \
	mkdir -p "$$(dirname "$$OUT")"; \
	cp "$$MANIFEST" "$$OUT"; \
	echo "$$OUT"
	$(TARGET_OK)

.PHONY: exploration-summarize
exploration-summarize: ## [Exploration][safe] Writes and prints a local artifact summary for an exploration activity directory
	$(TARGET_HEADER)
	@ACTIVITY_DIR='$(if $(activity_dir),$(activity_dir),$(run_dir))' sh ./recipes/exploration/summarize.sh \
		$(if $(out),--out '$(out)',)
	$(TARGET_OK)
