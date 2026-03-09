# Рецепты runtime-анализа

Этот документ описывает Playwright-рецепты исследования, доступные в
`m3-web`, чтобы снимать неопределённость, когда визуальное или runtime-поведение
непонятно.

## Когда применять

Используйте эти рецепты, когда:
- Storybook-страница выглядит неправильно, и одного скриншота недостаточно;
- layout сдвигается, наползает или анимируется неожиданно;
- локальная тема или CSS-токены как будто игнорируются;
- неясно, есть ли parity между React и Vue;
- нужно сравнить состояния до/после или матрицу сценариев;
- runtime-ошибки могут прятаться в console, network или accessibility-состоянии.

## Базовый принцип

Предпочитайте эти рецепты угадыванию. Их задача — превращать расплывчатое
«что-то не так» в конкретные артефакты: скриншоты, computed styles, layout
метрики, accessibility tree, traces и diffs.

## Самые полезные рецепты

- `make research-capture url='...'` - Один скриншот с метаданными.
- `make research-capture-batch in=urls.txt out_dir=drafts/screenshots/...` -
  Пакетное снятие скриншотов по списку URL.
- `make research-style-dump url='...' selector='...'` - Computed styles и CSS
  custom properties для одного элемента.
- `make research-layout-metrics url='...' selectors='.a||.b||.c'` - Bounding
  boxes, scroll-метрики, offsets и layout-детали для нескольких элементов.
- `make research-token-diff url='...' selector='.left' compare_selector='.right'`
  - Diff CSS-переменных между двумя scope.
- `make research-console-capture url='...'` - Console messages, page errors и
  failed requests.
- `make research-a11y-snapshot url='...' selector='...'` - Accessibility tree
  для страницы или subtree.
- `make research-trace url='...' action_selector='...' interaction=click` -
  Playwright trace для страницы и опционального взаимодействия.
- `make research-motion-sample url='...' action_selector='...' interaction=click`
  - Последовательность кадров для motion и transitions.
- `make research-capture-diff left=before.png right=after.png out=diff.png` -
  Pixel diff для двух изображений или каталогов.
- `make research-capture-matrix ...` - Съёмка одного URL по нескольким themes,
  globals, args и viewports.
- `make research-story-props story_id='...' themes='light,dark' args_sets='...'`
  - Storybook-oriented matrix capture для story args и globals.

## Типовые сценарии

## Разобрать сломанный layout

1. Снять текущую страницу:
   `make research-capture url='...'`
2. Снять layout metrics:
   `make research-layout-metrics url='...' selectors='.host||.panel||.scrim'`
3. Снять computed styles для подозрительного узла:
   `make research-style-dump url='...' selector='.panel'`

## Разобрать проблему темы или токенов

1. Снять страницу в обеих темах:
   `make research-capture-matrix story_id='...' themes='light,dark'`
2. Сравнить token scope:
   `make research-token-diff url='...' selector='.default-scope' compare_selector='.local-scope'`
3. Посмотреть computed variables:
   `make research-style-dump url='...' selector='.local-scope' var_prefixes='--m3-sys-,--m3-state-layers-'`

## Разобрать анимацию или motion

1. Снять последовательность кадров:
   `make research-motion-sample url='...' action_selector='...' interaction=click`
2. Если поведение всё ещё неясно, снять trace:
   `make research-trace url='...' action_selector='...' interaction=click`

## Сравнить два runtime-состояния

1. Снять оба состояния в разные каталоги.
2. Запустить:
   `make research-capture-diff left=dir-a right=dir-b out_dir=drafts/research/diff`

## Примечания по Storybook

- Storybook-страницы можно открывать напрямую так:
  `http://m3-vue.modulify.test/?path=/story/...&globals=theme:dark`
- Для систематической съёмки по состояниям лучше использовать
  `research-story-props` и `research-capture-matrix`, а не собирать множество
  URL вручную.

## Формат артефактов

- Скриншоты по умолчанию пишутся в `drafts/screenshots/...`.
- Runtime inspection outputs по умолчанию пишутся в `drafts/research/...`.
- Большинство рецептов сохраняет machine-readable JSON, чтобы результаты можно
  было потом изучать и сравнивать.

## Рекомендация

Когда баг-репорт расплывчатый, начинайте с:
1. `research-capture`
2. `research-style-dump`
3. `research-layout-metrics`

Эта комбинация обычно быстро показывает, проблема в геометрии, styling,
наследовании токенов или runtime-состоянии.
