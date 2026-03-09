M3_FETCH_OUT_DIR?=/tmp/m3-fetch

# Example:
#   make research-fetch url='https://m3.material.io/'
#   make research-fetch format=json collection=ComponentsM3 document=5634981699387392
.PHONY: research-fetch
research-fetch: ## [Research][network][fetch] Fetches a raw URL or page-data JSON (set format=json with collection/document)
	$(TARGET_HEADER)
	@M3_UA='$(M3_UA)' M3_FETCH_OUT_DIR='$(M3_FETCH_OUT_DIR)' ./recipes/research/fetch.sh \
		--format "$(if $(format),$(format),raw)" \
		$(if $(url),--url "$(url)",) \
		$(if $(collection),--collection "$(collection)",) \
		$(if $(document),--document "$(document)",) \
		$(if $(out),--out "$(out)",)
	$(TARGET_OK)

# Example:
#   make research-fetch-batch format=json manifest=recipes/research/packs/surfaces.page-data.tsv out_dir=/tmp/m3-research
# Manifest format for format=json:
#   <slug>\t<collection>\t<document_id>
.PHONY: research-fetch-batch
research-fetch-batch: ## [Research][network][fetch] Fetches a batch by format; use format=json for page-data TSV manifests
	$(TARGET_HEADER)
	@M3_UA='$(M3_UA)' M3_FETCH_OUT_DIR='$(M3_FETCH_OUT_DIR)' ./recipes/research/fetch.sh \
		--format "$(if $(format),$(format),json)" \
		--manifest "$(manifest)" \
		$(if $(out_dir),--out-dir "$(out_dir)",)
	$(TARGET_OK)

.PHONY: research-inspect
research-inspect: ## [Research][inspect] Prints quick summary for page-data JSON (requires: in)
	$(TARGET_HEADER)
	@if [ -z "$(in)" ]; then echo "usage: make research-inspect in=/tmp/page.json"; exit 2; fi
	@jq -r '"title=\(.title // "")", "document_id=\(.document_id // "")", "modified_date=\(.modified_date // "")", "mdc_android_markdown_len=\((.mdc_android.markdown_content // "" | length))", "jetpack_markdown_len=\((.jetpack.markdown_content // "" | length))", "mdc_web_markdown_len=\((.mdc_web.markdown_content // "" | length))"' "$(in)"
	$(TARGET_OK)

.PHONY: research-extract-markdown
research-extract-markdown: ## [Research][extract] Extracts markdown_content from page-data JSON (requires: in, optional: platform, out)
	$(TARGET_HEADER)
	@if [ -z "$(in)" ]; then echo "usage: make research-extract-markdown in=/tmp/page.json [platform=mdc_android] [out=/tmp/page.md]"; exit 2; fi
	@PLATFORM="$(if $(platform),$(platform),mdc_android)"; \
	OUT="$(if $(out),$(out),$(M3_FETCH_OUT_DIR)/$$(basename "$(in)" .json)_$${PLATFORM}.md)"; \
	mkdir -p "$$(dirname "$$OUT")"; \
	jq -r --arg p "$$PLATFORM" '.[$$p].markdown_content // ""' "$(in)" > "$$OUT"; \
	echo "$$OUT"
	$(TARGET_OK)

.PHONY: research-extract-search-snippets
research-extract-search-snippets: ## [Research][extract][search] Prints title/link/snippet from saved custom-search JSON (requires: in, optional: filter)
	$(TARGET_HEADER)
	@if [ -z "$(in)" ]; then echo "usage: make research-extract-search-snippets in=/tmp/search.json [filter='side-sheets|menus']"; exit 2; fi
	@if [ -n "$(filter)" ]; then \
		jq -r '.items[] | "TITLE: \(.title)\nLINK: \(.link)\nSNIPPET: \(.snippet)\n---"' "$(in)" | rg -n "$(filter)|TITLE:|LINK:|SNIPPET:"; \
	else \
		jq -r '.items[] | "TITLE: \(.title)\nLINK: \(.link)\nSNIPPET: \(.snippet)\n---"' "$(in)"; \
	fi
	$(TARGET_OK)

.PHONY: research-capture
research-capture: ## [Research][docker][playwright][capture] Captures screenshot+meta via Playwright (requires: url, optional: out/out_dir/wait_ms/wait_selector/width/height/full_page/wait_until)
	$(TARGET_HEADER)
	@PLAYWRIGHT_NODE_CMD='$(PLAYWRIGHT_NODE_CMD)' ./recipes/research/capture.sh \
		--url "$(url)" \
		$(if $(out),--out "$(out)",) \
		$(if $(out_dir),--out-dir "$(out_dir)",) \
		$(if $(width),--width "$(width)",) \
		$(if $(height),--height "$(height)",) \
		$(if $(wait_ms),--wait-ms "$(wait_ms)",) \
		$(if $(wait_until),--wait-until "$(wait_until)",) \
		$(if $(full_page),--full-page "$(full_page)",) \
		$(if $(wait_selector),--wait-selector "$(wait_selector)",)
	$(TARGET_OK)

# Example:
#   make research-capture-batch manifest=recipes/research/packs/surfaces.urls.txt out_dir=drafts/screenshots/surfaces
#   make research-capture-batch in=drafts/explorations/20260307-2015-surface-layer/inputs/surfaces.urls.txt out_dir=drafts/screenshots/custom
# Input format:
#   One URL per line; empty lines and #comments are ignored.
.PHONY: research-capture-batch
research-capture-batch: ## [Research][docker][playwright][capture] Captures screenshots from a URL manifest or input file
	$(TARGET_HEADER)
	@PLAYWRIGHT_NODE_CMD='$(PLAYWRIGHT_NODE_CMD)' ./recipes/research/capture.sh \
		$(if $(manifest),--manifest "$(manifest)",) \
		$(if $(in),--in "$(in)",) \
		$(if $(out_dir),--out-dir "$(out_dir)",) \
		$(if $(width),--width "$(width)",) \
		$(if $(height),--height "$(height)",) \
		$(if $(wait_ms),--wait-ms "$(wait_ms)",) \
		$(if $(wait_until),--wait-until "$(wait_until)",) \
		$(if $(full_page),--full-page "$(full_page)",) \
		$(if $(wait_selector),--wait-selector "$(wait_selector)",)
	$(TARGET_OK)

.PHONY: research-dom-snapshot
research-dom-snapshot: ## [Research][docker][playwright][inspect] Saves outerHTML/text snapshot for a page selector
	$(TARGET_HEADER)
	@$(PLAYWRIGHT_NODE_CMD) scripts/playwright-research.mjs \
		--action dom-snapshot \
		--url "$(url)" \
		$(if $(selector),--selector "$(selector)",) \
		$(if $(out),--out "$(out)",) \
		$(if $(out_dir),--out-dir "$(out_dir)",) \
		$(if $(width),--width "$(width)",) \
		$(if $(height),--height "$(height)",) \
		$(if $(wait_ms),--wait-ms "$(wait_ms)",) \
		$(if $(wait_until),--wait-until "$(wait_until)",) \
		$(if $(wait_selector),--wait-selector "$(wait_selector)",)
	$(TARGET_OK)

.PHONY: research-style-dump
research-style-dump: ## [Research][docker][playwright][inspect] Saves computed styles and CSS variables for a selector
	$(TARGET_HEADER)
	@$(PLAYWRIGHT_NODE_CMD) scripts/playwright-research.mjs \
		--action style-dump \
		--url "$(url)" \
		$(if $(selector),--selector "$(selector)",) \
		$(if $(props),--props "$(props)",) \
		$(if $(var_prefixes),--var-prefixes "$(var_prefixes)",) \
		$(if $(out),--out "$(out)",) \
		$(if $(out_dir),--out-dir "$(out_dir)",) \
		$(if $(width),--width "$(width)",) \
		$(if $(height),--height "$(height)",) \
		$(if $(wait_ms),--wait-ms "$(wait_ms)",) \
		$(if $(wait_until),--wait-until "$(wait_until)",) \
		$(if $(wait_selector),--wait-selector "$(wait_selector)",)
	$(TARGET_OK)

.PHONY: research-layout-metrics
research-layout-metrics: ## [Research][docker][playwright][inspect] Saves bounding boxes and layout metrics for selectors
	$(TARGET_HEADER)
	@$(PLAYWRIGHT_NODE_CMD) scripts/playwright-research.mjs \
		--action layout-metrics \
		--url "$(url)" \
		$(if $(selector),--selector "$(selector)",) \
		$(if $(selectors),--selectors "$(selectors)",) \
		$(if $(out),--out "$(out)",) \
		$(if $(out_dir),--out-dir "$(out_dir)",) \
		$(if $(width),--width "$(width)",) \
		$(if $(height),--height "$(height)",) \
		$(if $(wait_ms),--wait-ms "$(wait_ms)",) \
		$(if $(wait_until),--wait-until "$(wait_until)",) \
		$(if $(wait_selector),--wait-selector "$(wait_selector)",)
	$(TARGET_OK)

.PHONY: research-a11y-snapshot
research-a11y-snapshot: ## [Research][docker][playwright][a11y] Saves Playwright accessibility snapshot for a page or selector
	$(TARGET_HEADER)
	@$(PLAYWRIGHT_NODE_CMD) scripts/playwright-research.mjs \
		--action a11y-snapshot \
		--url "$(url)" \
		$(if $(selector),--selector "$(selector)",) \
		$(if $(out),--out "$(out)",) \
		$(if $(out_dir),--out-dir "$(out_dir)",) \
		$(if $(width),--width "$(width)",) \
		$(if $(height),--height "$(height)",) \
		$(if $(wait_ms),--wait-ms "$(wait_ms)",) \
		$(if $(wait_until),--wait-until "$(wait_until)",) \
		$(if $(wait_selector),--wait-selector "$(wait_selector)",)
	$(TARGET_OK)

.PHONY: research-console-capture
research-console-capture: ## [Research][docker][playwright][inspect] Saves console messages, page errors, and failed requests
	$(TARGET_HEADER)
	@$(PLAYWRIGHT_NODE_CMD) scripts/playwright-research.mjs \
		--action console-capture \
		--url "$(url)" \
		$(if $(out),--out "$(out)",) \
		$(if $(out_dir),--out-dir "$(out_dir)",) \
		$(if $(width),--width "$(width)",) \
		$(if $(height),--height "$(height)",) \
		$(if $(wait_ms),--wait-ms "$(wait_ms)",) \
		$(if $(wait_until),--wait-until "$(wait_until)",) \
		$(if $(wait_selector),--wait-selector "$(wait_selector)",)
	$(TARGET_OK)

.PHONY: research-trace
research-trace: ## [Research][docker][playwright][trace] Saves Playwright trace for a page and optional interaction
	$(TARGET_HEADER)
	@$(PLAYWRIGHT_NODE_CMD) scripts/playwright-research.mjs \
		--action trace \
		--url "$(url)" \
		$(if $(action_selector),--action-selector "$(action_selector)",) \
		$(if $(interaction),--interaction "$(interaction)",) \
		$(if $(post_action_wait_ms),--post-action-wait-ms "$(post_action_wait_ms)",) \
		$(if $(out),--out "$(out)",) \
		$(if $(out_dir),--out-dir "$(out_dir)",) \
		$(if $(width),--width "$(width)",) \
		$(if $(height),--height "$(height)",) \
		$(if $(wait_ms),--wait-ms "$(wait_ms)",) \
		$(if $(wait_until),--wait-until "$(wait_until)",) \
		$(if $(wait_selector),--wait-selector "$(wait_selector)",)
	$(TARGET_OK)

.PHONY: research-network-log
research-network-log: ## [Research][docker][playwright][inspect] Saves request/response timeline for a page load
	$(TARGET_HEADER)
	@$(PLAYWRIGHT_NODE_CMD) scripts/playwright-research.mjs \
		--action network-log \
		--url "$(url)" \
		$(if $(out),--out "$(out)",) \
		$(if $(out_dir),--out-dir "$(out_dir)",) \
		$(if $(width),--width "$(width)",) \
		$(if $(height),--height "$(height)",) \
		$(if $(wait_ms),--wait-ms "$(wait_ms)",) \
		$(if $(wait_until),--wait-until "$(wait_until)",) \
		$(if $(wait_selector),--wait-selector "$(wait_selector)",)
	$(TARGET_OK)

.PHONY: research-perf-marks
research-perf-marks: ## [Research][docker][playwright][inspect] Saves Performance API entries for a page
	$(TARGET_HEADER)
	@$(PLAYWRIGHT_NODE_CMD) scripts/playwright-research.mjs \
		--action perf-marks \
		--url "$(url)" \
		$(if $(out),--out "$(out)",) \
		$(if $(out_dir),--out-dir "$(out_dir)",) \
		$(if $(width),--width "$(width)",) \
		$(if $(height),--height "$(height)",) \
		$(if $(wait_ms),--wait-ms "$(wait_ms)",) \
		$(if $(wait_until),--wait-until "$(wait_until)",) \
		$(if $(wait_selector),--wait-selector "$(wait_selector)",)
	$(TARGET_OK)

.PHONY: research-token-diff
research-token-diff: ## [Research][docker][playwright][inspect] Compares computed CSS custom properties between two selectors
	$(TARGET_HEADER)
	@$(PLAYWRIGHT_NODE_CMD) scripts/playwright-research.mjs \
		--action token-diff \
		--url "$(url)" \
		$(if $(selector),--selector "$(selector)",) \
		$(if $(compare_selector),--compare-selector "$(compare_selector)",) \
		$(if $(var_prefixes),--var-prefixes "$(var_prefixes)",) \
		$(if $(out),--out "$(out)",) \
		$(if $(out_dir),--out-dir "$(out_dir)",) \
		$(if $(width),--width "$(width)",) \
		$(if $(height),--height "$(height)",) \
		$(if $(wait_ms),--wait-ms "$(wait_ms)",) \
		$(if $(wait_until),--wait-until "$(wait_until)",) \
		$(if $(wait_selector),--wait-selector "$(wait_selector)",)
	$(TARGET_OK)

.PHONY: research-motion-sample
research-motion-sample: ## [Research][docker][playwright][capture] Captures a timed frame sequence for page motion and optional interaction
	$(TARGET_HEADER)
	@$(PLAYWRIGHT_NODE_CMD) scripts/playwright-research.mjs \
		--action motion-sample \
		--url "$(url)" \
		$(if $(action_selector),--action-selector "$(action_selector)",) \
		$(if $(interaction),--interaction "$(interaction)",) \
		$(if $(count),--count "$(count)",) \
		$(if $(interval_ms),--interval-ms "$(interval_ms)",) \
		$(if $(full_page),--full-page "$(full_page)",) \
		$(if $(out_dir),--out-dir "$(out_dir)",) \
		$(if $(width),--width "$(width)",) \
		$(if $(height),--height "$(height)",) \
		$(if $(wait_ms),--wait-ms "$(wait_ms)",) \
		$(if $(wait_until),--wait-until "$(wait_until)",) \
		$(if $(wait_selector),--wait-selector "$(wait_selector)",)
	$(TARGET_OK)

.PHONY: research-capture-diff
research-capture-diff: ## [Research][docker][inspect][capture] Creates image diffs for two screenshots or two screenshot directories
	$(TARGET_HEADER)
	@$(PLAYWRIGHT_NODE_CMD) scripts/playwright-capture-diff.mjs \
		--left "$(left)" \
		--right "$(right)" \
		$(if $(out),--out "$(out)",) \
		$(if $(summary),--summary "$(summary)",) \
		$(if $(out_dir),--out-dir "$(out_dir)",) \
		$(if $(threshold),--threshold "$(threshold)",)
	$(TARGET_OK)

.PHONY: research-capture-matrix
research-capture-matrix: ## [Research][docker][playwright][capture] Captures URL or Storybook matrices across themes, globals, args, and viewports
	$(TARGET_HEADER)
	@$(PLAYWRIGHT_NODE_CMD) scripts/playwright-capture-matrix.mjs \
		$(if $(url),--url "$(url)",) \
		$(if $(base_url),--base-url "$(base_url)",) \
		$(if $(story_id),--story-id "$(story_id)",) \
		$(if $(globals),--globals "$(globals)",) \
		$(if $(globals_sets),--globals-sets "$(globals_sets)",) \
		$(if $(args),--args "$(args)",) \
		$(if $(args_sets),--args-sets "$(args_sets)",) \
		$(if $(themes),--themes "$(themes)",) \
		$(if $(viewports),--viewports "$(viewports)",) \
		$(if $(out_dir),--out-dir "$(out_dir)",) \
		$(if $(wait_ms),--wait-ms "$(wait_ms)",) \
		$(if $(wait_until),--wait-until "$(wait_until)",) \
		$(if $(wait_selector),--wait-selector "$(wait_selector)",) \
		$(if $(full_page),--full-page "$(full_page)",)
	$(TARGET_OK)

.PHONY: research-story-props
research-story-props: ## [Research][docker][playwright][capture] Captures Storybook story matrices for args/globals/theme combinations
	$(TARGET_HEADER)
	@$(PLAYWRIGHT_NODE_CMD) scripts/playwright-capture-matrix.mjs \
		$(if $(base_url),--base-url "$(base_url)",) \
		--story-id "$(story_id)" \
		$(if $(globals),--globals "$(globals)",) \
		$(if $(globals_sets),--globals-sets "$(globals_sets)",) \
		$(if $(args),--args "$(args)",) \
		$(if $(args_sets),--args-sets "$(args_sets)",) \
		$(if $(themes),--themes "$(themes)",) \
		$(if $(viewports),--viewports "$(viewports)",) \
		$(if $(out_dir),--out-dir "$(out_dir)",) \
		$(if $(wait_ms),--wait-ms "$(wait_ms)",) \
		$(if $(wait_until),--wait-until "$(wait_until)",) \
		$(if $(wait_selector),--wait-selector "$(wait_selector)",) \
		$(if $(full_page),--full-page "$(full_page)",)
	$(TARGET_OK)
