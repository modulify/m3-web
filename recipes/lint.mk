include recipes/common.mk

.PHONY: eslint
eslint: node_modules ## [Quality][docker][lint] Runs eslint
	$(TARGET_HEADER)
	$(YARN) eslint

.PHONY: tsc
tsc: node_modules ## [Quality][docker][types] Runs type checks in all workspaces
	$(TARGET_HEADER)
	$(YARN) tsc

.PHONY: tsc-foundation
tsc-foundation: node_modules ## [Quality][docker][types] Runs type checks in @modulify/m3-foundation
	$(TARGET_HEADER)
	$(YARN) workspace @modulify/m3-foundation tsc

.PHONY: tsc-react
tsc-react: node_modules ## [Quality][docker][types] Runs type checks in @modulify/m3-react
	$(TARGET_HEADER)
	$(YARN) workspace @modulify/m3-react tsc

.PHONY: tsc-vue
tsc-vue: node_modules ## [Quality][docker][types] Runs type checks in @modulify/m3-vue
	$(TARGET_HEADER)
	$(YARN) workspace @modulify/m3-vue tsc

.PHONY: tsc-tests
tsc-tests: node_modules ## [Quality][docker][types] Runs type checks for tests in all UI workspaces
	$(TARGET_HEADER)
	$(YARN) tsc:tests

.PHONY: tsc-tests-react
tsc-tests-react: node_modules ## [Quality][docker][types] Runs type checks for tests in @modulify/m3-react
	$(TARGET_HEADER)
	$(YARN) workspace @modulify/m3-react tsc:tests

.PHONY: tsc-tests-vue
tsc-tests-vue: node_modules ## [Quality][docker][types] Runs type checks for tests in @modulify/m3-vue
	$(TARGET_HEADER)
	$(YARN) workspace @modulify/m3-vue tsc:tests

.PHONY: tsc-e2e
tsc-e2e: node_modules ## [Quality][docker][types] Runs type checks for Playwright Vitest configs
	$(TARGET_HEADER)
	$(YARN) exec tsc -p tsconfig.e2e.json --skipLibCheck
