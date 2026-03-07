ifndef RECIPES_COMMON_MK_INCLUDED
RECIPES_COMMON_MK_INCLUDED := 1

.PHONY: .yarnrc.yml
.yarnrc.yml: ## [Setup][local] Creates yarn configuration
	@cp .yarnrc.yml.dist .yarnrc.yml

.PHONY: node_modules
node_modules: package.json yarn.lock ## [Setup][docker][heavy] Installs dependencies
	$(TARGET_HEADER)
	$(YARN) install
	@touch node_modules || true
	@echo ""

.PHONY: husky
husky: node_modules ## [Setup][docker][git] Adds husky git hooks with commit content checks
	@docker-compose run --rm node npx husky init

endif
