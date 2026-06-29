include recipes/common.mk

.PHONY: release-dry
release-dry: node_modules ## [Release][docker] Shows the conventional release plan without writing files
	$(TARGET_HEADER)
	$(YARN) release:dry

.PHONY: release
release: node_modules ## [Release][docker] Creates a conventional release commit and tags
	$(TARGET_HEADER)
	$(YARN) release
