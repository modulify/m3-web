include recipes/common.mk

.PHONY: storybook-build
storybook-build: node_modules ## [Build][docker][storybook] Builds complete Storybooks for all UI workspaces
	$(TARGET_HEADER)
	$(YARN) workspace @modulify/m3-react storybook:build --quiet
	$(YARN) workspace @modulify/m3-vue storybook:build --quiet

.PHONY: storybook-build-react
storybook-build-react: node_modules ## [Build][docker][storybook] Builds the complete @modulify/m3-react Storybook
	$(TARGET_HEADER)
	$(YARN) workspace @modulify/m3-react storybook:build --quiet

.PHONY: storybook-build-vue
storybook-build-vue: node_modules ## [Build][docker][storybook] Builds the complete @modulify/m3-vue Storybook
	$(TARGET_HEADER)
	$(YARN) workspace @modulify/m3-vue storybook:build --quiet

.PHONY: storybook-docs-test
storybook-docs-test: storybook-build ## [Tests][docker][storybook][playwright] Opens every built Storybook docs entry and checks for runtime errors
	$(TARGET_HEADER)
	@$(PLAYWRIGHT_NODE_CMD) scripts/check-storybook-docs.mjs

.PHONY: storybook-build-test
storybook-build-test: node_modules ## [Build][docker][storybook] Builds Storybook in --test mode for all UI workspaces
	$(TARGET_HEADER)
	$(YARN) workspace @modulify/m3-react storybook:build --test --quiet
	$(YARN) workspace @modulify/m3-vue storybook:build --test --quiet

.PHONY: storybook-build-test-react
storybook-build-test-react: node_modules ## [Build][docker][storybook] Builds Storybook in --test mode for @modulify/m3-react
	$(TARGET_HEADER)
	$(YARN) workspace @modulify/m3-react storybook:build --test --quiet

.PHONY: storybook-build-test-vue
storybook-build-test-vue: node_modules ## [Build][docker][storybook] Builds Storybook in --test mode for @modulify/m3-vue
	$(TARGET_HEADER)
	$(YARN) workspace @modulify/m3-vue storybook:build --test --quiet
