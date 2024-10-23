import {
    configDefaults,
    defineConfig,
} from 'vitest/config'

export default defineConfig({
    test: {
        coverage: {
            reporter: 'html',
            provider: 'istanbul',
            exclude: [
                '**/storybook/**',
                ...configDefaults.coverage.exclude,
            ],
        },
    },
})
