include recipes/common.mk

YARN_PLAYWRIGHT=@$(DOCKER_COMPOSE) run --rm playwright yarn
COVERAGE_PARTS_DIR=coverage/.parts
COVERAGE_UNIT_DIR=coverage/unit
COVERAGE_E2E_REACT_DIR=coverage/e2e-react
COVERAGE_E2E_VUE_DIR=coverage/e2e-vue
NYC_OUTPUT_DIR=.nyc_output

.PHONY: test-smoke
test-smoke: node_modules ## [Tests][docker][smoke] Runs smoke tests for all UI workspaces
	$(TARGET_HEADER)
	$(YARN) test:smoke

.PHONY: test-runtime-parity
test-runtime-parity: ## [Tests][local] Checks Node/Yarn parity across docker services (node, storybook, playwright)
	$(TARGET_HEADER)
	./runtime-parity.test.sh

.PHONY: test
test: node_modules ## [Tests][docker] Runs autotests
	$(TARGET_HEADER)

ifdef cli
	@echo "${YARN} test ${cli}"
	$(YARN) test $(cli)
else
	@echo "${YARN} test"
	$(YARN) test
endif

.PHONY: test-coverage
test-coverage: node_modules ## [Tests][docker][coverage][heavy] Runs merged coverage for unit and Playwright e2e tests
	$(TARGET_HEADER)
	@rm -rf coverage $(NYC_OUTPUT_DIR) artifacts
	@mkdir -p $(COVERAGE_PARTS_DIR) $(NYC_OUTPUT_DIR)
	$(YARN) test --coverage --coverage.provider=istanbul --coverage.reporter=json --coverage.reportsDirectory=$(COVERAGE_UNIT_DIR)
	$(YARN_PLAYWRIGHT) test:e2e:coverage
	@cp $(COVERAGE_UNIT_DIR)/coverage-final.json $(COVERAGE_PARTS_DIR)/unit.json
	@cp $(COVERAGE_E2E_REACT_DIR)/coverage-final.json $(COVERAGE_PARTS_DIR)/e2e-react.json
	@cp $(COVERAGE_E2E_VUE_DIR)/coverage-final.json $(COVERAGE_PARTS_DIR)/e2e-vue.json
	@$(YARN) nyc merge $(COVERAGE_PARTS_DIR) $(NYC_OUTPUT_DIR)/coverage-final.json >/dev/null
	$(YARN) nyc report
	@$(YARN) nyc report --reporter=json-summary >/dev/null
	@$(YARN) node --experimental-strip-types scripts/show-total-coverage.ts

.PHONY: test-e2e
test-e2e: node_modules ## [Tests][docker][e2e][playwright] Runs Playwright-based e2e tests (Vitest browser mode)
	$(TARGET_HEADER)

ifdef cli
	@$(YARN_PLAYWRIGHT) test:e2e $(cli)
else
	@$(YARN_PLAYWRIGHT) test:e2e
endif

.PHONY: test-e2e-react
test-e2e-react: node_modules ## [Tests][docker][e2e][playwright] Runs Playwright-based e2e tests for @modulify/m3-react
	$(TARGET_HEADER)

ifdef cli
	@$(YARN_PLAYWRIGHT) workspace @modulify/m3-react test:e2e $(cli)
else
	@$(YARN_PLAYWRIGHT) workspace @modulify/m3-react test:e2e
endif

.PHONY: test-e2e-vue
test-e2e-vue: node_modules ## [Tests][docker][e2e][playwright] Runs Playwright-based e2e tests for @modulify/m3-vue
	$(TARGET_HEADER)

ifdef cli
	@$(YARN_PLAYWRIGHT) workspace @modulify/m3-vue test:e2e $(cli)
else
	@$(YARN_PLAYWRIGHT) workspace @modulify/m3-vue test:e2e
endif

.PHONY: test-e2e-stop
test-e2e-stop: ## [Tests][local][cleanup] Stops stuck Playwright E2E host processes and run containers
	$(TARGET_HEADER)
	@pkill -TERM -f "$(DOCKER_COMPOSE) run --rm playwright yarn test:[e]2e" || true
	@pkill -TERM -f "$(DOCKER_COMPOSE) run --rm playwright yarn workspace @modulify/m3-react test:[e]2e" || true
	@pkill -TERM -f "$(DOCKER_COMPOSE) run --rm playwright yarn workspace @modulify/m3-vue test:[e]2e" || true
	@docker ps -q --filter "name=m3-web-playwright-run" | xargs -r docker rm -f
