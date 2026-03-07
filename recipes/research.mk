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
#   make research-capture-batch in=drafts/experiment/urls/surfaces.txt out_dir=drafts/screenshots/custom
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
