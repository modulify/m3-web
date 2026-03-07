include recipes/common.mk

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
