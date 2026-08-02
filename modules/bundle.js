#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = __dirname;

// -----------------------------------------------------------------
// 1. Recursively collect ALL .js files under the 'main' directory
// -----------------------------------------------------------------
function collectJSFiles(dir, base) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectJSFiles(full, base));
    } else if (entry.name.endsWith('.js')) {
      // Store the path relative to project root, without .js extension
      const rel = path.relative(base, full).replace(/\\/g, '/');
      // Remove the '.js' extension – our internal IDs will be extension‑less
      const id = rel.replace(/\.js$/, '');
      results.push({ id: './' + id, file: full });
    }
  }
  return results;
}

// All modules we'll include – ordered by dependency later, but we can just
// register them all. The order in the final script doesn't matter because
// the factory functions are only executed when required.
const moduleEntries = collectJSFiles(path.join(PROJECT_ROOT, 'main'), PROJECT_ROOT);

// -----------------------------------------------------------------
// 2. Build a map: absolute file path → module ID
// -----------------------------------------------------------------
const fileToModuleId = new Map();
for (const entry of moduleEntries) {
  fileToModuleId.set(entry.file, entry.id);
}

// -----------------------------------------------------------------
// 3. Read each file, rewrite relative require() calls to absolute IDs
// -----------------------------------------------------------------
function resolveRequire(moduleFile, code) {
  // This regex matches require('...') or require("...") – captures the path inside quotes.
  // It ignores require with a variable (i.e., require(id)) – your code only uses string literals.
  return code.replace(
    /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
    (match, requiredPath) => {
      // Only rewrite relative paths (starting with . or ..)
      if (!requiredPath.startsWith('.')) return match;

      // Determine the directory of the calling file
      const callerDir = path.dirname(moduleFile);
      // Resolve to an absolute path
      const resolvedAbs = path.resolve(callerDir, requiredPath);
      // Look up the module ID (without .js extension) that we stored
      // Try with .js appended in case the user wrote require('./x') where x.js exists
      let moduleId = fileToModuleId.get(resolvedAbs);
      if (!moduleId) {
        // Maybe the file exists with .js extension – try adding it
        moduleId = fileToModuleId.get(resolvedAbs + '.js');
      }
      if (!moduleId) {
        throw new Error(
          `Could not resolve '${requiredPath}' from '${moduleFile}' to a known module ID`
        );
      }
      // Return the rewritten require with the exact module ID
      return `require('${moduleId}')`;
    }
  );
}

const modules = {};
for (const entry of moduleEntries) {
  let code = fs.readFileSync(entry.file, 'utf8');
  // Rewrite relative requires
  code = resolveRequire(entry.file, code);
  modules[entry.id] = code;
}

// -----------------------------------------------------------------
// 4. Generate the browser bundle
// -----------------------------------------------------------------
const output = `
(function () {
  const modules = { ${Object.keys(modules).map(id => `'${id}': null`).join(',')} };
  const cache = {};

  function require(id) {
    if (cache[id]) return cache[id];
    // id is now already an absolute module ID (e.g. './main/encrypt/legacy/ceaser')
    const factory = modules[id];
    if (!factory) {
      // Still try with .js just in case (shouldn't happen now)
      throw new Error('Module not found: ' + id);
    }
    const module = { exports: {} };
    factory(module, module.exports, require);
    cache[id] = module.exports;
    return cache[id];
  }

  ${Object.entries(modules).map(([id, code]) => {
    // Wrap each file's code as a factory function
    return `
  modules['${id}'] = function (module, exports, require) {
${code}
  };`;
  }).join('\n')}

  // --- Load the top‑level encrypt & decrypt and expose them ---
  const encrypt = require('./main/encrypt/encrypt');
  const decrypt = require('./main/decrypt/decrypt');

  window.OddCaesar = {
    encrypt: encrypt,
    decrypt: decrypt
  };
})();
`;

const outDir = path.join(PROJECT_ROOT, 'dist');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'odd-caesar-web.js'), output);
console.log('Bundle written to dist/odd-caesar-web.js');