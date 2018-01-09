https://egghead.io/lessons/rxjs-separate-logic-from-effects-in-cycle-js



Install stuff, including SystemJS (http://nervosax.com/2015/08/05/why-not-try-jspm-and-systemjs/):

``` sh
npm install --save-dev systemjs gulp gulp-typescript browserify tsify vinyl-source-stream
sudo npm install -g gulp-cli jspm@beta http-server typescript

# For we are gonna use Typescript, let's switch from npm to jspm for
# app-specific libs.
jspm init # https://jspm.io/0.17-beta-guide/creating-a-project.html
jspm install --dev plugin-typescript
jspm install npm:xstream npm:@cycle/run npm:@cycle/dom npm:@cycle/http npm:@cycle/isolate npm:classnames
```



Follow instructions at:

* https://www.npmjs.com/package/jspm-dev-server
* whatever I forgot



Generate cert and key for http-server running with https:

``` sh
openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
```



Create tsconfig.js (useful for tsc manual compiling, should not be used though):

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



Adjust jspm.config.js:

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


[Optional: Create gulpfile.js:]

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



Create index.html:

``` html
<!doctype html>
<meta charset="utf-8">
<script src="jspm_packages/system.js"></script>

<body>
<div id="main"></div>
<script>
  SystemJS.import('src/app.ts');
</script>
</body>
```



Fill in app.ts with CycleJS code written using Typescript semantics.

[Optional: Run gulp to compile TS to JS (ES5). Might help with debugging
generated JS but shouldn't be needed as SystemJS will transpile in the browser
in dev mode.]

Run http-server to run the local web server at http://localhost:8080/:

``` sh
http-server -c-1 -S -C cert.pem -K key.pem -o
```

[Optional: create a production build by transpiling server-side etc. TODO]
