SystemJS.config({
  baseURL: ".",
  paths: {
    "typometer/": "src/"
  },
  browserConfig: {
    "paths": {
      "github:": "/jspm_packages/github/",
      "npm:": "/jspm_packages/npm/"
    }
  },
  nodeConfig: {
    "paths": {
      "github:": "jspm_packages/github/",
      "npm:": "jspm_packages/npm/"
    }
  },
  devConfig: {
    "map": {
      "plugin-typescript": "github:frankwallis/plugin-typescript@9.0.0",
      "@cycle/dom": "npm:@cycle/dom@22.0.0",
      "@cycle/http": "npm:@cycle/http@15.0.0",
      "@cycle/isolate": "npm:@cycle/isolate@4.1.0",
      "@cycle/run": "npm:@cycle/run@5.1.0",
      "classnames": "npm:classnames@2.2.6",
      "cycle-onionify": "npm:cycle-onionify@6.1.0",
      "xstream": "npm:xstream@11.7.0",
      "most": "npm:most@1.7.3"
    },
    "packages": {
      "npm:@cycle/http@15.0.0": {
        "map": {
          "@cycle/run": "npm:@cycle/run@5.1.0",
          "xstream": "npm:xstream@11.7.0",
          "@types/superagent": "npm:@types/superagent@3.8.4",
          "superagent": "npm:superagent@3.8.3",
          "rxjs": "npm:rxjs@6.3.3",
          "most": "npm:most@1.7.3"
        }
      },
      "npm:@cycle/dom@22.0.0": {
        "map": {
          "@cycle/run": "npm:@cycle/run@5.1.0",
          "xstream": "npm:xstream@11.7.0",
          "rxjs": "npm:rxjs@6.3.3",
          "snabbdom-selector": "npm:snabbdom-selector@4.1.0",
          "snabbdom": "npm:snabbdom@0.7.2"
        }
      },
      "npm:cycle-onionify@6.1.0": {
        "map": {
          "@cycle/run": "npm:@cycle/run@5.1.0",
          "@cycle/isolate": "npm:@cycle/isolate@4.1.0",
          "xstream": "npm:xstream@11.7.0",
          "quicktask": "npm:quicktask@1.1.0"
        }
      },
      "npm:@cycle/run@5.1.0": {
        "map": {
          "xstream": "npm:xstream@11.7.0",
          "quicktask": "npm:quicktask@1.1.0"
        }
      },
      "npm:@cycle/isolate@4.1.0": {
        "map": {
          "@cycle/run": "npm:@cycle/run@5.1.0",
          "xstream": "npm:xstream@11.7.0"
        }
      },
      "npm:xstream@11.7.0": {
        "map": {
          "symbol-observable": "npm:symbol-observable@1.2.0"
        }
      },
      "npm:@types/superagent@3.8.4": {
        "map": {
          "@types/cookiejar": "npm:@types/cookiejar@2.1.0",
          "@types/node": "npm:@types/node@10.12.11"
        }
      },
      "npm:rxjs@6.3.3": {
        "map": {
          "tslib": "npm:tslib@1.9.3"
        }
      },
      "npm:superagent@3.8.3": {
        "map": {
          "component-emitter": "npm:component-emitter@1.2.1",
          "methods": "npm:methods@1.1.2",
          "cookiejar": "npm:cookiejar@2.1.2",
          "extend": "npm:extend@3.0.2",
          "formidable": "npm:formidable@1.2.1",
          "form-data": "npm:form-data@2.3.3",
          "mime": "npm:mime@1.6.0",
          "qs": "npm:qs@6.6.0",
          "debug": "npm:debug@3.2.6",
          "readable-stream": "npm:readable-stream@2.3.6"
        }
      },
      "npm:most@1.7.3": {
        "map": {
          "symbol-observable": "npm:symbol-observable@1.2.0",
          "@most/prelude": "npm:@most/prelude@1.7.2",
          "@most/multicast": "npm:@most/multicast@1.3.0"
        }
      },
      "npm:form-data@2.3.3": {
        "map": {
          "combined-stream": "npm:combined-stream@1.0.7",
          "asynckit": "npm:asynckit@0.4.0",
          "mime-types": "npm:mime-types@2.1.21"
        }
      },
      "npm:debug@3.2.6": {
        "map": {
          "ms": "npm:ms@2.1.1"
        }
      },
      "npm:snabbdom-selector@4.1.0": {
        "map": {
          "tree-selector": "npm:tree-selector@2.1.0"
        }
      },
      "npm:mime-types@2.1.21": {
        "map": {
          "mime-db": "npm:mime-db@1.37.0"
        }
      },
      "npm:combined-stream@1.0.7": {
        "map": {
          "delayed-stream": "npm:delayed-stream@1.0.0"
        }
      },
      "npm:@most/multicast@1.3.0": {
        "map": {
          "@most/prelude": "npm:@most/prelude@1.7.2"
        }
      }
    }
  },
  transpiler: "plugin-typescript",
  typescriptOptions: {
    "tsconfig": true
  },
  packages: {
    "typometer": {
      "main": "typometer.ts",
      "defaultExtension": "ts"
    },
    "typometer/components/Core": {
      "defaultExtension": "ts",
      "main": "index.ts"
    },
    "typometer/components/Content": {
      "defaultExtension": "ts",
      "main": "index.ts"
    },
    "typometer/components/CustomText": {
      "defaultExtension": "ts",
      "main": "index.ts"
    },
    "typometer/components/LiveText": {
      "defaultExtension": "ts",
      "main": "index.ts"
    },
    "typometer/components/Metrics": {
      "defaultExtension": "ts",
      "main": "index.ts"
    },
    "typometer/components/BeatManager": {
      "defaultExtension": "ts",
      "main": "index.ts"
    },
    "typometer/components/Replay": {
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
    "assert": "npm:jspm-nodelibs-assert@0.2.1",
    "buffer": "npm:jspm-nodelibs-buffer@0.2.3",
    "constants": "npm:jspm-nodelibs-constants@0.2.1",
    "crypto": "npm:jspm-nodelibs-crypto@0.2.1",
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
    "zlib": "npm:jspm-nodelibs-zlib@0.2.3"
  },
  packages: {
    "npm:typescript@2.6.2": {
      "map": {
        "source-map-support": "npm:source-map-support@0.5.9"
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
    "npm:crypto-browserify@3.12.0": {
      "map": {
        "browserify-cipher": "npm:browserify-cipher@1.0.1",
        "create-ecdh": "npm:create-ecdh@4.0.3",
        "create-hash": "npm:create-hash@1.2.0",
        "diffie-hellman": "npm:diffie-hellman@5.0.3",
        "create-hmac": "npm:create-hmac@1.1.7",
        "inherits": "npm:inherits@2.0.3",
        "pbkdf2": "npm:pbkdf2@3.0.17",
        "public-encrypt": "npm:public-encrypt@4.0.3",
        "randomfill": "npm:randomfill@1.0.4",
        "randombytes": "npm:randombytes@2.0.6",
        "browserify-sign": "npm:browserify-sign@4.0.4"
      }
    },
    "npm:jspm-nodelibs-buffer@0.2.3": {
      "map": {
        "buffer": "npm:buffer@5.2.1"
      }
    },
    "npm:evp_bytestokey@1.0.3": {
      "map": {
        "safe-buffer": "npm:safe-buffer@5.1.2",
        "md5.js": "npm:md5.js@1.3.5"
      }
    },
    "npm:browserify-sign@4.0.4": {
      "map": {
        "bn.js": "npm:bn.js@4.11.8",
        "create-hash": "npm:create-hash@1.2.0",
        "create-hmac": "npm:create-hmac@1.1.7",
        "inherits": "npm:inherits@2.0.3",
        "browserify-rsa": "npm:browserify-rsa@4.0.1",
        "parse-asn1": "npm:parse-asn1@5.1.1",
        "elliptic": "npm:elliptic@6.4.1"
      }
    },
    "npm:cipher-base@1.0.4": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "safe-buffer": "npm:safe-buffer@5.1.2"
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
    "npm:des.js@1.0.0": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "minimalistic-assert": "npm:minimalistic-assert@1.0.1"
      }
    },
    "npm:hash-base@3.0.4": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "safe-buffer": "npm:safe-buffer@5.1.2"
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
        "readable-stream": "npm:readable-stream@2.3.6"
      }
    },
    "npm:hmac-drbg@1.0.1": {
      "map": {
        "hash.js": "npm:hash.js@1.1.7",
        "minimalistic-assert": "npm:minimalistic-assert@1.0.1",
        "minimalistic-crypto-utils": "npm:minimalistic-crypto-utils@1.0.1"
      }
    },
    "npm:jspm-nodelibs-string_decoder@0.2.2": {
      "map": {
        "string_decoder": "npm:string_decoder@0.10.31"
      }
    },
    "npm:jspm-nodelibs-http@0.2.0": {
      "map": {
        "http-browserify": "npm:stream-http@2.8.3"
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
        "readable-stream": "npm:readable-stream@2.3.6",
        "pako": "npm:pako@0.2.9"
      }
    },
    "npm:randombytes@2.0.6": {
      "map": {
        "safe-buffer": "npm:safe-buffer@5.1.2"
      }
    },
    "npm:source-map-support@0.5.9": {
      "map": {
        "buffer-from": "npm:buffer-from@1.1.1",
        "source-map": "npm:source-map@0.6.1"
      }
    },
    "npm:buffer@5.2.1": {
      "map": {
        "base64-js": "npm:base64-js@1.3.0",
        "ieee754": "npm:ieee754@1.1.12"
      }
    },
    "npm:browserify-cipher@1.0.1": {
      "map": {
        "browserify-des": "npm:browserify-des@1.0.2",
        "browserify-aes": "npm:browserify-aes@1.2.0",
        "evp_bytestokey": "npm:evp_bytestokey@1.0.3"
      }
    },
    "npm:create-hmac@1.1.7": {
      "map": {
        "cipher-base": "npm:cipher-base@1.0.4",
        "create-hash": "npm:create-hash@1.2.0",
        "ripemd160": "npm:ripemd160@2.0.2",
        "sha.js": "npm:sha.js@2.4.11",
        "inherits": "npm:inherits@2.0.3",
        "safe-buffer": "npm:safe-buffer@5.1.2"
      }
    },
    "npm:browserify-des@1.0.2": {
      "map": {
        "cipher-base": "npm:cipher-base@1.0.4",
        "des.js": "npm:des.js@1.0.0",
        "inherits": "npm:inherits@2.0.3",
        "safe-buffer": "npm:safe-buffer@5.1.2"
      }
    },
    "npm:public-encrypt@4.0.3": {
      "map": {
        "parse-asn1": "npm:parse-asn1@5.1.1",
        "create-hash": "npm:create-hash@1.2.0",
        "browserify-rsa": "npm:browserify-rsa@4.0.1",
        "randombytes": "npm:randombytes@2.0.6",
        "bn.js": "npm:bn.js@4.11.8",
        "safe-buffer": "npm:safe-buffer@5.1.2"
      }
    },
    "npm:parse-asn1@5.1.1": {
      "map": {
        "browserify-aes": "npm:browserify-aes@1.2.0",
        "create-hash": "npm:create-hash@1.2.0",
        "evp_bytestokey": "npm:evp_bytestokey@1.0.3",
        "pbkdf2": "npm:pbkdf2@3.0.17",
        "asn1.js": "npm:asn1.js@4.10.1"
      }
    },
    "npm:create-hash@1.2.0": {
      "map": {
        "cipher-base": "npm:cipher-base@1.0.4",
        "ripemd160": "npm:ripemd160@2.0.2",
        "sha.js": "npm:sha.js@2.4.11",
        "md5.js": "npm:md5.js@1.3.5",
        "inherits": "npm:inherits@2.0.3"
      }
    },
    "npm:pbkdf2@3.0.17": {
      "map": {
        "create-hash": "npm:create-hash@1.2.0",
        "create-hmac": "npm:create-hmac@1.1.7",
        "ripemd160": "npm:ripemd160@2.0.2",
        "sha.js": "npm:sha.js@2.4.11",
        "safe-buffer": "npm:safe-buffer@5.1.2"
      }
    },
    "npm:browserify-aes@1.2.0": {
      "map": {
        "cipher-base": "npm:cipher-base@1.0.4",
        "create-hash": "npm:create-hash@1.2.0",
        "evp_bytestokey": "npm:evp_bytestokey@1.0.3",
        "inherits": "npm:inherits@2.0.3",
        "safe-buffer": "npm:safe-buffer@5.1.2",
        "buffer-xor": "npm:buffer-xor@1.0.3"
      }
    },
    "npm:create-ecdh@4.0.3": {
      "map": {
        "elliptic": "npm:elliptic@6.4.1",
        "bn.js": "npm:bn.js@4.11.8"
      }
    },
    "npm:ripemd160@2.0.2": {
      "map": {
        "hash-base": "npm:hash-base@3.0.4",
        "inherits": "npm:inherits@2.0.3"
      }
    },
    "npm:md5.js@1.3.5": {
      "map": {
        "hash-base": "npm:hash-base@3.0.4",
        "inherits": "npm:inherits@2.0.3",
        "safe-buffer": "npm:safe-buffer@5.1.2"
      }
    },
    "npm:randomfill@1.0.4": {
      "map": {
        "randombytes": "npm:randombytes@2.0.6",
        "safe-buffer": "npm:safe-buffer@5.1.2"
      }
    },
    "npm:diffie-hellman@5.0.3": {
      "map": {
        "randombytes": "npm:randombytes@2.0.6",
        "miller-rabin": "npm:miller-rabin@4.0.1",
        "bn.js": "npm:bn.js@4.11.8"
      }
    },
    "npm:sha.js@2.4.11": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "safe-buffer": "npm:safe-buffer@5.1.2"
      }
    },
    "npm:elliptic@6.4.1": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "bn.js": "npm:bn.js@4.11.8",
        "hmac-drbg": "npm:hmac-drbg@1.0.1",
        "hash.js": "npm:hash.js@1.1.7",
        "minimalistic-assert": "npm:minimalistic-assert@1.0.1",
        "brorand": "npm:brorand@1.1.0",
        "minimalistic-crypto-utils": "npm:minimalistic-crypto-utils@1.0.1"
      }
    },
    "npm:asn1.js@4.10.1": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "bn.js": "npm:bn.js@4.11.8",
        "minimalistic-assert": "npm:minimalistic-assert@1.0.1"
      }
    },
    "npm:hash.js@1.1.7": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "minimalistic-assert": "npm:minimalistic-assert@1.0.1"
      }
    },
    "npm:readable-stream@2.3.6": {
      "map": {
        "safe-buffer": "npm:safe-buffer@5.1.2",
        "string_decoder": "npm:string_decoder@1.1.1",
        "inherits": "npm:inherits@2.0.3",
        "process-nextick-args": "npm:process-nextick-args@2.0.0",
        "core-util-is": "npm:core-util-is@1.0.2",
        "isarray": "npm:isarray@1.0.0",
        "util-deprecate": "npm:util-deprecate@1.0.2"
      }
    },
    "npm:string_decoder@1.1.1": {
      "map": {
        "safe-buffer": "npm:safe-buffer@5.1.2"
      }
    },
    "npm:stream-http@2.8.3": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "readable-stream": "npm:readable-stream@2.3.6",
        "to-arraybuffer": "npm:to-arraybuffer@1.0.1",
        "builtin-status-codes": "npm:builtin-status-codes@3.0.0",
        "xtend": "npm:xtend@4.0.1"
      }
    }
  }
});
