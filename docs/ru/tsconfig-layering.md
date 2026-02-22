# Слои TSConfig

В этом репозитории TypeScript-конфиги разделены для editor DX и package-level typecheck в CI.

## Слои

1. `tsconfig.json` (корень)
- Общая базовая конфигурация для всех workspaces.

2. `m3-react/tsconfig.json` и `m3-vue/tsconfig.json`
- Конфиги для редактора и локальной разработки.
- Включают `src`, `storybook` и `tests`.
- Сохраняют test globals (`vitest/globals`) для автодополнения в тестовых файлах.

3. `m3-react/tsconfig.tsc.json` и `m3-vue/tsconfig.tsc.json`
- Конфиги для CI/package typecheck.
- Включают только публикуемые исходники (`src`, `types`, shims).
- Исключают `storybook` и `tests`.
- Сбрасывают `types` в `[]`, чтобы test-only globals не попадали в package-проверки.

## Какие Команды Используют Какие Конфиги

- `yarn workspace @modulify/m3-react tsc` -> `m3-react/tsconfig.tsc.json`
- `yarn workspace @modulify/m3-vue tsc` -> `m3-vue/tsconfig.tsc.json`
- `yarn tsc` (root) -> запускает workspace-скрипты `tsc` выше.

## Правила Практики

- Если цель — корректность пакета в CI/release, меняется `tsconfig.tsc.json`.
- Если цель — удобство IDE/тестов/Storybook, меняется workspace `tsconfig.json`.
- Корневой `tsconfig.json` остаётся только общей базой.
