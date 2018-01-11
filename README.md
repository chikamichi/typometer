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

* [app] WPM record to allow the user to compete against a ghost on next run
* [app] better ghost behaviour would be to replicate typing rythm entirely
* [app] fix `tabindex` or similar to allow keyboard-centric UX
* [app] fullfledged metrics/records:
  * Key/minute
  * WPM revisited to use a word size based on averaged corpus?
  * Averaged accuracy
  * Highest and lowest instant accuracy
  * Words hit/total (ie. ok at first try)
  * Total time
* [app] upon editing the text:
  * cache the memory stream in the browser for re-use
  * reset records
  * display cached streams to the user for re-use
* [app] exploit cached streams and current stream to graph stuff, compare…
* [app?] add a "free-typing" mode where an error doesn't have to be fixed, ie. the user may keep on typing or may fix that one last incorrect letter
* [app] using ghost tracking, gather metrics about typing: time-to-press, hit/miss, innacurate letters…
* [app] embed a collection of text in French and English, possibly other (roman) languages
* [app] bind Shift-Enter the same as Escape
* [app] somehow ignore combination keys such as Ctrl+…
* [app] ignore typing events when the textarea is focused (cache focus state in a memory-stream?)
* [stack] create a production build by transpiling server-side, etc.
* [stack] speed up dev feedback loop

## Installation

Part of the experiment was to cover setting up a project with Typescript, ES6 and SystemJS.

### 1. Install stuff, including SystemJS (http://nervosax.com/2015/08/05/why-not-try-jspm-and-systemjs/):

``` sh
npm install --save-dev systemjs gulp gulp-typescript browserify tsify vinyl-source-stream
sudo npm install -g gulp-cli jspm@beta http-server typescript

# For we are gonna use Typescript, let's switch from npm to jspm for
# app-specific libs.
jspm init # https://jspm.io/0.17-beta-guide/creating-a-project.html
jspm install --dev plugin-typescript
jspm install npm:xstream npm:@cycle/run npm:@cycle/dom npm:@cycle/http npm:@cycle/isolate npm:classnames
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

### 2. Follow instructions at:

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
