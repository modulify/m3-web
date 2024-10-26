TARGET_HEADER=@echo -e '===== \e[34m' $@ '\e[0m'
YARN=@docker-compose run --rm node yarn

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

.PHONY: husky
husky: node_modules ## Adds husky git hooks with commit content checks
	@docker-compose run --rm node npx husky init

.PHONY: eslint
eslint: node_modules ## Runs eslint
	$(TARGET_HEADER)
	$(YARN) eslint

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