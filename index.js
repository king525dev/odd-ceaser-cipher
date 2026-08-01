#!/usr/bin/env node
'use strict';

const enV2 = require('./main/encrypt/encrypt');
const deV2 = require('./main/decrypt/decrypt');
const prompt = require('prompt-sync')();
const fs = require('fs');
const path = require('path');

// ---- ANSI style helpers ---------------------------------------------------
const CLR = {
  reset:   '\x1b[0m',
  bold:    '\x1b[1m',
  dim:     '\x1b[2m',
  italic:  '\x1b[3m',
  underline:'\x1b[4m',
  // foreground
  red:     '\x1b[31m',
  green:   '\x1b[32m',
  yellow:  '\x1b[33m',
  blue:    '\x1b[34m',
  magenta: '\x1b[35m',
  cyan:    '\x1b[36m',
  white:   '\x1b[37m',
  // background
  bgRed:   '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgBlue:  '\x1b[44m',
  bgCyan:  '\x1b[46m',
};
const c = (code, text) => `${code}${text}${CLR.reset}`;

// ---- Decorators -----------------------------------------------------------
function box(text, color = CLR.cyan) {
  const lines = text.split('\n');
  const maxLen = Math.max(...lines.map(l => l.length));
  const top = '╔' + '═'.repeat(maxLen + 2) + '╗';
  const bottom = '╚' + '═'.repeat(maxLen + 2) + '╝';
  console.log(c(color, top));
  lines.forEach(l => {
    console.log(c(color, '║ ') + l + ' '.repeat(maxLen - l.length) + c(color, ' ║'));
  });
  console.log(c(color, bottom));
}

function section(title) {
  const line = '─'.repeat(60);
  console.log('\n' + c(CLR.bold + CLR.yellow, line));
  console.log(c(CLR.bold + CLR.yellow, `  ${title}`));
  console.log(c(CLR.bold + CLR.yellow, line) + '\n');
}

// ---- ASCII art banner -----------------------------------------------------
const BANNER = `
${c(CLR.bold + CLR.cyan, '   ██████╗ ██████╗ ██████╗      ██████╗███████╗ █████╗ ███████╗███████╗██████╗')}
${c(CLR.bold + CLR.cyan, '  ██╔═══██╗██╔══██╗██╔══██╗    ██╔════╝██╔════╝██╔══██╗██╔════╝██╔════╝██╔══██╗')}
${c(CLR.bold + CLR.cyan, '  ██║   ██║██║  ██║██║  ██║    ██║     █████╗  ███████║███████╗█████╗  ██████╔╝')}
${c(CLR.bold + CLR.cyan, '  ██║   ██║██║  ██║██║  ██║    ██║     ██╔══╝  ██╔══██║╚════██║██╔══╝  ██╔══██╗')}
${c(CLR.bold + CLR.cyan, '  ╚██████╔╝██████╔╝██████╔╝    ╚██████╗███████╗██║  ██║███████║███████╗██║  ██║')}
${c(CLR.bold + CLR.cyan, '   ╚═════╝ ╚═════╝ ╚═════╝      ╚═════╝╚══════╝╚═╝  ╚═╝╚══════╝╚══════╝╚═╝  ╚═╝')}
${c(CLR.bold + CLR.cyan, ' ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██')}
${c(CLR.bold + CLR.cyan, ' ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀')}
${c(CLR.dim, '                                                                   version 2.0           ')}
`;

// ---- Application core -----------------------------------------------------
function encrypt(text, key) { return enV2(text, key); }
function decrypt(text, key) { return deV2(text, key); }

// ---- File operations ------------------------------------------------------
function handleFileMode(mode) {
  const filePath = prompt(c(CLR.bold, 'Enter file path: ')).trim();
  if (!filePath) {
    console.log(c(CLR.red, 'No file path provided.\n'));
    return;
  }

  if (!fs.existsSync(filePath)) {
    console.log(c(CLR.red, `File not found: ${filePath}\n`));
    return;
  }

  const keyInput = prompt(c(CLR.bold, 'Enter key (4‑digit number or up‑to‑6‑letter word, leave empty for default): '));
  const key = keyInput.trim() || undefined;

  let result;
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    result = mode === 'encrypt' ? encrypt(fileContent, key) : decrypt(fileContent, key);
  } catch (err) {
    console.log(c(CLR.red, `Error: ${err.message}\n`));
    return;
  }

  // Determine output file name
  const ext = path.extname(filePath);
  const base = path.basename(filePath, ext);
  const dir = path.dirname(filePath);

  let outName;
  if (mode === 'encrypt') {
    outName = `${base}-encrypted${ext}`;
  } else {
    // Decrypt: remove '-encrypted' suffix if present, else just prepend 'decrypted-'
    if (base.endsWith('-encrypted')) {
      outName = base.slice(0, -10) + ext;
    } else {
      outName = `decrypted-${base}${ext}`;
    }
  }

  const outPath = path.join(dir, outName);

  try {
    fs.writeFileSync(outPath, result.out, 'utf8');
    box(
      `${c(CLR.bold, 'File saved:')}\n${c(CLR.green, outPath)}\n${c(CLR.dim, `Key used: ${result.key}`)}`,
      CLR.yellow
    );
  } catch (err) {
    console.log(c(CLR.red, `Failed to write file: ${err.message}\n`));
  }
}

// ---- Main flow ------------------------------------------------------------
function main() {
  console.clear();
  console.log(BANNER);
  section('Cipher by king525dev');

  function askAction() {
    console.log(c(CLR.bold, 'Choose operation:'));
    console.log(`  [${c(CLR.green, 'E')}] Encrypt`);
    console.log(`  [${c(CLR.red, 'D')}] Decrypt`);
    console.log(`  [${c(CLR.yellow, 'Q')}] Quit\n`);
    const choice = prompt('> ').trim().toLowerCase();
    if (choice === 'e' || choice === 'en' || choice === 'encrypt') {
      runCipher('encrypt');
    } else if (choice === 'd' || choice === 'de' || choice === 'decrypt') {
      runCipher('decrypt');
    } else if (choice === 'q' || choice === 'quit' || choice === 'exit') {
      console.log(c(CLR.green, '\nTerminating Program...\n'));
      return;
    } else {
      console.log(c(CLR.red, 'Invalid choice. Please try again.\n'));
      askAction();
    }
  }

  function runCipher(mode) {
    const actionLabel = mode === 'encrypt' ? 'Encrypt' : 'Decrypt';
    section(`${actionLabel} Mode`);

    // Choose input type
    console.log(c(CLR.bold, 'Input type:'));
    console.log(`  [${c(CLR.cyan, 'T')}] Text (paste directly)`);
    console.log(`  [${c(CLR.cyan, 'F')}] File (read from disk)\n`);
    const typeChoice = prompt('> ').trim().toLowerCase();
    if (typeChoice === 'f' || typeChoice === 'file') {
      handleFileMode(mode);
      askRestart();
      return;
    } else if (typeChoice !== 't' && typeChoice !== 'text') {
      console.log(c(CLR.red, 'Invalid choice. Defaulting to text.\n'));
    }

    // Text mode (existing flow)
    const text = prompt(c(CLR.bold, 'Enter text: '));
    if (!text) {
      console.log(c(CLR.red, 'No text entered.\n'));
      return askAction();
    }

    const keyInput = prompt(c(CLR.bold, 'Enter key (4‑digit number or up‑to‑6‑letter word, leave empty for default): '));
    let key = keyInput.trim() || undefined;

    let result;
    try {
      result = mode === 'encrypt' ? encrypt(text, key) : decrypt(text, key);
    } catch (err) {
      console.log(c(CLR.red, `Error: ${err.message}`));
      return askAction();
    }

    // Display result
    box(
      `${c(CLR.bold, 'Result:')}\n` +
      `${c(CLR.green, result.out)}\n\n` +
      `${c(CLR.dim, `Key used: ${result.key}`)}`,
      CLR.magenta
    );

    console.log(c(CLR.dim, '─'.repeat(60)));
    console.log(c(CLR.dim, `(copy) ${result.out}\n`));

    askRestart();
  }

  function askRestart() {
    const again = prompt(c(CLR.bold, 'Run again? (y/n): ')).trim().toLowerCase();
    if (again === 'y' || again === 'yes') {
      console.clear();
      main();
    } else {
      console.log(c(CLR.green, 'See you later!\n'));
    }
  }

  askAction();
}

// ---- Entry point ----------------------------------------------------------
main();