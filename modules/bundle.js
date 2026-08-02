#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// --- All files needed, in dependency order (most fundamental first) ---
const files = [
  // Unicode shift helpers (no dependencies)
  'main/encrypt/legacy/unicodeShift.js',
  'main/decrypt/legacy/revUnicodeShift.js',
  'main/keyGenerator.js',

  // Caesar layer
  'main/encrypt/legacy/ceaser.js',
  'main/decrypt/legacy/revCeaser.js',

  // Odd Caesar layer
  'main/encrypt/legacy/oddCeaser.js',
  'main/decrypt/legacy/revOddCeaser.js',

  // Positional & cog shift (v1.1 extras)
  'main/encrypt/legacy/ceasersPosition.js',
  'main/decrypt/legacy/ceasersPositionRev.js',

  // KDF + block cipher
  'main/encrypt/kdf.js',
  'main/encrypt/blockCipher.js',
  'main/decrypt/blockCipherRev.js',

  // Final v2.0 entry points
  'main/encrypt/encrypt.js',
  'main/decrypt/decrypt.js',
].map(f => path.join(__dirname, f));

// --- Read each file and extract its module ID (relative path) ---
const modules = {};
for (const file of files) {
  const relative = path.relative(__dirname, file).replace(/\\/g, '/');
  const code = fs.readFileSync(file, 'utf8');
  modules['./' + relative] = code;
  modules['./' + relative + '.js'] = code;
}

// --- Build the IIFE that emulates require ---
const output = `
(function () {
  const modules = {};
  const cache = {};

  function require(id) {
    if (cache[id]) return cache[id];
    const factory = modules[id] || modules[id + '.js'];
    if (!factory) throw new Error('Module not found: ' + id);
    const module = { exports: {} };
    factory(module, module.exports, require);
    cache[id] = module.exports;
    return cache[id];
  }

  ${Object.entries(modules).map(([id, code]) => {
    // Wrap each file's code as a factory function
    // The code may contain 'require', 'module.exports' – we keep them!
    return `  modules['${id}'] = function (module, exports, require) {\n${code}\n  };`;
  }).join('\n\n')}

  // --- Load the top‑level encrypt & decrypt and expose them ---
  const encrypt = require('./main/encrypt/encrypt');
  const decrypt = require('./main/decrypt/decrypt');

  window.OddCaesar = {
    encrypt: encrypt,
    decrypt: decrypt
  };
})();
`;

fs.writeFileSync(path.join(__dirname, 'dist', 'odd-ceasar-web.js'), output);
console.log('Bundle written to dist/odd-caesar.js');