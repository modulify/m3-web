# Changelog

## 0.2.0

### ⚠ BREAKING CHANGE* **m3-vue:** Components were moved into shared UI layers
* **m3-vue:** M3Surface.zIndex was removed; modal stacking now follows layer activation order.
* **m3-react:** Components were moved into shared UI layers
* **m3-react:** M3Surface.zIndex was removed; modal stacking now follows layer activation order.
* **m3-foundation:** Shared UI layer management was added
* **m3-foundation:** The layers.scss level names were replaced with floating, feedback, popover, and modal; --m3-search-z-index no longer controls the search overlay.
* **m3-vue:** Navigation appearance controls were expanded
* **m3-vue:** M3Navigation replaced barLayout, railExpandedMode, and hideWhenCollapsed with bar-vertical appearance, expansion, and collapse. Automatic forms are limited through appearances.
* **m3-react:** Navigation appearance controls were expanded
* **m3-react:** M3Navigation replaced barLayout, railExpandedMode, and hideWhenCollapsed with bar-vertical appearance, expansion, and collapse. Automatic forms are limited through appearances.
* **m3-foundation:** Adaptive navigation appearances were added
* **m3-foundation:** BarLayout was removed from navigation types. The bar-vertical appearance and RailCollapse type now describe these options.
* **m3-foundation:** Navigation layout offsets were centralized
* **m3-foundation:** Replace m3-has-navigation_bar, m3-has-navigation_rail, m3-has-navigation_rail-expanded, and m3-has-navigation_drawer with m3-has-navigation.
* **m3-vue:** Adaptive navigation and examples were completed
* **m3-vue:** M3Navigation auto mode now selects bar, rail, or rail-expanded; expanded no longer opens a drawer. Set appearance="drawer" for drawer navigation and update tab DOM selectors.
* **m3-react:** Adaptive navigation and examples were completed
* **m3-react:** M3Navigation auto mode now selects bar, rail, or rail-expanded; expanded no longer opens a drawer. Set appearance="drawer" for drawer navigation and update tab DOM selectors.
* **m3-foundation:** Adaptive navigation styles and modal focus were completed
* **m3-foundation:** Automatic navigation now uses a bottom bar, a 96px rail, and an expanded rail across width classes. Update custom rail widths and m3-has-navigation page insets.


### Features

* **m3-foundation:** Adaptive navigation styles and modal focus were completed ([f6fdd07](https://github.com/modulify/m3-web/commit/f6fdd07c077efde8b4dede0bc37731d5cb87cc8b))
* **m3-react:** Adaptive navigation and examples were completed ([2ed6fe5](https://github.com/modulify/m3-web/commit/2ed6fe57db28044b5df0ebf19f239e95a659f875))
* **m3-vue:** Adaptive navigation and examples were completed ([be08e87](https://github.com/modulify/m3-web/commit/be08e87022463691e55fd5c81db2508e5462944c))
* **m3-foundation:** Snackbar styles and shared types were added ([fa80e53](https://github.com/modulify/m3-web/commit/fa80e53342fb9cd91651aba4fa4f8d519155cf8b))
* **m3-react:** Snackbar components and examples were added ([05ba0ae](https://github.com/modulify/m3-web/commit/05ba0aee4c813fe10662707714967792458fa298))
* **m3-vue:** Snackbar components and examples were added ([3f58d9e](https://github.com/modulify/m3-web/commit/3f58d9e4bcbe5a7d4c2bcf90494a17294936273c))
* **m3-foundation:** Adaptive navigation appearances were added ([a29fc8d](https://github.com/modulify/m3-web/commit/a29fc8dc8b63f805f3638ada419f3979be2523e1))
* **m3-react:** Adaptive content was added ([094e32f](https://github.com/modulify/m3-web/commit/094e32faeb4776a424e78da3b9bd341f60aeb594))
* **m3-vue:** Adaptive content was added ([08fda59](https://github.com/modulify/m3-web/commit/08fda59696b3b8f608d9feb8c0222aa685f97fb6))
* **m3-react:** Navigation appearance controls were expanded ([5e4a2bc](https://github.com/modulify/m3-web/commit/5e4a2bc8ef42ea230fcf0e969720df492edde39b))
* **m3-vue:** Navigation appearance controls were expanded ([5733384](https://github.com/modulify/m3-web/commit/5733384608dc476b4acc9a64f907920f595c2efd))
* **m3-foundation:** Search styles and layout primitives were added ([d349bde](https://github.com/modulify/m3-web/commit/d349bde554e3b1ae75f1d0c7e8b33eed7f9f87a7))
* **m3-react:** Search component and examples were added ([38354d2](https://github.com/modulify/m3-web/commit/38354d2e0e9e9e782b86734a1bda3b7c957c9b45))
* **m3-vue:** Search component and examples were added ([86fef16](https://github.com/modulify/m3-web/commit/86fef1638e6fda80755d64e4a9f3fae2efaddb43)), closes [#21]({{host}}/{{owner}}/{{repository}}/issues/{{id}})
* **m3-foundation:** App bar styles and scroll primitives were added ([1d2371c](https://github.com/modulify/m3-web/commit/1d2371cc4e77c1c12a34cabbe5def9c3c0b951b2))
* **m3-react:** App bar component and examples were added ([49653d7](https://github.com/modulify/m3-web/commit/49653d7659f6f4016540316089f3b462c6a05b82))
* **m3-vue:** App bar component and examples were added ([54c9491](https://github.com/modulify/m3-web/commit/54c94917fbc297b4b2d315e8266000205a0d1611)), closes [#26]({{host}}/{{owner}}/{{repository}}/issues/{{id}})
* **m3-foundation:** Toolbar styles and layout helpers were added ([e4dadc1](https://github.com/modulify/m3-web/commit/e4dadc177cbf46b6946cdd311448a87332a57f8a))
* **m3-react:** Toolbar component and examples were added ([3dd791a](https://github.com/modulify/m3-web/commit/3dd791a643b4249eeca88506987d3ade8a2131c4))
* **m3-vue:** Toolbar component and examples were added ([e24d734](https://github.com/modulify/m3-web/commit/e24d7341b743f6496f4a0e6b00ded365e8535c7e))
* **m3-foundation:** Shared UI layer management was added ([b17400d](https://github.com/modulify/m3-web/commit/b17400de067ffc5bceb298e03564b5ffeba1ddcb))
* **m3-react:** Components were moved into shared UI layers ([3cec611](https://github.com/modulify/m3-web/commit/3cec611f4969b2575b50a6c19173bc09b92d4099))
* **m3-vue:** Components were moved into shared UI layers ([5d55d94](https://github.com/modulify/m3-web/commit/5d55d94cac6e756f1303024d329902920c2ed42e))

### Bug Fixes

* **m3-vue:** Localized Radio docs rendering was fixed ([62e61d4](https://github.com/modulify/m3-web/commit/62e61d451754c24c4f60b07cc06707a4d37b36d5))
* **m3-foundation:** Component motion and reduced motion behavior were corrected ([ac71f29](https://github.com/modulify/m3-web/commit/ac71f2945fe3ed9fa252b4a733bd79a093f73999))
* **m3-react:** Surface morph transitions were smoothed ([1884fff](https://github.com/modulify/m3-web/commit/1884fff9bb4cad46c3f6eb96d888de1918816fa8))
* **m3-vue:** Surface morph transitions were smoothed ([efef28e](https://github.com/modulify/m3-web/commit/efef28e6f004f62aa258045eebaa91dbfbba196a))
* **m3-foundation:** Navigation motion and bar labels were corrected ([cdfbfe3](https://github.com/modulify/m3-web/commit/cdfbfe3c6c9f9bbea4c94ba578ef9fe6b2e2a4c6))
* **m3-vue:** Navigation viewport test was stabilized ([0b76863](https://github.com/modulify/m3-web/commit/0b768635bbad5eb1a027d5265136b7439841693a))
* **m3-foundation:** Search helper export was restored ([75743d2](https://github.com/modulify/m3-web/commit/75743d2f8b725e9c83fe505bb2aaff1842d8e800))

## 0.1.2

### Features

* Framework Storybook favicons were added ([fa0c04b](https://github.com/modulify/m3-web/commit/fa0c04bf7f29ffa967d77b7a5a2699156b95139e))

### Bug Fixes

* **m3-vue:** Radio docs rendering was fixed ([f6ef7c1](https://github.com/modulify/m3-web/commit/f6ef7c109126a1bf7ae29e907cd174ed2db91fba))

## 0.1.1

### Features

* Workspace logos were added ([c40738d](https://github.com/modulify/m3-web/commit/c40738dd1e4a74fa9857642bdf566785715623df))
* Storybook localization was added ([7ea6eb3](https://github.com/modulify/m3-web/commit/7ea6eb3c3844ac7985886351a6a21f20b3099a82))

### Bug Fixes

* **m3-vue:** Stray chip label was removed ([8ed1684](https://github.com/modulify/m3-web/commit/8ed16840ff854b4a37936cf0b7ab1144ecbabfbb))
* Storybook version labels were corrected ([98f9d2c](https://github.com/modulify/m3-web/commit/98f9d2c1b37a9fc30feb89386f17e1f19670675e))
* Storybook inline code styles were corrected ([3b6fe67](https://github.com/modulify/m3-web/commit/3b6fe674832a17f52aa96ac5967b2d5ba3df30ff))
* Accessibility contracts were corrected ([1faed98](https://github.com/modulify/m3-web/commit/1faed983db974ff74414eeb46eea6c174350916a))
* **m3-react:** Navigation transition was made React 19 compatible ([e6ae150](https://github.com/modulify/m3-web/commit/e6ae1503b756666323cde609dcebb3f527a11c5f))
* Storybook HMR writes were stabilized ([17af2e9](https://github.com/modulify/m3-web/commit/17af2e922e660457ee5e560673eac7a0176a537c))
* **m3-foundation:** Scroll rail state was synchronized ([b8c4d18](https://github.com/modulify/m3-web/commit/b8c4d18ba44f00dd29efae368e39a52c2aea74ae))

## 0.1.0

### ⚠ BREAKING CHANGE* Removed obsolete CSS color variables
* Removed tertiary rgba color variables


### Features

* Added M3FabButton to react version, improved M3Button & M3Icon ([d0250b2](https://github.com/modulify/m3-web/commit/d0250b2312c81074272b9fdf8cb82cecf362d631))
* Added M3IconButton to m3-react ([8af44da](https://github.com/modulify/m3-web/commit/8af44da71042c80b5cab4457af118263214350a4))
* Added react version of M3Checkbox ([e398ef1](https://github.com/modulify/m3-web/commit/e398ef11eec1316a19b96c9dfb877afcce632dd3))
* Added react version of M3Navigation component ([7be50ac](https://github.com/modulify/m3-web/commit/7be50ac70cfc6895848de745662e907cde1165a7))
* Added react version of M3Card ([b8f5b06](https://github.com/modulify/m3-web/commit/b8f5b066cecb9cd922b41dc599c68c71489f5728))
* Click methods for react version of button components, removed import of whole React namespace ([692317b](https://github.com/modulify/m3-web/commit/692317b3356c7793e1cab2268f1689ede3efff14))
* Reworked M3Switch, input element is now used for interaction directly ([4049d16](https://github.com/modulify/m3-web/commit/4049d16a26691cd35095e54ed3695ad279ade16d))
* Added react version of M3Switch ([b228696](https://github.com/modulify/m3-web/commit/b2286967f74f02aaa272ffc03c8034d17a4d2a4b))
* React version of M3Popper ([137dacf](https://github.com/modulify/m3-web/commit/137dacf726a99c15ac475bae664d89122dc7bf77))
* **m3-foundation:** rich-tooltip subheading renamed into heading ([e14d4df](https://github.com/modulify/m3-web/commit/e14d4df42817e2aea399d9674d6596a7288f7b10))
* **m3-vue:** M3RichTooltip target property synchronized with M3Popper, added MDX story ([f951784](https://github.com/modulify/m3-web/commit/f951784a828612fb2c65ffbf474551497ea83e35))
* **m3-react:** M3RichTooltip component ([4455076](https://github.com/modulify/m3-web/commit/445507695ea52821d55f87dc31409ca5143f8d33))
* **m3-foundation:** Added common M3Popper closer logic, predicates improvements ([bad3015](https://github.com/modulify/m3-web/commit/bad3015e9872b707ef0c210d29723a9e0d8a3e24))
* **m3-react:** M3Button effects property for element effects ([7c18fe4](https://github.com/modulify/m3-web/commit/7c18fe4ed58e3bcac1e1b58b4fcf3267b7222993))
* **m3-react:** M3Popper closer element effect ([a316486](https://github.com/modulify/m3-web/commit/a316486b513a8c750301d44d500e2f70c095462e))
* **m3-react:** M3Popper target hook, createM3PopperCloserEffect renamed into useM3PopperCloserEffect ([55fdb81](https://github.com/modulify/m3-web/commit/55fdb8154ef5040df73ef110d4035a12f94c0d54))
* React version of M3ScrollRail, m3-scroll-box styles for custom scrollable container ([17237ca](https://github.com/modulify/m3-web/commit/17237caed17f9a91d2368654ee539dea502a357f))
* M3Dialog component ([106e105](https://github.com/modulify/m3-web/commit/106e1056c627197ab04d187ff9b38dc1eb1027eb))
* **m3-vue:** M3Slider component ([bdabe8a](https://github.com/modulify/m3-web/commit/bdabe8a121d910b8a7197cbbd7717ef1c14f7339))
* Removed tertiary rgba color variables ([f418d24](https://github.com/modulify/m3-web/commit/f418d24aa955d50d9e97671fbb47354cb2a70313))
* Removed obsolete CSS color variables ([aa517de](https://github.com/modulify/m3-web/commit/aa517dedd22a469b790cbe2aeea015d214c862fe))
* Removed obsolete CSS variables, added variable for surface-variant color, M3Switch styles refactored in order to get rid of *-opacity-0xx CSS variables ([2d5afef](https://github.com/modulify/m3-web/commit/2d5afefa67158548620872741877b7df51eba6ca))
* text field styles adjusted for rtl languages ([d04da59](https://github.com/modulify/m3-web/commit/d04da598f43cb3cf6ec7f730362acb34821c9a3e))
* **m3-react:** Changed export configuration ([fac6516](https://github.com/modulify/m3-web/commit/fac6516e6ff126d32343e6667a4a27f73d70780f))
* **m3-vue:** Changed export configuration ([803cffc](https://github.com/modulify/m3-web/commit/803cffcd85fe9d4b4ef440c6be35424523b40437))
* **m3-foundation:** Package type change to module ([a1a8091](https://github.com/modulify/m3-web/commit/a1a809142ca2b583d5f25fb4e08082db1f71ecbb))
* Renamed 'getElement' method of M3Link to 'el', added interface Interactable that combines Clickable & Focusable ([1552994](https://github.com/modulify/m3-web/commit/15529941c34dd53d023248ba0a18260963eee8b2))
* **m3-react:** Added parity components and Storybook docs ([3047aa2](https://github.com/modulify/m3-web/commit/3047aa23c43b10697cb25d88693099c156bd8be0))
* Refined Popper animation flow and side-based unfolding ([0110257](https://github.com/modulify/m3-web/commit/0110257b66f49627d09b220348c32040e86badff))
* **m3-react:** Added Select and Slider parity with Storybook updates ([35d0306](https://github.com/modulify/m3-web/commit/35d0306322004a0943c17fed24755bc1319d6704))
* **m3-vue:** Added Experimental Surface stories and orchestration tests ([8ef9414](https://github.com/modulify/m3-web/commit/8ef94149101f35f492cac9c2ed0c96f591a23d85))
* **m3-foundation:** Added Surface Stylesheet Module ([47b622b](https://github.com/modulify/m3-web/commit/47b622b58b5886b51c77e40fe2383214eba7d1b3))
* **m3-foundation:** Added Motion Values And Surface Types ([d74729b](https://github.com/modulify/m3-web/commit/d74729bead42cd76c8df7facef680ee1b5ece97d))
* **m3-react:** Added M3Surface Component And Surface Storybook Scenarios ([d710620](https://github.com/modulify/m3-web/commit/d7106203573e1bc0bfb144347edeab969f145b3a))
* **m3-vue:** Stabilized M3Surface And Updated Surface Stories ([f355897](https://github.com/modulify/m3-web/commit/f355897ccc62c4703fde0d8c9a66e3d43ec6f4a2))
* **m3-foundation:** Added shared surface orchestration primitives ([70eba66](https://github.com/modulify/m3-web/commit/70eba66610172d52b88404a20ecfadd634962b51))
* **m3-react:** Refactored surface-based dialogs and side sheets ([25fb517](https://github.com/modulify/m3-web/commit/25fb517e9a2f4a3ddb1392635607863a08fb52db))
* **m3-vue:** Refactored surface-based dialogs and side sheets ([81680ec](https://github.com/modulify/m3-web/commit/81680ecfb6727ea46d6d9d71706347d3cbe2d9d6))
* Storybook examples were expanded for Material 3 ([99d5463](https://github.com/modulify/m3-web/commit/99d5463fdc0d1f3e4f4f4999baf0f2ea95a670f5))
* Storybook coverage was expanded for Material 3 patterns ([91ed0f7](https://github.com/modulify/m3-web/commit/91ed0f72e01f556acde27ca0fb51c0316ee2100d))
* Storybook scenarios were added for tooltips and surfaces ([d10931b](https://github.com/modulify/m3-web/commit/d10931b6604ef816a38c90d1afdfc19ea1cfeadb))
* Storybook surface guidance was refined ([e3713e4](https://github.com/modulify/m3-web/commit/e3713e4f95cbf451a9e39f2e10e8474eb42746ec))
* Storybook local theming patterns were added ([6ea8557](https://github.com/modulify/m3-web/commit/6ea85576213d48dd473e0f7733149f2143937b31))
* Runtime analysis recipes were added ([de864c8](https://github.com/modulify/m3-web/commit/de864c85b3c4550b1630cac2a8e9a7e00e3c25c1))
* M3 Radio component was added ([8af9676](https://github.com/modulify/m3-web/commit/8af967651b886fe33663b8982e042cf0715ff95e)), closes [#20]({{host}}/{{owner}}/{{repository}}/issues/{{id}})
* M3 Chip component was added ([8e6f3d6](https://github.com/modulify/m3-web/commit/8e6f3d6ce5a34df20a7df9153009ce945eba7217)), closes [#15]({{host}}/{{owner}}/{{repository}}/issues/{{id}})
* M3 Lists were added ([e7ad3f5](https://github.com/modulify/m3-web/commit/e7ad3f5bf91c28dff44ff32614973b3601506e48)), closes [#18]({{host}}/{{owner}}/{{repository}}/issues/{{id}})
* Date picker was added ([7d3e32c](https://github.com/modulify/m3-web/commit/7d3e32cd8ebbe114cf0dd31cfbdd8118418c2e08)), closes [#16]({{host}}/{{owner}}/{{repository}}/issues/{{id}})
* Observer hooks were added ([b0dcd56](https://github.com/modulify/m3-web/commit/b0dcd56496ffebae2e8895c76eb495912796b7e9))
* Component reference APIs were added ([fc3fd03](https://github.com/modulify/m3-web/commit/fc3fd03df84bcf4e363cefef7a4d257d91dc6302))
* Scheduling utilities were added ([37cb2f5](https://github.com/modulify/m3-web/commit/37cb2f55fb2eb58b7745c51b6d66d3ef14829b0f))

### Bug Fixes

* Type of appearance in M3IconButton of m3-vue ([9ba8f44](https://github.com/modulify/m3-web/commit/9ba8f44c0b5af022903505ffa03c95fde1b20cd2))
* Missing import of M3IconButton in m3-react ([a0cc4e2](https://github.com/modulify/m3-web/commit/a0cc4e24669fb3bf0178b72aef08d95ea1ff49db))
* M3Checkbox default id value ([f4441d2](https://github.com/modulify/m3-web/commit/f4441d2bcd80cf9d9d82153963425401f4a92005))
* Storybook country flag component for m3-vue ([a4d7333](https://github.com/modulify/m3-web/commit/a4d73337211c6da1aefb24642293d1ebd39ce9f2))
* M3Checkbox react version inner state ([d790b8c](https://github.com/modulify/m3-web/commit/d790b8cef07f5a8a6f4fff53ed6f3a32927d5304))
* M3Ripple effect logic ([44ab1da](https://github.com/modulify/m3-web/commit/44ab1da5420805a57b9b88d3830fab3957f1c15e))
* Text color for m3-button ([660964d](https://github.com/modulify/m3-web/commit/660964d06e700a1ad9a09e929d08807c0f4c929b))
* Background of disabled outlined and text variants of m3-button ([96a7e3b](https://github.com/modulify/m3-web/commit/96a7e3babc8610ed4144ecfa2b79a4757d0bf663))
* Additional adjustments of text field for rtl languages ([202933b](https://github.com/modulify/m3-web/commit/202933b99764fbffcc061789a47aa131b881f2ce))
* **m3-vue:** Fixed lifecycle hooks of M3Ripple ([0897445](https://github.com/modulify/m3-web/commit/08974451fa705dbcdaf8dd2780537456cb612f9c))
* **m3-vue:** Package manifest, code style ([38bd743](https://github.com/modulify/m3-web/commit/38bd7432761de369d632cd27c6875773b26fa22d))
* Dependencies hoisting ([6577757](https://github.com/modulify/m3-web/commit/6577757781865fc507844a0381dbe84ffc8cbc38))
* **m3-react:** Using vitest global APIs ([2626847](https://github.com/modulify/m3-web/commit/2626847801ac9a5360f49f955347f1dffcda2836))
* **m3-react:** Prevent click conflict with drag in M3Switch ([674bb98](https://github.com/modulify/m3-web/commit/674bb9834a169175c26bfcb92b1bfe51a97c152b))
* **m3-vue:** Prevent click conflict with drag in M3Switch ([5fcae36](https://github.com/modulify/m3-web/commit/5fcae36aec392d91d860bbf619624171f9a94a5e))
* **storybook:** sync docs theme class with globals events ([ed79b21](https://github.com/modulify/m3-web/commit/ed79b21b66f58c9bd03b3912c981190a3cc72c9e))
* **m3-vue:** Storybook Vue Files Were Included in TSConfig ([f563ab6](https://github.com/modulify/m3-web/commit/f563ab64ee68a3cbfe91d2e528c008868b721e96))
* **m3-vue:** Storybook inline app id prefix was added ([fd0f7c8](https://github.com/modulify/m3-web/commit/fd0f7c878d1a94c19c10b04bae9982f685ec1d9e))
* Storybook mdx code block typecheck compatibility was fixed ([be1f7e2](https://github.com/modulify/m3-web/commit/be1f7e2546d07d791ac2be948b40688f47fa84f2))
* Storybook test domains were allowed ([ed62b2f](https://github.com/modulify/m3-web/commit/ed62b2fd8df54751c6387943fc34a738f05fb41f))
* **m3-react:** CJS build warning was removed ([fd6471e](https://github.com/modulify/m3-web/commit/fd6471e8bcb6a5668b209eb8a600b0cad78d203c))
* Popper hidden state hit testing was fixed ([a2dff1b](https://github.com/modulify/m3-web/commit/a2dff1b21850118c64a13e5f6254277e9d1fbeb3))
* Storybook type contracts were corrected ([d768d60](https://github.com/modulify/m3-web/commit/d768d602fb50b21e3992e50f30842cf96df9e656))

