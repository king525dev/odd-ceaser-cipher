"use strict";
var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// modules/date.js
var require_date = __commonJS({
  "modules/date.js"(exports2, module2) {
    "use strict";
    function formatDate() {
      const dater = /* @__PURE__ */ new Date();
      let myDate = dater.getUTCDate();
      let year = dater.getUTCFullYear();
      let month = dater.getMonth() + 1;
      let hours = dater.getUTCHours();
      let minutes = dater.getUTCMinutes();
      if (minutes < 10) {
        minutes = `0${minutes}`;
      }
      if (hours < 10) {
        hours = `0${hours}`;
      }
      if (month < 10) {
        month = `0${month}`;
      }
      if (myDate < 10) {
        myDate = `0${myDate}`;
      }
      return `${myDate}${month}${year}-${hours}${minutes}`;
    }
    module2.exports = formatDate;
  }
});

// main/v1/encrypt/keyGenerator.js
var require_keyGenerator = __commonJS({
  "main/v1/encrypt/keyGenerator.js"(exports2, module2) {
    "use strict";
    function generateKey(min, max, round) {
      let a = [dateNumber(), superRandomiser()];
      let b = [dateNumber(), superRandomiser()];
      let final = oddSwitch(a, b);
      const checkMin = (val) => {
        if (min) {
          if (val < min) {
            while (val < min) {
              val *= 2;
            }
            if (val > max) {
              while (val > max) {
                val -= val / 7;
              }
              return val;
            } else {
              return val;
            }
          } else {
            return val;
          }
        } else {
          return val;
        }
      };
      if (max) {
        if (final > max) {
          return round ? Math.round(checkMin(final % max)) : checkMin(final % max);
        } else {
          while (final < max) {
            final = final ** 5;
          }
          return round ? Math.round(checkMin(final % max)) : checkMin(final % max);
        }
      } else {
        return round ? Math.round(checkMin(final)) : checkMin(final);
      }
    }
    var dateNumber = () => {
      const date2 = /* @__PURE__ */ new Date();
      const secondsNumber = date2.getSeconds() * date2.getMilliseconds() + 5;
      const minuteNumber = date2.getMinutes() * date2.getHours() + 5;
      const hoursNumber = date2.getDate() * date2.getFullYear() * date2.getMonth() + 5;
      const fullDateNumber = secondsNumber * minuteNumber * hoursNumber / (secondsNumber + minuteNumber + hoursNumber);
      return fullDateNumber;
    };
    var superRandomiser = () => {
      const rand1 = Math.random() * 100 + Math.sqrt(Math.random() * 1e3);
      const rand2 = Math.random() * 100 * Math.sqrt(Math.random() * 1e3);
      const rand3 = (Math.random() * 100) ** 2;
      const congregate = rand1 * rand2 * rand3 / (rand1 + rand2 + rand3);
      return congregate * (Math.random() * 100);
    };
    function oddSwitch(a, b) {
      return a[0] * b[1] + b[0] * a[1];
    }
    module2.exports = generateKey;
  }
});

// modules/printer.js
var require_printer = __commonJS({
  "modules/printer.js"(exports2, module2) {
    "use strict";
    var fs2 = require("fs");
    function printer(string) {
      const content = string.join(" - ");
      fs2.writeFile("print.txt", content, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("File Created");
        }
      });
    }
    module2.exports = printer;
  }
});

// main/v1/encrypt/asciiCharacters.js
var require_asciiCharacters = __commonJS({
  "main/v1/encrypt/asciiCharacters.js"(exports2, module2) {
    "use strict";
    var print = require_printer();
    var asciiArray = [];
    var fullAsciiArray = [];
    var unWantedChars = [
      0,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      127,
      27,
      32,
      1,
      2,
      3,
      4,
      5,
      6,
      19,
      20,
      21,
      22,
      23,
      24,
      25,
      26,
      27,
      28,
      29,
      20,
      31,
      16,
      17,
      18,
      30
    ];
    for (let i = 0; i < 128; i++) {
      const conditions = [
        String.fromCharCode(i) !== " ",
        typeof String.fromCharCode(i) == "string",
        String.fromCharCode(i) !== "&",
        String.fromCharCode(i).startsWith("\\") == false,
        String.fromCharCode(i).startsWith("\0") == false,
        unWantedChars.includes(i) == false
      ];
      deter = 0;
      for (let j = 0; j < conditions.length; j++) {
        if (conditions[j]) {
          deter++;
        }
      }
      if (deter == conditions.length) {
        asciiArray.push(String.fromCharCode(i));
      }
      if (i > 31 && i != 127) {
        fullAsciiArray.push(String.fromCharCode(i));
      }
    }
    var deter;
    var sixBitArray = [
      "Q",
      "W",
      "E",
      "R",
      "T",
      "Y",
      "U",
      "I",
      "O",
      "P",
      "A",
      "S",
      "D",
      "F",
      "G",
      "H",
      "J",
      "K",
      "L",
      "Z",
      "X",
      "C",
      "V",
      "B",
      "N",
      "M",
      "q",
      "w",
      "e",
      "r",
      "t",
      "y",
      "u",
      "i",
      "o",
      "p",
      "a",
      "s",
      "d",
      "f",
      "g",
      "h",
      "j",
      "k",
      "l",
      "z",
      "x",
      "c",
      "v",
      "b",
      "n",
      "m",
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      ".",
      ","
    ];
    module2.exports = [sixBitArray, asciiArray, fullAsciiArray];
  }
});

// main/v1/encrypt/ceaser.js
var require_ceaser = __commonJS({
  "main/v1/encrypt/ceaser.js"(exports2, module2) {
    "use strict";
    var table = require_asciiCharacters();
    function encrypt2(string, key) {
      string = string.replaceAll(" ", "&").split("");
      const caeserKey = Math.round(key / 7 % table[1].length);
      for (let i = 0; string.length > i; i++) {
        const index = table[1].indexOf(string[i]);
        if (index > -1) {
          const cipherIndex = () => {
            let cid = index - caeserKey;
            if (cid < 0) {
              return table[1].length + cid;
            } else {
              return cid;
            }
          };
          string[i] = table[1][cipherIndex()];
        }
      }
      return string;
    }
    module2.exports = encrypt2;
  }
});

// main/v1/encrypt/factorFinder.js
var require_factorFinder = __commonJS({
  "main/v1/encrypt/factorFinder.js"(exports2, module2) {
    "use strict";
    function findFactors(num) {
      for (let i = Math.floor(Math.sqrt(num)); i > 0; i--) {
        if (num % i === 0) {
          return [i, num / i];
        }
      }
      return [1, num];
    }
    module2.exports = findFactors;
  }
});

// main/v1/encrypt/simpleCeaser.js
var require_simpleCeaser = __commonJS({
  "main/v1/encrypt/simpleCeaser.js"(exports2, module2) {
    "use strict";
    function groupCeaser(arr, shift, dict) {
      for (let i = 0; arr.length > i; i++) {
        const index = dict.indexOf(arr[i]);
        if (index > -1) {
          const cipherIndex = () => {
            let cid = index - shift;
            if (cid < 0) {
              return dict.length + cid;
            } else {
              return cid;
            }
          };
          arr[i] = dict[cipherIndex()];
        }
      }
      return arr;
    }
    function singleCeaser(str, shift, dict) {
      const index = dict.indexOf(str);
      if (index > -1) {
        const cipherIndex = () => {
          let cid = index - shift;
          if (cid < 0) {
            return dict.length + cid;
          } else {
            return cid;
          }
        };
        str = dict[cipherIndex()];
      }
      return str;
    }
    module2.exports = {
      single: singleCeaser,
      group: groupCeaser
    };
  }
});

// main/v1/encrypt/oddCeaser.js
var require_oddCeaser = __commonJS({
  "main/v1/encrypt/oddCeaser.js"(exports2, module2) {
    "use strict";
    var factorFinder = require_factorFinder();
    var ceaser = require_simpleCeaser();
    var table = require_asciiCharacters();
    function makeMatrix(string) {
      const length = string.length;
      const split = factorFinder(length);
      const rowNumber = split[0] == 1 ? Math.round(length / 2) : split[0];
      const results = to2DArray(string, 4);
      return results;
    }
    function to2DArray(array, size) {
      let result = [];
      for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
      }
      return result;
    }
    function oddCeaser(string, key) {
      const main2 = makeMatrix(string);
      key = key.toString().split("");
      for (let i = 0; i < main2.length; i++) {
        for (let j = 0; j < main2[i].length; j++) {
          main2[i][j] = ceaser.single(main2[i][j], key[j], table[1]);
        }
        main2[i] = main2[i].join("");
      }
      return main2.join("");
    }
    module2.exports = oddCeaser;
  }
});

// main/v1/encrypt/encrypt.js
var require_encrypt = __commonJS({
  "main/v1/encrypt/encrypt.js"(exports2, module2) {
    "use strict";
    var newKey = require_keyGenerator();
    var ceaserCipher = require_ceaser();
    var oddCeaser = require_oddCeaser();
    var nKey = newKey(999, 1e4, true);
    function encrypt2(text, key) {
      key = key ? key : nKey;
      let iniOut = ceaserCipher(text, key);
      const finalOut = oddCeaser(iniOut, key);
      return {
        out: finalOut,
        key
      };
    }
    module2.exports = encrypt2;
  }
});

// main/v1/decrypt/factorFinder.js
var require_factorFinder2 = __commonJS({
  "main/v1/decrypt/factorFinder.js"(exports2, module2) {
    "use strict";
    function findFactors(num) {
      for (let i = Math.floor(Math.sqrt(num)); i > 0; i--) {
        if (num % i === 0) {
          return [i, num / i];
        }
      }
      return [1, num];
    }
    module2.exports = findFactors;
  }
});

// main/v1/decrypt/revSimpleCeaser.js
var require_revSimpleCeaser = __commonJS({
  "main/v1/decrypt/revSimpleCeaser.js"(exports2, module2) {
    "use strict";
    function groupCeaser(arr, shift, dict) {
      for (let i = 0; arr.length > i; i++) {
        const index = dict.indexOf(arr[i]);
        if (index > -1) {
          const cipherIndex = () => {
            let cid = index + shift;
            if (cid > dict.length) {
              return dict.length - cid;
            } else {
              return cid;
            }
          };
          arr[i] = dict[cipherIndex()];
        }
      }
      return arr;
    }
    function singleCeaser(str, shift, dict) {
      const index = dict.indexOf(str);
      if (index > -1) {
        const cipherIndex = () => {
          let cid = index + parseInt(shift);
          if (cid > dict.length) {
            return cid - dict.length;
          } else {
            return cid;
          }
        };
        str = dict[cipherIndex()];
      }
      return str;
    }
    module2.exports = {
      single: singleCeaser,
      group: groupCeaser
    };
  }
});

// main/v1/decrypt/asciiCharacters.js
var require_asciiCharacters2 = __commonJS({
  "main/v1/decrypt/asciiCharacters.js"(exports2, module2) {
    "use strict";
    var asciiArray = [];
    var fullAsciiArray = [];
    var unWantedChars = [
      0,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      127,
      27,
      32,
      1,
      2,
      3,
      4,
      5,
      6,
      19,
      20,
      21,
      22,
      23,
      24,
      25,
      26,
      27,
      28,
      29,
      20,
      31,
      16,
      17,
      18,
      30
    ];
    for (let i = 0; i < 128; i++) {
      const conditions = [
        String.fromCharCode(i) !== " ",
        typeof String.fromCharCode(i) == "string",
        String.fromCharCode(i) !== "&",
        String.fromCharCode(i).startsWith("\\") == false,
        String.fromCharCode(i).startsWith("\0") == false,
        unWantedChars.includes(i) == false
      ];
      deter = 0;
      for (let j = 0; j < conditions.length; j++) {
        if (conditions[j]) {
          deter++;
        }
      }
      if (deter == conditions.length) {
        asciiArray.push(String.fromCharCode(i));
      }
      fullAsciiArray.push(String.fromCharCode(i));
    }
    var deter;
    var sixBitArray = [
      "Q",
      "W",
      "E",
      "R",
      "T",
      "Y",
      "U",
      "I",
      "O",
      "P",
      "A",
      "S",
      "D",
      "F",
      "G",
      "H",
      "J",
      "K",
      "L",
      "Z",
      "X",
      "C",
      "V",
      "B",
      "N",
      "M",
      "q",
      "w",
      "e",
      "r",
      "t",
      "y",
      "u",
      "i",
      "o",
      "p",
      "a",
      "s",
      "d",
      "f",
      "g",
      "h",
      "j",
      "k",
      "l",
      "z",
      "x",
      "c",
      "v",
      "b",
      "n",
      "m",
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      ".",
      ","
    ];
    module2.exports = [sixBitArray, asciiArray, fullAsciiArray];
  }
});

// main/v1/decrypt/revOddCeaser.js
var require_revOddCeaser = __commonJS({
  "main/v1/decrypt/revOddCeaser.js"(exports2, module2) {
    "use strict";
    var factorFinder = require_factorFinder2();
    var ceaser = require_revSimpleCeaser();
    var table = require_asciiCharacters2();
    function makeMatrix(string) {
      const length = string.length;
      const split = factorFinder(length);
      const rowNumber = split[0] == 1 ? Math.round(length / 2) : split[0];
      const results = to2DArray(string, 4);
      return results;
    }
    function to2DArray(array, size) {
      let result = [];
      for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
      }
      return result;
    }
    function oddCeaser(string, key) {
      const main2 = makeMatrix(string);
      key = key.toString().split("");
      for (let i = 0; i < main2.length; i++) {
        for (let j = 0; j < main2[i].length; j++) {
          main2[i][j] = ceaser.single(main2[i][j], key[j], table[1]);
        }
        main2[i] = main2[i].join("");
      }
      return main2.join("");
    }
    module2.exports = oddCeaser;
  }
});

// main/v1/decrypt/revCeaser.js
var require_revCeaser = __commonJS({
  "main/v1/decrypt/revCeaser.js"(exports2, module2) {
    "use strict";
    var table = require_asciiCharacters2();
    function decrypt2(string, key) {
      string = string.replaceAll("&", " ").split("");
      const caeserKey = Math.round(key / 7 % table[1].length);
      for (let i = 0; string.length > i; i++) {
        const index = table[1].indexOf(string[i]);
        if (index > -1) {
          const cipherIndex = () => {
            let cid = index + caeserKey;
            if (cid >= table[1].length) {
              return cid - table[1].length;
            } else {
              return cid;
            }
          };
          string[i] = table[1][cipherIndex()];
        }
      }
      return string;
    }
    module2.exports = decrypt2;
  }
});

// main/v1/decrypt/decrypt.js
var require_decrypt = __commonJS({
  "main/v1/decrypt/decrypt.js"(exports2, module2) {
    "use strict";
    var oddCeaser = require_revOddCeaser();
    var ceaser = require_revCeaser();
    function decrypt2(text, key) {
      const iniOut = oddCeaser(text.split(""), key);
      const finalOut = ceaser(iniOut, key);
      return {
        out: finalOut.join(""),
        key
      };
    }
    module2.exports = decrypt2;
  }
});

// main/v1.1/encrypt/ceasersPosition.js
var require_ceasersPosition = __commonJS({
  "main/v1.1/encrypt/ceasersPosition.js"(exports2, module2) {
    "use strict";
    var ceaser = require_simpleCeaser();
    var table = require_asciiCharacters();
    var arr = table[1];
    var ceasersPosition = (plainText) => {
      const text = [...plainText];
      for (let i = 0; i < text.length; i++) {
        text[i] = ceaser.single(text[i], i, arr);
      }
      return text.join("");
    };
    var cog = (plainText, seed) => {
      const text = [...plainText];
      for (let i = 0; i < text.length; i++) {
        const varSeed = i + seed;
        text[i] = ceaser.single(text[i], varSeed, arr);
      }
      return text.join("");
    };
    module2.exports = {
      ceasersPosition,
      cog
    };
  }
});

// main/v1.1/encrypt/encrypt.js
var require_encrypt2 = __commonJS({
  "main/v1.1/encrypt/encrypt.js"(exports2, module2) {
    "use strict";
    var v1 = require_encrypt();
    var reposition = require_ceasersPosition();
    var knead = (string, key) => {
      let text = string;
      strKey = `${key}`;
      text = reposition.ceasersPosition(text);
      text = reposition.cog(text, splitAdd(key));
      return text;
    };
    var splitAdd = (num) => {
      const key = [...`${num}`];
      let accSum = 5;
      key.map((keyNum) => {
        keyNum = Number(keyNum);
        accSum = accSum + keyNum;
      });
      return accSum;
    };
    function encrypt2(string, key) {
      const iniOut = v1(string, key);
      let text = iniOut.out;
      key = iniOut.key;
      text = reposition.ceasersPosition(text);
      const kneadNum = splitAdd(key) % 10;
      text = knead(text, key);
      return {
        out: text,
        key
      };
    }
    module2.exports = encrypt2;
  }
});

// main/v1.1/decrypt/ceasersPositionRev.js
var require_ceasersPositionRev = __commonJS({
  "main/v1.1/decrypt/ceasersPositionRev.js"(exports2, module2) {
    "use strict";
    var revCeaser = require_revSimpleCeaser();
    var table = require_asciiCharacters2();
    var arr = table[1];
    var ceasersPosition = (cipherText) => {
      const text = [...cipherText];
      for (let i = 0; i < text.length; i++) {
        text[i] = revCeaser.single(text[i], i, arr);
      }
      return text.join("");
    };
    var cog = (cipherText, seed) => {
      const text = [...cipherText];
      for (let i = 0; i < text.length; i++) {
        const varSeed = i + seed;
        text[i] = revCeaser.single(text[i], varSeed, arr);
      }
      return text.join("");
    };
    module2.exports = {
      ceasersPosition,
      cog
    };
  }
});

// main/v1.1/decrypt/decrypt.js
var require_decrypt2 = __commonJS({
  "main/v1.1/decrypt/decrypt.js"(exports2, module2) {
    "use strict";
    var v1 = require_decrypt();
    var reposition = require_ceasersPositionRev();
    var knead = (string, key) => {
      let text = string;
      strKey = `${key}`;
      text = reposition.cog(text, splitAdd(key));
      text = reposition.ceasersPosition(text);
      return text;
    };
    var splitAdd = (num) => {
      const key = [...`${num}`];
      let accSum = 5;
      key.map((keyNum) => {
        keyNum = Number(keyNum);
        accSum = accSum + keyNum;
      });
      return accSum;
    };
    function decrypt2(string, key) {
      let text = string;
      const kneadNum = splitAdd(key) % 10;
      text = knead(text, key);
      text = reposition.ceasersPosition(text);
      const iniOut = v1(text, key);
      text = iniOut.out;
      key = iniOut.key;
      return {
        out: text,
        key
      };
    }
    module2.exports = decrypt2;
  }
});

// node_modules/ansi-regex/index.js
var require_ansi_regex = __commonJS({
  "node_modules/ansi-regex/index.js"(exports2, module2) {
    "use strict";
    module2.exports = (options) => {
      options = Object.assign({
        onlyFirst: false
      }, options);
      const pattern = [
        "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
        "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))"
      ].join("|");
      return new RegExp(pattern, options.onlyFirst ? void 0 : "g");
    };
  }
});

// node_modules/strip-ansi/index.js
var require_strip_ansi = __commonJS({
  "node_modules/strip-ansi/index.js"(exports2, module2) {
    "use strict";
    var ansiRegex = require_ansi_regex();
    var stripAnsi = (string) => typeof string === "string" ? string.replace(ansiRegex(), "") : string;
    module2.exports = stripAnsi;
    module2.exports.default = stripAnsi;
  }
});

// node_modules/prompt-sync/index.js
var require_prompt_sync = __commonJS({
  "node_modules/prompt-sync/index.js"(exports2, module2) {
    "use strict";
    var fs2 = require("fs");
    var stripAnsi = require_strip_ansi();
    var term = 13;
    function create(config) {
      config = config || {};
      var sigint = config.sigint;
      var eot = config.eot;
      var autocomplete = config.autocomplete = config.autocomplete || function() {
        return [];
      };
      var history = config.history;
      prompt2.history = history || { save: function() {
      } };
      prompt2.hide = function(ask) {
        return prompt2(ask, { echo: "" });
      };
      return prompt2;
      function prompt2(ask, value, opts) {
        var insert = 0, savedinsert = 0, res, i, savedstr;
        opts = opts || {};
        if (Object(ask) === ask) {
          opts = ask;
          ask = opts.ask;
        } else if (Object(value) === value) {
          opts = value;
          value = opts.value;
        }
        ask = ask || "";
        var echo = opts.echo;
        var masked = "echo" in opts;
        autocomplete = opts.autocomplete || autocomplete;
        var fd = process.platform === "win32" ? process.stdin.fd : fs2.openSync("/dev/tty", "rs");
        var wasRaw = process.stdin.isRaw;
        if (!wasRaw) {
          process.stdin.setRawMode && process.stdin.setRawMode(true);
        }
        var buf = Buffer.alloc(3);
        var str = "", character, read;
        savedstr = "";
        if (ask) {
          process.stdout.write(ask);
        }
        var cycle = 0;
        var prevComplete;
        while (true) {
          read = fs2.readSync(fd, buf, 0, 3);
          if (read > 1) {
            switch (buf.toString()) {
              case "\x1B[A":
                if (masked) break;
                if (!history) break;
                if (history.atStart()) break;
                if (history.atEnd()) {
                  savedstr = str;
                  savedinsert = insert;
                }
                str = history.prev();
                insert = str.length;
                process.stdout.write("\x1B[2K\x1B[0G" + ask + str);
                break;
              case "\x1B[B":
                if (masked) break;
                if (!history) break;
                if (history.pastEnd()) break;
                if (history.atPenultimate()) {
                  str = savedstr;
                  insert = savedinsert;
                  history.next();
                } else {
                  str = history.next();
                  insert = str.length;
                }
                process.stdout.write("\x1B[2K\x1B[0G" + ask + str + "\x1B[" + (insert + ask.length + 1) + "G");
                break;
              case "\x1B[D":
                if (masked) break;
                var before = insert;
                insert = --insert < 0 ? 0 : insert;
                if (before - insert)
                  process.stdout.write("\x1B[1D");
                break;
              case "\x1B[C":
                if (masked) break;
                insert = ++insert > str.length ? str.length : insert;
                process.stdout.write("\x1B[" + (insert + ask.length + 1) + "G");
                break;
              default:
                if (buf.toString()) {
                  str = str + buf.toString();
                  str = str.replace(/\0/g, "");
                  insert = str.length;
                  promptPrint(masked, ask, echo, str, insert);
                  process.stdout.write("\x1B[" + (insert + ask.length + 1) + "G");
                  buf = Buffer.alloc(3);
                }
            }
            continue;
          }
          character = buf[read - 1];
          if (character == 3) {
            process.stdout.write("^C\n");
            fs2.closeSync(fd);
            if (sigint) process.exit(130);
            process.stdin.setRawMode && process.stdin.setRawMode(wasRaw);
            return null;
          }
          if (character == 4) {
            if (str.length == 0 && eot) {
              process.stdout.write("exit\n");
              process.exit(0);
            }
          }
          if (character == term) {
            fs2.closeSync(fd);
            if (!history) break;
            if (!masked && str.length) history.push(str);
            history.reset();
            break;
          }
          if (character == 9) {
            res = autocomplete(str);
            if (str == res[0]) {
              res = autocomplete("");
            } else {
              prevComplete = res.length;
            }
            if (res.length == 0) {
              process.stdout.write("	");
              continue;
            }
            var item = res[cycle++] || res[cycle = 0, cycle++];
            if (item) {
              process.stdout.write("\r\x1B[K" + ask + item);
              str = item;
              insert = item.length;
            }
          }
          if (character == 127 || process.platform == "win32" && character == 8) {
            if (!insert) continue;
            str = str.slice(0, insert - 1) + str.slice(insert);
            insert--;
            process.stdout.write("\x1B[2D");
          } else {
            if (character < 32 || character > 126)
              continue;
            str = str.slice(0, insert) + String.fromCharCode(character) + str.slice(insert);
            insert++;
          }
          ;
          promptPrint(masked, ask, echo, str, insert);
        }
        process.stdout.write("\n");
        process.stdin.setRawMode && process.stdin.setRawMode(wasRaw);
        return str || value || "";
      }
      ;
      function promptPrint(masked, ask, echo, str, insert) {
        if (masked) {
          process.stdout.write("\x1B[2K\x1B[0G" + ask + Array(str.length + 1).join(echo));
        } else {
          process.stdout.write("\x1B[s");
          if (insert == str.length) {
            process.stdout.write("\x1B[2K\x1B[0G" + ask + str);
          } else {
            if (ask) {
              process.stdout.write("\x1B[2K\x1B[0G" + ask + str);
            } else {
              process.stdout.write("\x1B[2K\x1B[0G" + str + "\x1B[" + (str.length - insert) + "D");
            }
          }
          var askLength = stripAnsi(ask).length;
          process.stdout.write(`\x1B[${askLength + 1 + (echo == "" ? 0 : insert)}G`);
        }
      }
    }
    module2.exports = create;
  }
});

// index.js
var fs = require("fs");
var path = require("path");
var date = require_date();
var enV1 = require_encrypt();
var deV1 = require_decrypt();
var enV2 = require_encrypt2();
var deV2 = require_decrypt2();
var prompt = require_prompt_sync()();
version = true;
var encrypt = (string, key, ver) => {
  if (ver) {
    return enV2(string, key);
  } else {
    return enV1(string, key);
  }
};
var decrypt = (string, key, ver) => {
  console.log(ver);
  if (ver) {
    return deV2(string, key);
  } else {
    return deV1(string, key);
  }
};
function OddCeaser(string, key, action) {
  if (!action) {
    return decrypt(string, key, version);
  } else {
    return encrypt(string, key, version);
  }
}
function fileHandler(dir, key, action) {
  fs.readFile(dir, "utf8", (err, file) => {
    if (err) {
      console.log(err);
    } else {
      const nDir = path.join(__dirname, `out-${date()}.txt`);
      const cip = OddCeaser(file, key, action);
      const out = `${cip.out}

Key: ${cip.key}`;
      fs.writeFile(nDir, out, (err2) => {
        if (err2) {
          console.log(err2);
        } else {
          console.log("File Created");
        }
      });
    }
  });
}
function intro() {
  console.log(`
========================================================================================================================

      ____  _____  _____     _____ ______           _____ ______ _____     _____ _____ _____  _    _ ______ _____  
     / __ \\|  __ \\|  __ \\   / ____|  ____|   /\\    / ____|  ____|  __ \\   / ____|_   _|  __ \\| |  | |  ____|  __ \\ 
    | |  | | |  | | |  | | | |    | |__     /  \\  | (___ | |__  | |__) | | |      | | | |__) | |__| | |__  | |__) |
    | |  | | |  | | |  | | | |    |  __|   / /\\ \\  \\___ \\|  __| |  _  /  | |      | | |  ___/|  __  |  __| |  _  / 
    | |__| | |__| | |__| | | |____| |____ / ____ \\ ____) | |____| | \\ \\  | |____ _| |_| |    | |  | | |____| | \\ \\ 
     \\____/|_____/|_____/   \\_____|______/_/    \\_\\_____/|______|_|  \\_\\  \\_____|_____|_|    |_|  |_|______|_|  \\_\\
                                                                                                               
        
========================================================================================================================
                                                                                                    -- version 1.1.0 --

`);
}
function restart() {
  const pr = prompt("\nDo you want to run the program again? (y or n): ");
  if (pr == "y" || pr == "yes" || pr == "true") {
    console.log(`

========================================================================================================================
`);
    query();
  } else if (pr == "k") {
    return;
  } else if (pr == "r") {
    main();
    return;
  } else {
    return;
  }
}
function query() {
  let ver = prompt("Do you want continue with version 1.1.0 (y or n): ");
  if (ver == "v1.0" || ver == "n" || ver == "false" || ver == "no" || ver == "1.0") {
    version = false;
    console.info("\n ---- Switching to Version 1.0.0 .... ----\n");
  } else {
    version = true;
    console.info("\n ---- Switching to Version 1.1.0 .... ----\n");
  }
  let q2 = prompt("Are you encrypting\\decrypting (en or de): ");
  if (q2 == "en" || q2 == "y" || q2 == "true" || q2 == "yes") {
    q2 = true;
  } else if (q2 == "de" || q2 == "n" || q2 == "false" || q2 == "no") {
    q2 = false;
  } else if (q2 == "k") {
    return;
  } else if (q2 == "r") {
    main();
    return;
  } else {
    console.error("Incorrect input, Try again\n\n");
    query();
    return;
  }
  let q1 = prompt("Are you working with a file (y or n): ");
  if (q1 == "y" || q1 == "yes" || q1 == "true") {
    const q3 = prompt("Input the file directory: ");
    if (q3 == "k") {
      return;
    } else if (q3 == "r") {
      main();
      return;
    }
    const q4 = prompt("Input a 4-digit integer key (optional): ");
    if (q4 == "k") {
      return;
    } else if (q4 == "r") {
      main();
      return;
    }
    fileHandler(q3, q4, q2);
    restart();
  } else if (q1 == "n" || q1 == "no" || q1 == "false") {
    const q3 = prompt("Input the text: ");
    if (q3 == "k") {
      return;
    } else if (q3 == "r") {
      main();
      return;
    }
    const q4 = prompt("Input a 4-digit integer key (optional): ");
    if (q4 == "k") {
      return;
    } else if (q4 == "r") {
      main();
      return;
    }
    const output = OddCeaser(q3, q4, q2);
    console.log(`
Output --> 
${output.out}
`);
    console.log(`Key: ${output.key}`);
    restart();
  } else if (q1 == "k") {
    return;
  } else if (q1 == "r") {
    main();
    return;
  } else {
    console.error("Incorrect input, Try again\n\n");
    query();
    return;
  }
}
function main() {
  intro();
  console.log("\n");
  query();
}
main();
