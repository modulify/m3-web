TARGET_HEADER=@echo -e '===== \e[34m' $@ '\e[0m'
YARN=@docker-compose run --rm node yarn
YARN_PLAYWRIGHT=@docker-compose run --rm playwright yarn

.PHONY: up
up: ## Starts storybook
	$(TARGET_HEADER)
	docker-compose up -d

.PHONY: restart
restart: ## Restarts all docker services or a particular service, if argument "service" is specified (example: make restart service="storybook").
	$(TARGET_HEADER)

ifdef service
	yes | docker-compose rm -s -v $(service) && docker-compose up -d $(service)
else
	docker-compose stop && docker-compose up -d
endif

.PHONY: stop
stop: ## Stops all docker services
	$(TARGET_HEADER)
	docker-compose stop

.PHONY: .yarnrc.yml
.yarnrc.yml: ## Creates yarn configuration
	@cp .yarnrc.yml.dist .yarnrc.yml

.PHONY: node_modules
node_modules: package.json yarn.lock ## Installs dependencies
	$(TARGET_HEADER)
	$(YARN) install
	@touch node_modules || true
	@echo ""

.PHONY: build
build: node_modules ## Creates a dist catalogue with library build
	$(TARGET_HEADER)
	$(YARN) build

.PHONY: storybook-build-test
storybook-build-test: node_modules ## Builds Storybook in --test mode for all UI workspaces
	$(TARGET_HEADER)
	$(YARN) workspace @modulify/m3-react storybook:build --test --quiet
	$(YARN) workspace @modulify/m3-vue storybook:build --test --quiet

.PHONY: storybook-build-test-react
storybook-build-test-react: node_modules ## Builds Storybook in --test mode for @modulify/m3-react
	$(TARGET_HEADER)
	$(YARN) workspace @modulify/m3-react storybook:build --test --quiet

.PHONY: storybook-build-test-vue
storybook-build-test-vue: node_modules ## Builds Storybook in --test mode for @modulify/m3-vue
	$(TARGET_HEADER)
	$(YARN) workspace @modulify/m3-vue storybook:build --test --quiet

.PHONY: test-smoke
test-smoke: node_modules ## Runs smoke tests for all UI workspaces
	$(TARGET_HEADER)
	$(YARN) test:smoke

.PHONY: docker-runtime-parity
docker-runtime-parity: ## Checks Node/Yarn parity across docker services (node, storybook, playwright)
	$(TARGET_HEADER)
	@expected_node="$$(docker-compose run --rm node node --version | tail -n 1 | tr -d '\r')"; \
	expected_yarn="$$(docker-compose run --rm node yarn --version | tail -n 1 | tr -d '\r')"; \
	for service in node storybook-react storybook-vue playwright; do \
		node_version="$$(docker-compose run --rm $$service node --version | tail -n 1 | tr -d '\r')"; \
		yarn_version="$$(docker-compose run --rm $$service yarn --version | tail -n 1 | tr -d '\r')"; \
		if [ "$$node_version" != "$$expected_node" ]; then \
			echo "Node mismatch in $$service: $$node_version (expected $$expected_node)"; \
			exit 1; \
		fi; \
		if [ "$$yarn_version" != "$$expected_yarn" ]; then \
			echo "Yarn mismatch in $$service: $$yarn_version (expected $$expected_yarn)"; \
			exit 1; \
		fi; \
		echo "$$service: node=$$node_version yarn=$$yarn_version"; \
	done

.PHONY: husky
husky: node_modules ## Adds husky git hooks with commit content checks
	@docker-compose run --rm node npx husky init

.PHONY: eslint
eslint: node_modules ## Runs eslint
	$(TARGET_HEADER)
	$(YARN) eslint

.PHONY: tsc
tsc: node_modules ## Runs type checks in all workspaces
	$(TARGET_HEADER)
	$(YARN) tsc

.PHONY: tsc-foundation
tsc-foundation: node_modules ## Runs type checks in @modulify/m3-foundation
	$(TARGET_HEADER)
	$(YARN) workspace @modulify/m3-foundation tsc

.PHONY: tsc-react
tsc-react: node_modules ## Runs type checks in @modulify/m3-react
	$(TARGET_HEADER)
	$(YARN) workspace @modulify/m3-react tsc

.PHONY: tsc-vue
tsc-vue: node_modules ## Runs type checks in @modulify/m3-vue
	$(TARGET_HEADER)
	$(YARN) workspace @modulify/m3-vue tsc

.PHONY: tsc-e2e
tsc-e2e: node_modules ## Runs type checks for Playwright Vitest configs
	$(TARGET_HEADER)
	$(YARN) exec tsc -p tsconfig.e2e.json --skipLibCheck

.PHONY: test
test: node_modules ## Runs autotests
	$(TARGET_HEADER)

ifdef cli
	@echo "${YARN} test ${cli}"
	$(YARN) test $(cli)
else
	@echo "${YARN} test"
	$(YARN) test
endif

.PHONY: test-coverage
test-coverage: node_modules ## Runs autotests with --coverage
	$(TARGET_HEADER)

ifdef cli
	$(YARN) test --coverage $(cli)
else
	$(YARN) test --coverage
endif

.PHONY: test-e2e
test-e2e: node_modules ## Runs Playwright-based e2e tests (Vitest browser mode)
	$(TARGET_HEADER)

ifdef cli
	@$(YARN_PLAYWRIGHT) workspace @modulify/m3-react test:e2e $(cli)
	@$(YARN_PLAYWRIGHT) workspace @modulify/m3-vue test:e2e $(cli)
else
	@$(YARN_PLAYWRIGHT) workspace @modulify/m3-react test:e2e
	@$(YARN_PLAYWRIGHT) workspace @modulify/m3-vue test:e2e
endif

.PHONY: test-e2e-react
test-e2e-react: node_modules ## Runs Playwright-based e2e tests for @modulify/m3-react
	$(TARGET_HEADER)

ifdef cli
	@$(YARN_PLAYWRIGHT) workspace @modulify/m3-react test:e2e $(cli)
else
	@$(YARN_PLAYWRIGHT) workspace @modulify/m3-react test:e2e
endif

.PHONY: test-e2e-vue
test-e2e-vue: node_modules ## Runs Playwright-based e2e tests for @modulify/m3-vue
	$(TARGET_HEADER)

ifdef cli
	@$(YARN_PLAYWRIGHT) workspace @modulify/m3-vue test:e2e $(cli)
else
	@$(YARN_PLAYWRIGHT) workspace @modulify/m3-vue test:e2e
endif

.PHONY: test-e2e-stop
test-e2e-stop: ## Stops stuck Playwright E2E host processes and run containers
	$(TARGET_HEADER)
	@pkill -TERM -f "docker-compose run --rm playwright yarn workspace @modulify/m3-react test:e2e" || true
	@pkill -TERM -f "docker-compose run --rm playwright yarn workspace @modulify/m3-vue test:e2e" || true
	@pkill -TERM -f "make test-e2e" || true
	@docker ps -q --filter "name=m3-web-playwright-run" | xargs -r docker rm -f

.PHONY: help
help: ## Calls recipes list
	@cat $(MAKEFILE_LIST) | grep -e "^[-a-zA-Z_\.]*: *.*## *" | awk '\
            BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

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
