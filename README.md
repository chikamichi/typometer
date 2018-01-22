Typometer
=========

**A silly micro-app to teach myself some FRP using Cycle.js.**

* Demo: https://typometer.netlify.com/
* Keybindings: ESC to retry, Ctrl+Enter or F2 to edit text.

## Synopsis

``` sh
# Follow instructions under the "Installation" section, then:
npm start:dev
```

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
* https://facebook.github.io/watchman/docs/install.html
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
npm start:dev
```

## Build

``` sh
npm run build
```

Bundled application is available in the dist/ directory.
