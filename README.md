Typometer
=========

**A silly micro-app to teach myself some FRP using Cycle.js.**

First few commits are based upon https://egghead.io/lessons/rxjs-separate-logic-from-effects-in-cycle-js.

## Synopsis

``` sh
# Follow instructions under the "Installation" section, then:
http-server -c-1 -S -C cert.pem -K key.pem -o # Go to https://0.0.0.0:8080/
```

## TODO

### App

#### Internal

* Compute run's metrics using models/records.ts (rename to models/Records.ts), providing state$.currentLast() as the stream to fold over
* Implement a buffer for character detection, to solve combined characters issues: ^e should be detected as ê, same for ï, etc.
* Bug: when the editor is open, clicking anywhere but in the textarea closes and updates the text

#### User experience

* Self-replay: add an option to replicate own typing rythm entirely.
* Expand metrics/records — some requiring updated-while-typing computations:
  * Longest perfect accuracy series
  * Words (actual words) hit/total (ie. words nailed on first try)
  * Total time
  * Mean time-to-press (how much time before the user typed the next character)
  * Most frequent innacurate characters
  * % faster/slower than beat
* Cache text with at least one try:
  * Cache the app state in the browser for re-use (could be an heavy object, better done in a backend db).
  * Add a UI for the user to browse through saved states and reuse them in the app.
* Turn current app state stream into graphs.
* [maybe?] Add a "free-typing" mode where an error doesn't have to be fixed, ie. the user may keep on typing or may fix that one last incorrect letter. No WPM/records computed I guess.
* [maybe?] Embed a collection of text in French and English, possibly other (roman) languages.
* Bind Shift-Enter the same as Escape.
* Somehow ignore combination keys such as Ctrl+…
* Challenge / gameplay mode:
  * During replay, set a marker at first previous error, possibly at next error, etc.
  * Limit number of (real) words displayed in advance.
  * On/off voice over.
* CSS Light theme: use black on beige for .ta-content
* Allow toggling the sidebar. Folded sidebar should simply show setting name with value on top, and "t" as the main logo.
* Rework Edit mode: simply edit in place. Set the same font styling in the textarea, just change the theming. Move the "Edit text" CTA to the top-right corner, like a tab. Use it to convey the fact Edit mode is active.
* WPM setting should convey insights: what is a low, average, good, excellent WPM? What is the world-record? Once we have a history of personnal record, also display how far behind/above the current WPM is, in percentage.
* Using document.hasFocus(), toggle carret blinking.
* Clear "Best" metrics (records)

### Stack

* Import CSS and assets using SystemJS?
* Create a production build by transpiling server-side, etc.
* Speed up dev feedback loop @see JSPM.

## Installation

Part of the experiment was to cover setting up a project with Typescript, ES6 and SystemJS.

### 1. Install stuff, including SystemJS (http://nervosax.com/2015/08/05/why-not-try-jspm-and-systemjs/):

``` sh
# Global depedencies, for reuse across projects. Could be installed locally as well.
sudo npm install -g gulp-cli http-server typescript

# Project's dev stack is installed with npm.
sudo npm install -g gulp-cli http-server typescript
npm install --save-dev systemjs jspm@beta gulp gulp-typescript browserify tsify vinyl-source-stream

# Project's runtime (browser) dependencies are installed with JSPM (see below).
jspm init # https://jspm.io/0.17-beta-guide/creating-a-project.html
jspm install --dev plugin-typescript
jspm install npm:xstream npm:@cycle/run npm:@cycle/dom npm:@cycle/http npm:@cycle/isolate npm:cycle-onionify npm:classnames
```

And prepare index.html:

``` html
<!doctype html>
<meta charset="utf-8">
<script src="jspm_packages/system.js"></script>
<script src="jspm.config.js"></script>
<link rel="stylesheet" type="text/css" href="theme.css">

<body class="main">
  <script>
    SystemJS.import('src/cyclejs-app.ts');
  </script>
</body>
```

[SystemJS](https://github.com/systemjs/systemjs), a universal *module loader*, allows for importing ES6 modules (aka. ECMAScript 2015 native modules): `export Foo` => `import Foo from "bar"`. For those modules are written in TypeScript, the `typescript` transpiler gets installed as well as a plugin.

Dependencies required to run the app in the browser are handled with [JSPM](https://jspm.io/), a browser-oriented *package manager* which works with SystemJS (v0.17.x-beta.y is used).

JSPM brings automated in-browser transpilation: upon loading the app, source code gets transpiled from TypeScript to browser-compliant JS.

The overall logic is as follow:

```
ES6 TypeScript module
          |
      [SystemJS]
          |
          v
   ES6 JS transpile
          |
        [JSPM]
          |
          v
   ES5 JS (browser)
```

A production, pre-transpiled build may be generated so that all modules/assets are compiled into a single, optimized bundle.

### 2. Follow instructions at:

* https://github.com/buzinas/tslint-eslint-rules#usage
* whatever I forgot to bookmark but did along the way… sorry ^^

### 3. Generate cert.pem and key.pem

To be used by http-server running with https:

``` sh
openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
```
### 4. Create tsconfig.js (useful for tsc manual compiling, should not be used though):

``` json
{
  "compilerOptions": {
    "target": "es2015",
    "module": "commonjs",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "rootDir": ".",
    "baseUrl": ".",
  },
  "files": [
    "./src/app.ts"
  ]
}
```

### 5. Adjust jspm.config.js:

``` json
transpiler: "plugin-typescript",
packages: {
  "cyclejs-app": {
    "main": "src/cyclejs-app.ts",
    "meta": {
      "*.ts": {
        "loader": "plugin-typescript"
      }
    }
  }
}
```

### 6. [Optional] Create gulpfile.js

``` js
var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");

gulp.task("default", function () {
return tsProject.src()
                .pipe(tsProject())
                .js.pipe(gulp.dest("."));
});
```

### 7. Fill in app.ts with CycleJS code written in Typescript

### 8. [Optional] Run gulp to compile TS to JS (ES5)

Might help with debugging generated JS but shouldn't be needed as SystemJS will transpile in the browser in dev mode.

### 9. Run http-server

So as to run the local web server at https://localhost:8080/.

``` sh
http-server -c-1 -S -C cert.pem -K key.pem -o
```
