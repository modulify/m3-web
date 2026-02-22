# Руководство по участию

Этот документ описывает практический путь участия в разработке `m3-web`.

## Цель проекта

`m3-web` развивает компонентную библиотеку Material Design 3 для web в формате monorepo:
- общая база (`m3-foundation`),
- две платформенные реализации (`m3-react` и `m3-vue`),
- акцент на предсказуемое качество и API-паритет.

## Быстрый старт

```bash
make .yarnrc.yml
make node_modules
make test
```

## Основные команды

- `make build`: собрать все workspaces.
- `make eslint`: прогнать линтер.
- `make test`: прогнать unit/integration тесты.
- `make storybook-build-test`: собрать Storybook в `--test` режиме для React и Vue.
- `make storybook-accessibility-smoke`: прогнать Storybook accessibility smoke-тесты.
- `yarn tsc`: прогнать package-level typecheck по workspace-конфигациям.

## Quality Gates (CI)

В CI проверяются:
- `eslint`,
- `tests`,
- `storybook-tests`:
  `storybook:build --test` для React и Vue + accessibility smoke-тесты.

Локально желательно проходить те же проверки до отправки изменений.

## Структура репозитория

- `m3-foundation`: стили, токены, общие вспомогательные части.
- `m3-react`: React-компоненты, их тесты и Storybook.
- `m3-vue`: Vue-компоненты, их тесты и Storybook.

## TSConfig layering

В проекте разделены конфиги для editor DX и package-level typecheck.
Подробности: `./tsconfig-layering.md`.

Коротко:
- workspace `tsconfig.json`: для IDE, тестов и Storybook,
- workspace `tsconfig.tsc.json`: для CI/typecheck и publishable source.
