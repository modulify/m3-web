.DEFAULT_GOAL := help

TARGET_HEADER=@echo -e '===== \e[34m' $@ '\e[0m'
TARGET_OK=@echo -e '\e[32mOK\e[0m'
DOCKER_COMPOSE ?= docker compose
YARN=@$(DOCKER_COMPOSE) run --rm node yarn
PLAYWRIGHT_NODE_CMD=$(DOCKER_COMPOSE) run --rm playwright node
M3_UA?=m3-web-research/1.0

.PHONY: up
up: ## [Dev][docker] Starts storybook
	$(TARGET_HEADER)
	$(DOCKER_COMPOSE) up -d

.PHONY: restart
restart: ## [Dev][docker] Restarts all docker services or a particular service, if argument "service" is specified (example: make restart service="storybook")
	$(TARGET_HEADER)

ifdef service
	yes | $(DOCKER_COMPOSE) rm -s -v $(service) && $(DOCKER_COMPOSE) up -d $(service)
else
	$(DOCKER_COMPOSE) stop && $(DOCKER_COMPOSE) up -d
endif

.PHONY: stop
stop: ## [Dev][docker] Stops all docker services
	$(TARGET_HEADER)
	$(DOCKER_COMPOSE) stop

include recipes/common.mk

.PHONY: build
build: node_modules ## [Build][docker] Creates a dist catalogue with library build
	$(TARGET_HEADER)
	$(YARN) build

include recipes/lint.mk
include recipes/tests.mk
include recipes/storybook.mk
include recipes/release.mk
include recipes/ci.mk
include recipes/research.mk
include recipes/exploration.mk

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
