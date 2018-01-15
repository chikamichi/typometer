SystemJS.config({
  baseURL: ".",
  browserConfig: {
    "paths": {
      "github:": "/jspm_packages/github/",
      "npm:": "/jspm_packages/npm/",
      "app/": "/src/"
    }
  },
  nodeConfig: {
    "paths": {
      "github:": "jspm_packages/github/",
      "npm:": "jspm_packages/npm/",
      "app/": "/src/"
    }
  },
  devConfig: {
    "map": {
      "plugin-typescript": "github:frankwallis/plugin-typescript@8.0.0"
    }
  },
  transpiler: "plugin-typescript",
  typescriptOptions: {
    tsconfig: "/tsconfig.json"
  },
  packages: {
    "app/": {
      "defaultExtension": "ts"
    },
    // tsconfig.json's moduleResolution set to "node" should take care of that,
    // but for some reason it does not: TODO investigate
    "app/components/Core": {
      "defaultExtension": "ts",
      "main": "index.ts"
    },
    "app/components/CustomText": {
      "defaultExtension": "ts",
      "main": "index.ts"
    },
    "app/components/LiveText": {
      "defaultExtension": "ts",
      "main": "index.ts"
    }
  }
});

SystemJS.config({
  packageConfigPaths: [
    "github:*/*.json",
    "npm:@*/*.json",
    "npm:*.json"
  ],
  map: {
    "@cycle/dom": "npm:@cycle/dom@20.1.0",
    "@cycle/http": "npm:@cycle/http@14.8.0",
    "@cycle/isolate": "npm:@cycle/isolate@3.2.0",
    "@cycle/run": "npm:@cycle/run@4.1.0",
    "assert": "npm:jspm-nodelibs-assert@0.2.1",
    "buffer": "npm:jspm-nodelibs-buffer@0.2.3",
    "classnames": "npm:classnames@2.2.5",
    "constants": "npm:jspm-nodelibs-constants@0.2.1",
    "crypto": "npm:jspm-nodelibs-crypto@0.2.1",
    "cycle-onionify": "npm:cycle-onionify@5.0.0",
    "events": "npm:jspm-nodelibs-events@0.2.2",
    "fs": "npm:jspm-nodelibs-fs@0.2.1",
    "http": "npm:jspm-nodelibs-http@0.2.0",
    "https": "npm:jspm-nodelibs-https@0.2.2",
    "module": "npm:jspm-nodelibs-module@0.2.1",
    "net": "npm:jspm-nodelibs-net@0.2.1",
    "os": "npm:jspm-nodelibs-os@0.2.2",
    "path": "npm:jspm-nodelibs-path@0.2.3",
    "process": "npm:jspm-nodelibs-process@0.2.1",
    "querystring": "npm:jspm-nodelibs-querystring@0.2.2",
    "stream": "npm:jspm-nodelibs-stream@0.2.1",
    "string_decoder": "npm:jspm-nodelibs-string_decoder@0.2.2",
    "tty": "npm:jspm-nodelibs-tty@0.2.1",
    "typescript": "npm:typescript@2.6.2",
    "url": "npm:jspm-nodelibs-url@0.2.1",
    "util": "npm:jspm-nodelibs-util@0.2.2",
    "vm": "npm:jspm-nodelibs-vm@0.2.1",
    "xstream": "npm:xstream@11.1.0",
    "zlib": "npm:jspm-nodelibs-zlib@0.2.3"
  },
  packages: {
    "npm:typescript@2.6.2": {
      "map": {
        "source-map-support": "npm:source-map-support@0.5.0"
      }
    },
    "npm:jspm-nodelibs-os@0.2.2": {
      "map": {
        "os-browserify": "npm:os-browserify@0.3.0"
      }
    },
    "npm:jspm-nodelibs-crypto@0.2.1": {
      "map": {
        "crypto-browserify": "npm:crypto-browserify@3.12.0"
      }
    },
    "npm:source-map-support@0.5.0": {
      "map": {
        "source-map": "npm:source-map@0.6.1"
      }
    },
    "npm:crypto-browserify@3.12.0": {
      "map": {
        "browserify-cipher": "npm:browserify-cipher@1.0.0",
        "create-ecdh": "npm:create-ecdh@4.0.0",
        "create-hash": "npm:create-hash@1.1.3",
        "diffie-hellman": "npm:diffie-hellman@5.0.2",
        "create-hmac": "npm:create-hmac@1.1.6",
        "inherits": "npm:inherits@2.0.3",
        "pbkdf2": "npm:pbkdf2@3.0.14",
        "public-encrypt": "npm:public-encrypt@4.0.0",
        "randomfill": "npm:randomfill@1.0.3",
        "randombytes": "npm:randombytes@2.0.6",
        "browserify-sign": "npm:browserify-sign@4.0.4"
      }
    },
    "npm:jspm-nodelibs-buffer@0.2.3": {
      "map": {
        "buffer": "npm:buffer@5.0.8"
      }
    },
    "npm:create-hash@1.1.3": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "cipher-base": "npm:cipher-base@1.0.4",
        "ripemd160": "npm:ripemd160@2.0.1",
        "sha.js": "npm:sha.js@2.4.9"
      }
    },
    "npm:pbkdf2@3.0.14": {
      "map": {
        "create-hash": "npm:create-hash@1.1.3",
        "create-hmac": "npm:create-hmac@1.1.6",
        "ripemd160": "npm:ripemd160@2.0.1",
        "sha.js": "npm:sha.js@2.4.9",
        "safe-buffer": "npm:safe-buffer@5.1.1"
      }
    },
    "npm:diffie-hellman@5.0.2": {
      "map": {
        "randombytes": "npm:randombytes@2.0.6",
        "bn.js": "npm:bn.js@4.11.8",
        "miller-rabin": "npm:miller-rabin@4.0.1"
      }
    },
    "npm:create-hmac@1.1.6": {
      "map": {
        "create-hash": "npm:create-hash@1.1.3",
        "inherits": "npm:inherits@2.0.3",
        "cipher-base": "npm:cipher-base@1.0.4",
        "ripemd160": "npm:ripemd160@2.0.1",
        "sha.js": "npm:sha.js@2.4.9",
        "safe-buffer": "npm:safe-buffer@5.1.1"
      }
    },
    "npm:public-encrypt@4.0.0": {
      "map": {
        "create-hash": "npm:create-hash@1.1.3",
        "randombytes": "npm:randombytes@2.0.6",
        "bn.js": "npm:bn.js@4.11.8",
        "browserify-rsa": "npm:browserify-rsa@4.0.1",
        "parse-asn1": "npm:parse-asn1@5.1.0"
      }
    },
    "npm:randomfill@1.0.3": {
      "map": {
        "randombytes": "npm:randombytes@2.0.6",
        "safe-buffer": "npm:safe-buffer@5.1.1"
      }
    },
    "npm:browserify-cipher@1.0.0": {
      "map": {
        "browserify-des": "npm:browserify-des@1.0.0",
        "evp_bytestokey": "npm:evp_bytestokey@1.0.3",
        "browserify-aes": "npm:browserify-aes@1.1.1"
      }
    },
    "npm:create-ecdh@4.0.0": {
      "map": {
        "bn.js": "npm:bn.js@4.11.8",
        "elliptic": "npm:elliptic@6.4.0"
      }
    },
    "npm:browserify-des@1.0.0": {
      "map": {
        "cipher-base": "npm:cipher-base@1.0.4",
        "inherits": "npm:inherits@2.0.3",
        "des.js": "npm:des.js@1.0.0"
      }
    },
    "npm:browserify-aes@1.1.1": {
      "map": {
        "cipher-base": "npm:cipher-base@1.0.4",
        "create-hash": "npm:create-hash@1.1.3",
        "evp_bytestokey": "npm:evp_bytestokey@1.0.3",
        "inherits": "npm:inherits@2.0.3",
        "safe-buffer": "npm:safe-buffer@5.1.1",
        "buffer-xor": "npm:buffer-xor@1.0.3"
      }
    },
    "npm:evp_bytestokey@1.0.3": {
      "map": {
        "safe-buffer": "npm:safe-buffer@5.1.1",
        "md5.js": "npm:md5.js@1.3.4"
      }
    },
    "npm:browserify-sign@4.0.4": {
      "map": {
        "bn.js": "npm:bn.js@4.11.8",
        "create-hash": "npm:create-hash@1.1.3",
        "create-hmac": "npm:create-hmac@1.1.6",
        "inherits": "npm:inherits@2.0.3",
        "browserify-rsa": "npm:browserify-rsa@4.0.1",
        "parse-asn1": "npm:parse-asn1@5.1.0",
        "elliptic": "npm:elliptic@6.4.0"
      }
    },
    "npm:buffer@5.0.8": {
      "map": {
        "base64-js": "npm:base64-js@1.2.1",
        "ieee754": "npm:ieee754@1.1.8"
      }
    },
    "npm:cipher-base@1.0.4": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "safe-buffer": "npm:safe-buffer@5.1.1"
      }
    },
    "npm:ripemd160@2.0.1": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "hash-base": "npm:hash-base@2.0.2"
      }
    },
    "npm:sha.js@2.4.9": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "safe-buffer": "npm:safe-buffer@5.1.1"
      }
    },
    "npm:browserify-rsa@4.0.1": {
      "map": {
        "bn.js": "npm:bn.js@4.11.8",
        "randombytes": "npm:randombytes@2.0.6"
      }
    },
    "npm:miller-rabin@4.0.1": {
      "map": {
        "bn.js": "npm:bn.js@4.11.8",
        "brorand": "npm:brorand@1.1.0"
      }
    },
    "npm:parse-asn1@5.1.0": {
      "map": {
        "browserify-aes": "npm:browserify-aes@1.1.1",
        "create-hash": "npm:create-hash@1.1.3",
        "evp_bytestokey": "npm:evp_bytestokey@1.0.3",
        "pbkdf2": "npm:pbkdf2@3.0.14",
        "asn1.js": "npm:asn1.js@4.9.2"
      }
    },
    "npm:des.js@1.0.0": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "minimalistic-assert": "npm:minimalistic-assert@1.0.0"
      }
    },
    "npm:md5.js@1.3.4": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "hash-base": "npm:hash-base@3.0.4"
      }
    },
    "npm:elliptic@6.4.0": {
      "map": {
        "bn.js": "npm:bn.js@4.11.8",
        "inherits": "npm:inherits@2.0.3",
        "brorand": "npm:brorand@1.1.0",
        "minimalistic-assert": "npm:minimalistic-assert@1.0.0",
        "hmac-drbg": "npm:hmac-drbg@1.0.1",
        "hash.js": "npm:hash.js@1.1.3",
        "minimalistic-crypto-utils": "npm:minimalistic-crypto-utils@1.0.1"
      }
    },
    "npm:hash-base@3.0.4": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "safe-buffer": "npm:safe-buffer@5.1.1"
      }
    },
    "npm:hash-base@2.0.2": {
      "map": {
        "inherits": "npm:inherits@2.0.3"
      }
    },
    "npm:asn1.js@4.9.2": {
      "map": {
        "bn.js": "npm:bn.js@4.11.8",
        "inherits": "npm:inherits@2.0.3",
        "minimalistic-assert": "npm:minimalistic-assert@1.0.0"
      }
    },
    "npm:jspm-nodelibs-stream@0.2.1": {
      "map": {
        "stream-browserify": "npm:stream-browserify@2.0.1"
      }
    },
    "npm:stream-browserify@2.0.1": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "readable-stream": "npm:readable-stream@2.3.3"
      }
    },
    "npm:hmac-drbg@1.0.1": {
      "map": {
        "hash.js": "npm:hash.js@1.1.3",
        "minimalistic-assert": "npm:minimalistic-assert@1.0.0",
        "minimalistic-crypto-utils": "npm:minimalistic-crypto-utils@1.0.1"
      }
    },
    "npm:hash.js@1.1.3": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "minimalistic-assert": "npm:minimalistic-assert@1.0.0"
      }
    },
    "npm:jspm-nodelibs-string_decoder@0.2.2": {
      "map": {
        "string_decoder": "npm:string_decoder@0.10.31"
      }
    },
    "npm:readable-stream@2.3.3": {
      "map": {
        "string_decoder": "npm:string_decoder@1.0.3",
        "inherits": "npm:inherits@2.0.3",
        "safe-buffer": "npm:safe-buffer@5.1.1",
        "isarray": "npm:isarray@1.0.0",
        "core-util-is": "npm:core-util-is@1.0.2",
        "util-deprecate": "npm:util-deprecate@1.0.2",
        "process-nextick-args": "npm:process-nextick-args@1.0.7"
      }
    },
    "npm:string_decoder@1.0.3": {
      "map": {
        "safe-buffer": "npm:safe-buffer@5.1.1"
      }
    },
    "npm:xstream@11.1.0": {
      "map": {
        "symbol-observable": "npm:symbol-observable@1.0.4"
      }
    },
    "npm:@cycle/dom@20.1.0": {
      "map": {
        "xstream": "npm:xstream@11.1.0",
        "@cycle/run": "npm:@cycle/run@4.1.0",
        "es6-map": "npm:es6-map@0.1.5",
        "snabbdom-selector": "npm:snabbdom-selector@2.0.1",
        "snabbdom": "npm:snabbdom@0.7.0"
      }
    },
    "npm:@cycle/run@4.1.0": {
      "map": {
        "xstream": "npm:xstream@11.1.0"
      }
    },
    "npm:es6-map@0.1.5": {
      "map": {
        "d": "npm:d@1.0.0",
        "es6-set": "npm:es6-set@0.1.5",
        "es6-symbol": "npm:es6-symbol@3.1.1",
        "event-emitter": "npm:event-emitter@0.3.5",
        "es5-ext": "npm:es5-ext@0.10.37",
        "es6-iterator": "npm:es6-iterator@2.0.3"
      }
    },
    "npm:es6-set@0.1.5": {
      "map": {
        "d": "npm:d@1.0.0",
        "es6-symbol": "npm:es6-symbol@3.1.1",
        "event-emitter": "npm:event-emitter@0.3.5",
        "es5-ext": "npm:es5-ext@0.10.37",
        "es6-iterator": "npm:es6-iterator@2.0.3"
      }
    },
    "npm:es6-symbol@3.1.1": {
      "map": {
        "d": "npm:d@1.0.0",
        "es5-ext": "npm:es5-ext@0.10.37"
      }
    },
    "npm:d@1.0.0": {
      "map": {
        "es5-ext": "npm:es5-ext@0.10.37"
      }
    },
    "npm:event-emitter@0.3.5": {
      "map": {
        "es5-ext": "npm:es5-ext@0.10.37",
        "d": "npm:d@1.0.0"
      }
    },
    "npm:es5-ext@0.10.37": {
      "map": {
        "es6-symbol": "npm:es6-symbol@3.1.1",
        "es6-iterator": "npm:es6-iterator@2.0.3"
      }
    },
    "npm:es6-iterator@2.0.3": {
      "map": {
        "d": "npm:d@1.0.0",
        "es5-ext": "npm:es5-ext@0.10.37",
        "es6-symbol": "npm:es6-symbol@3.1.1"
      }
    },
    "npm:snabbdom-selector@2.0.1": {
      "map": {
        "cssauron2": "npm:cssauron2@2.0.3"
      }
    },
    "npm:cssauron2@2.0.3": {
      "map": {
        "through": "npm:through@2.3.8"
      }
    },
    "npm:@cycle/http@14.8.0": {
      "map": {
        "@cycle/run": "npm:@cycle/run@4.1.0",
        "xstream": "npm:xstream@11.1.0",
        "superagent": "npm:superagent@3.7.0",
        "@types/superagent": "npm:@types/superagent@3.5.6"
      }
    },
    "npm:superagent@3.7.0": {
      "map": {
        "debug": "npm:debug@3.1.0",
        "component-emitter": "npm:component-emitter@1.2.1",
        "extend": "npm:extend@3.0.1",
        "readable-stream": "npm:readable-stream@2.3.3",
        "methods": "npm:methods@1.1.2",
        "cookiejar": "npm:cookiejar@2.1.1",
        "formidable": "npm:formidable@1.1.1",
        "mime": "npm:mime@1.6.0",
        "form-data": "npm:form-data@2.3.1",
        "qs": "npm:qs@6.5.1"
      }
    },
    "npm:debug@3.1.0": {
      "map": {
        "ms": "npm:ms@2.0.0"
      }
    },
    "npm:form-data@2.3.1": {
      "map": {
        "asynckit": "npm:asynckit@0.4.0",
        "combined-stream": "npm:combined-stream@1.0.5",
        "mime-types": "npm:mime-types@2.1.17"
      }
    },
    "npm:combined-stream@1.0.5": {
      "map": {
        "delayed-stream": "npm:delayed-stream@1.0.0"
      }
    },
    "npm:mime-types@2.1.17": {
      "map": {
        "mime-db": "npm:mime-db@1.30.0"
      }
    },
    "npm:@types/superagent@3.5.6": {
      "map": {
        "@types/node": "npm:@types/node@9.3.0"
      }
    },
    "npm:jspm-nodelibs-http@0.2.0": {
      "map": {
        "http-browserify": "npm:stream-http@2.7.2"
      }
    },
    "npm:stream-http@2.7.2": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "readable-stream": "npm:readable-stream@2.3.3",
        "xtend": "npm:xtend@4.0.1",
        "to-arraybuffer": "npm:to-arraybuffer@1.0.1",
        "builtin-status-codes": "npm:builtin-status-codes@3.0.0"
      }
    },
    "npm:jspm-nodelibs-url@0.2.1": {
      "map": {
        "url": "npm:url@0.11.0"
      }
    },
    "npm:url@0.11.0": {
      "map": {
        "querystring": "npm:querystring@0.2.0",
        "punycode": "npm:punycode@1.3.2"
      }
    },
    "npm:jspm-nodelibs-zlib@0.2.3": {
      "map": {
        "browserify-zlib": "npm:browserify-zlib@0.1.4"
      }
    },
    "npm:browserify-zlib@0.1.4": {
      "map": {
        "readable-stream": "npm:readable-stream@2.3.3",
        "pako": "npm:pako@0.2.9"
      }
    },
    "npm:cycle-onionify@5.0.0": {
      "map": {
        "@cycle/run": "npm:@cycle/run@4.1.0",
        "@cycle/isolate": "npm:@cycle/isolate@3.2.0",
        "xstream": "npm:xstream@11.1.0"
      }
    },
    "npm:randombytes@2.0.6": {
      "map": {
        "safe-buffer": "npm:safe-buffer@5.1.1"
      }
    }
  }
});
