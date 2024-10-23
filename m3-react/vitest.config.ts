import {
    defineConfig,
    mergeConfig,
} from 'vitest/config'

import viteConfig from './vite.config'

export default mergeConfig(viteConfig, defineConfig({
    test: {
        name: 'm3-react',
        globals: true,
        environment: 'jsdom',
    },
}))
