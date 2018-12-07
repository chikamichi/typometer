# Typometer

**A silly micro-app to teach myself some [FRP](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754) using [Cycle.js](https://cycle.js.org/) & the [SAM Pattern](http://sam.js.org/).**

* Demo: https://typometer.netlify.com/ (works in Chrome, not so much in Firefox!)
* Keybindings: just start typing! ESC to retry, Ctrl+Enter or F2 to edit text.

## Installation

> Part of the _original_ experiment was to cover setting up a project with Typescript, ES6 and SystemJS. The latter has then been replaced with good ol' Webpack, greatly simplifying installation.

Simply run `yarn start` (if using npm: `npm install; npm run start`).

### About dependencies

* [babel-register-ts](https://github.com/deepsweet/babel-register-ts) as a workaround to [this issue](https://github.com/babel/babel/pull/6027) while running tests.

## TODO

Check the [issues](https://github.com/chikamichi/typometer/issues). Note that the SAM Pattern is currently halfway implemented (only the next-action predicates, not the action-state logic).