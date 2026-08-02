
(function () {
  const modules = {};
  const cache = {};

  function require(id) {
    if (cache[id]) return cache[id];
    const factory = modules[id];
    if (!factory) throw new Error('Module not found: ' + id);
    const module = { exports: {} };
    factory(module, module.exports, require);
    cache[id] = module.exports;
    return cache[id];
  }

    modules['./main/encrypt/legacy/unicodeShift.js'] = function (module, exports, require) {
// Range of valid Unicode code points
const UNICODE_MAX = 0x10FFFF;

// Characters we don't shift (control chars, surrogates, non-characters)
function isShiftable(codePoint) {
    if (codePoint >= 0xD800 && codePoint <= 0xDFFF) return false;
    if (codePoint === 0xFFFE || codePoint === 0xFFFF) return false;
    return true;
}

// Single character shift (backward for encryption)
function singleEncrypt(char, shift) {
    const codePoint = char.codePointAt(0);          
    if (!isShiftable(codePoint)) return char;
    const newCodePoint = (codePoint - shift + 0x110000) % 0x110000;
    return String.fromCodePoint(newCodePoint);
}

// Whole string shift
function encryptString(str, shift) {
    const result = [];
    for (let i = 0; i < str.length; i++) {
        const codePoint = str.codePointAt(i);
        const char = String.fromCodePoint(codePoint);
        const shifted = singleEncrypt(char, shift);
        result.push(shifted);
        if (codePoint > 0xFFFF) i++; 
    }
    return result.join('');
}

module.exports = { singleEncrypt, encryptString };
  };

  modules['./main/decrypt/legacy/revUnicodeShift.js'] = function (module, exports, require) {
const UNICODE_MAX = 0x10FFFF;

function isShiftable(codePoint) {
    if (codePoint >= 0xD800 && codePoint <= 0xDFFF) return false;
    if (codePoint === 0xFFFE || codePoint === 0xFFFF) return false;
    return true;
}

function singleDecrypt(char, shift) {
    const codePoint = char.codePointAt(0);
    if (!isShiftable(codePoint)) return char;
    const newCodePoint = (codePoint + shift) % 0x110000;
    return String.fromCodePoint(newCodePoint);
}

function decryptString(str, shift) {
    const result = [];
    for (let i = 0; i < str.length; i++) {
        const codePoint = str.codePointAt(i);
        const char = String.fromCodePoint(codePoint);
        const shifted = singleDecrypt(char, shift);
        result.push(shifted);
        if (codePoint > 0xFFFF) i++;
    }
    return result.join('');
}

module.exports = { singleDecrypt, decryptString };
  };

  modules['./main/encrypt/legacy/ceaser.js'] = function (module, exports, require) {
const { encryptString } = require('./unicodeShift');

function encrypt(string, key) {
    const numKey = Number(key);
    const shift = Math.round((numKey / 7) % 0x110000);   // 0x110000 = 1,114,112
    return encryptString(string, shift);
}
module.exports = encrypt;
  };

  modules['./main/decrypt/legacy/revCeaser.js'] = function (module, exports, require) {
const { decryptString } = require('./revUnicodeShift');

function decrypt(string, key) {
    const numKey = Number(key);
    const shift = Math.round((numKey / 7) % 0x110000);
    return decryptString(string, shift);
}
module.exports = decrypt;
  };

  modules['./main/encrypt/legacy/oddCeaser.js'] = function (module, exports, require) {
const { singleEncrypt } = require('./unicodeShift');

function makeMatrix(string) {
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
    const chars = [...string]; // split into array of characters (including surrogate pairs properly)
    const main = to2DArray(chars, 4);
    key = key.toString().split("");
    
    for (let i = 0; i < main.length; i++) {
        for (let j = 0; j < main[i].length; j++) {
            main[i][j] = singleEncrypt(main[i][j], parseInt(key[j]));
        }
        main[i] = main[i].join("");
    }
    return main.join("");
}

module.exports = oddCeaser;
  };

  modules['./main/decrypt/legacy/revOddCeaser.js'] = function (module, exports, require) {
const { singleDecrypt } = require('./revUnicodeShift');

function makeMatrix(string) {
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
    const chars = [...string];  // preserve surrogate pairs
    const main = to2DArray(chars, 4);
    key = key.toString().split("");
    
    for (let i = 0; i < main.length; i++) {
        for (let j = 0; j < main[i].length; j++) {
            main[i][j] = singleDecrypt(main[i][j], parseInt(key[j]));
        }
        main[i] = main[i].join("");
    }
    return main.join("");
}

module.exports = oddCeaser;
  };

  modules['./main/encrypt/legacy/ceasersPosition.js'] = function (module, exports, require) {
const { singleEncrypt } = require('./unicodeShift');

function ceasersPosition(text) {
    const chars = [...text];
    for (let i = 0; i < chars.length; i++) {
        chars[i] = singleEncrypt(chars[i], i);   // shift backward by index
    }
    return chars.join('');
}

function cog(text, seed) {
    const chars = [...text];
    for (let i = 0; i < chars.length; i++) {
        chars[i] = singleEncrypt(chars[i], i + seed); // shift backward by i+seed
    }
    return chars.join('');
}

module.exports = { ceasersPosition, cog };
  };

  modules['./main/decrypt/legacy/ceasersPositionRev.js'] = function (module, exports, require) {
const { singleDecrypt } = require('./revUnicodeShift');

function ceasersPosition(text) {
    const chars = [...text];
    for (let i = 0; i < chars.length; i++) {
        chars[i] = singleDecrypt(chars[i], i);   // shift forward by index (undo)
    }
    return chars.join('');
}

function cog(text, seed) {
    const chars = [...text];
    for (let i = 0; i < chars.length; i++) {
        chars[i] = singleDecrypt(chars[i], i + seed); // shift forward by i+seed (undo)
    }
    return chars.join('');
}

module.exports = { ceasersPosition, cog };
  };

  modules['./main/encrypt/kdf.js'] = function (module, exports, require) {
// Simple deterministic scrambler – turns a string into a 32‑bit integer
function hashString(str) {
    let h = 0xdeadbeef;
    for (let i = 0; i < str.length; i++) {
        let c = str.charCodeAt(i);
        h = Math.imul(h ^ c, 0x5bd1e995);
        h = (h << 13) | (h >>> 19);  // rotate left 13
    }
    h ^= str.length * 0x9e3779b9;
    // final avalanche
    h = Math.imul(h, 0x85ebca6b);
    h ^= h >>> 13;
    h = Math.imul(h, 0xc2b2ae35);
    h ^= h >>> 16;
    return h >>> 0;  // unsigned 32‑bit
}

// Generate a 4‑digit numeric string from a 32‑bit number
function numberTo4Digit(num) {
    return String((num % 9000) + 1000); // ensures 1000–9999
}

// Derive all keys from the user's input string
function deriveKeys(userInput) {
    const seed = hashString(userInput);

    // 4‑digit legacy key
    const legacyKey = numberTo4Digit(seed);

    // Master key for the block cipher (another 32‑bit integer)
    const masterKey = hashString(userInput + "block") >>> 0;

    // Generate 8 round keys from the master key
    const roundKeys = [];
    let state = masterKey;
    for (let i = 0; i < 8; i++) {
        state = Math.imul(state, 0x5bd1e995);
        state = (state + 0x9e3779b9) >>> 0;
        roundKeys.push(state);
    }

    return { legacyKey, masterKey, roundKeys };
}

module.exports = { deriveKeys };
  };

  modules['./main/encrypt/blockCipher.js'] = function (module, exports, require) {
const MAX_CODE = 0x110000;  // 1,114,112

// The "blender" for one half‑block (2 code points)
function f(right0, right1, roundKey) {
    // use separate constants to avoid symmetry
    const newR0 = (right0 * ((roundKey & 0xFFFF) + 1) + 0x9e3779b9) % MAX_CODE;
    const newR1 = (right1 * (((roundKey >>> 16) & 0xFFFF) + 1) + 0x9e3779b9) % MAX_CODE;
    return [newR0, newR1];
}

// Feistel round on a 4‑character block (represented as array of 4 code points)
function feistelRound(block, roundKey) {
    // split
    let L0 = block[0], L1 = block[1];
    let R0 = block[2], R1 = block[3];

    // f(R)
    const [f0, f1] = f(R0, R1, roundKey);

    // mix with left (addition modulo MAX_CODE, easily reversible)
    const newL0 = (L0 + f0) % MAX_CODE;
    const newL1 = (L1 + f1) % MAX_CODE;

    // swap halves
    return [R0, R1, newL0, newL1];
}

// Encrypt a single block (8 rounds)
function encryptBlock(block, roundKeys) {
    let state = [...block];
    for (let r = 0; r < 8; r++) {
        state = feistelRound(state, roundKeys[r]);
    }
    return state;
}

// CBC mode encryption for an array of 4‑code‑point blocks
function encryptCBC(blocks, iv, roundKeys) {
    const encrypted = [];
    let prev = iv; // previous ciphertext block
    for (const block of blocks) {
        // XOR (actually add modulo) with previous ciphertext block
        const mixed = [
            (block[0] + prev[0]) % MAX_CODE,
            (block[1] + prev[1]) % MAX_CODE,
            (block[2] + prev[2]) % MAX_CODE,
            (block[3] + prev[3]) % MAX_CODE
        ];
        const outBlock = encryptBlock(mixed, roundKeys);
        encrypted.push(outBlock);
        prev = outBlock;
    }
    return encrypted;
}

// Turn a string into an array of code points, padding to multiple of 4
function stringToCodePoints(str) {
    const arr = [];
    for (const ch of str) {
        arr.push(ch.codePointAt(0));
    }
    // PKCS7‑like padding: append n chars, each with code point = n
    const padLen = 4 - (arr.length % 4);
    if (padLen === 4) {
        // full block of padding
        for (let i = 0; i < 4; i++) arr.push(4);
    } else {
        for (let i = 0; i < padLen; i++) arr.push(padLen);
    }
    // group into blocks of 4
    const blocks = [];
    for (let i = 0; i < arr.length; i += 4) {
        blocks.push(arr.slice(i, i + 4));
    }
    return blocks;
}

// Convert an array of 4‑code‑point blocks back to a string
function blocksToString(blocks) {
    const codePoints = [];
    for (const block of blocks) {
        for (const cp of block) {
            codePoints.push(cp);
        }
    }
    return String.fromCodePoint(...codePoints);
}

// Generate a random IV of 4 code points (shiftable, not surrogates)
function generateIV() {
    const iv = [];
    for (let i = 0; i < 4; i++) {
        // random code point in a safe range (32..0xD7FF, 0xE000..0x10FFFF)
        let cp;
        do {
            cp = 32 + Math.floor(Math.random() * (0x110000 - 32));
        } while ((cp >= 0xD800 && cp <= 0xDFFF) || cp === 0xFFFE || cp === 0xFFFF);
        iv.push(cp);
    }
    return iv;
}

// Main encryption entry
function encryptWithBlockCipher(plaintext, roundKeys) {
    const iv = generateIV();
    const blocks = stringToCodePoints(plaintext);
    const encryptedBlocks = encryptCBC(blocks, iv, roundKeys);
    // prepend IV to ciphertext
    const ivString = String.fromCodePoint(...iv);
    const cipherString = blocksToString(encryptedBlocks);
    return ivString + cipherString;
}

module.exports = { encryptWithBlockCipher };
  };

  modules['./main/decrypt/blockCipherRev.js'] = function (module, exports, require) {
const MAX_CODE = 0x110000;

function f(right0, right1, roundKey) {
    const newR0 = (right0 * ((roundKey & 0xFFFF) + 1) + 0x9e3779b9) % MAX_CODE;
    const newR1 = (right1 * (((roundKey >>> 16) & 0xFFFF) + 1) + 0x9e3779b9) % MAX_CODE;
    return [newR0, newR1];
}

function feistelRoundReverse(block, roundKey) {
    const R0 = block[0], R1 = block[1];
    const mixedL0 = block[2], mixedL1 = block[3];
    const [f0, f1] = f(R0, R1, roundKey);
    const L0 = (mixedL0 - f0 + MAX_CODE) % MAX_CODE;
    const L1 = (mixedL1 - f1 + MAX_CODE) % MAX_CODE;
    return [L0, L1, R0, R1];
}

function decryptBlock(block, roundKeys) {
    let state = [...block];
    for (let r = 7; r >= 0; r--) {
        state = feistelRoundReverse(state, roundKeys[r]);
    }
    return state;
}

function decryptCBC(blocks, iv, roundKeys) {
    const decrypted = [];
    let prev = iv;
    for (const block of blocks) {
        const decBlock = decryptBlock(block, roundKeys);
        const original = [
            (decBlock[0] - prev[0] + MAX_CODE) % MAX_CODE,
            (decBlock[1] - prev[1] + MAX_CODE) % MAX_CODE,
            (decBlock[2] - prev[2] + MAX_CODE) % MAX_CODE,
            (decBlock[3] - prev[3] + MAX_CODE) % MAX_CODE
        ];
        decrypted.push(original);
        prev = block;
    }
    return decrypted;
}

function blocksToPaddedString(blocks) {
    const all = [];
    for (const block of blocks) all.push(...block);
    const padLen = all[all.length - 1];
    if (padLen >= 1 && padLen <= 4) {
        let valid = true;
        for (let i = all.length - padLen; i < all.length; i++) {
            if (all[i] !== padLen) { valid = false; break; }
        }
        if (valid) all.length = all.length - padLen;
    }
    return String.fromCodePoint(...all);
}

function decryptWithBlockCipher(ciphertext, roundKeys) {
    // Convert whole string to array of code points – safe for any Unicode
    const codePoints = [...ciphertext].map(ch => ch.codePointAt(0));

    const iv = codePoints.slice(0, 4);
    const body = codePoints.slice(4);

    const blocks = [];
    for (let i = 0; i < body.length; i += 4) {
        blocks.push(body.slice(i, i + 4));
    }

    const decryptedBlocks = decryptCBC(blocks, iv, roundKeys);
    return blocksToPaddedString(decryptedBlocks);
}

module.exports = { decryptWithBlockCipher };
  };

  modules['./main/encrypt/encrypt.js'] = function (module, exports, require) {
const newKey = require('../keyGenerator');
const ceaserCipher = require("./legacy/ceaser");
const oddCeaser = require("./legacy/oddCeaser");
const reposition = require('./legacy/ceasersPosition');
const { deriveKeys } = require('./kdf');
const { encryptWithBlockCipher } = require('./blockCipher');

const splitAdd = (num) => {
    const digits = [...String(num)];
    let accSum = 5;
    digits.forEach(d => accSum += Number(d));
    return accSum;
};

function encrypt(text, key){

     if (key == undefined || key == null || (typeof key == 'string' && key.trim() === '')) {
        key = newKey(999, 10000, true);
        console.error(`No key input found, defaulting to [${key}]....`)
     } else {
        const is4Digit = typeof key === 'string' && /^\d{4}$/.test(key);
        const isWord   = typeof key === 'string' && /^[A-Za-z]{1,6}$/.test(key);

        if (!is4Digit && !isWord) {
            throw new Error('Key must be a 4‑digit number or a word up to 6 letters');
        }
     }

    const keys = deriveKeys(key);

    // --- Version-1 --- //
     //Initial Ceaser
     let iniOut = ceaserCipher(text, keys.legacyKey);

     //Odd Ceaser
     let v1Out = oddCeaser(iniOut, keys.legacyKey);

    // --- Version-1.1 --- //
    v1Out = reposition.ceasersPosition(v1Out);
    v1Out = reposition.cog(v1Out, splitAdd(keys.legacyKey));

    // --- Version-2 --- //
    const finalOut = encryptWithBlockCipher(v1Out, keys.roundKeys);


     return {
          out: v1Out,
          key: key
     };
}

module.exports = encrypt;
  };

  modules['./main/decrypt/decrypt.js'] = function (module, exports, require) {
const oddCeaser = require('./legacy/revOddCeaser');
const newKey = require('../keyGenerator');
const ceaser = require('./legacy/revCeaser');
const reposition = require('./legacy/ceasersPositionRev');
const { deriveKeys } = require('../encrypt/kdf');
const { decryptWithBlockCipher } = require('./blockCipherRev');

const splitAdd = (num) => {
    const digits = [...String(num)];
    let accSum = 5;
    digits.forEach(d => accSum += Number(d));
    return accSum;
};

function decrypt(text, key){
     if (key === undefined || key === null || (typeof key === 'string' && key.trim() === '')) {
        key = newKey(999, 10000, true);
        console.error(`No key input found, defaulting to [${key}]....`)
    } else {
        const is4Digit = typeof key === 'string' && /^\d{4}$/.test(key);
        const isWord   = typeof key === 'string' && /^[A-Za-z]{1,6}$/.test(key);

        if (!is4Digit && !isWord) {
            throw new Error('Key must be a 4‑digit number or a word up to 6 letters');
        }
    }

    const keys = deriveKeys(key);

    // --- Version-2 --- //
//     const afterBlock = decryptWithBlockCipher(text, keys.roundKeys);

    // --- Version-1.1 --- //
    const seed = splitAdd(keys.legacyKey);
    iniOut = reposition.cog(text, seed);            
    iniOut = reposition.ceasersPosition(iniOut);      

     //Odd Ceaser
      iniOut = oddCeaser(iniOut, keys.legacyKey);

     //Ceaser
     let finalOut = ceaser(iniOut, keys.legacyKey)

     return {
          out: finalOut,
          key
     }
}

module.exports = decrypt;
  };

  // --- Load the top‑level encrypt & decrypt and expose them ---
  const encrypt = require('./main/encrypt/encrypt');
  const decrypt = require('./main/decrypt/decrypt');

  window.OddCaesar = {
    encrypt: encrypt,
    decrypt: decrypt
  };
})();
