#!/usr/bin/env node
'use strict';

const enV2 = require('./main/encrypt/encrypt');
const deV2 = require('./main/decrypt/decrypt');
const prompt = require('prompt-sync')();

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
${c(CLR.bold + CLR.cyan, ' ██████╗ ██████╗ ██████╗      ██████╗███████╗ █████╗ ███████╗███████╗██████╗')}
${c(CLR.bold + CLR.cyan, '██╔═══██╗██╔══██╗██╔══██╗    ██╔════╝██╔════╝██╔══██╗██╔════╝██╔════╝██╔══██╗')}
${c(CLR.bold + CLR.cyan, '██║   ██║██║  ██║██║  ██║    ██║     █████╗  ███████║███████╗█████╗  ██████╔╝')}
${c(CLR.bold + CLR.cyan, '██║   ██║██║  ██║██║  ██║    ██║     ██╔══╝  ██╔══██║╚════██║██╔══╝  ██╔══██╗')}
${c(CLR.bold + CLR.cyan, '╚██████╔╝██████╔╝██████╔╝    ╚██████╗███████╗██║  ██║███████║███████╗██║  ██║')}
${c(CLR.bold + CLR.cyan, ' ╚═════╝ ╚═════╝ ╚═════╝      ╚═════╝╚══════╝╚═╝  ╚═╝╚══════╝╚══════╝╚═╝  ╚═╝')}
${c(CLR.dim, '                                        version 2.0 – full Unicode & block cipher')}
`;

// ---- Application core -----------------------------------------------------
function encrypt(text, key) { return enV2(text, key); }
function decrypt(text, key) { return deV2(text, key); }

function main() {
  console.clear();
  console.log(BANNER);
  section('W E L C O M E');

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
      console.log(c(CLR.green, '\nGoodbye!\n'));
      return;
    } else {
      console.log(c(CLR.red, 'Invalid choice. Please try again.\n'));
      askAction();
    }
  }

  function runCipher(mode) {
    const actionLabel = mode === 'encrypt' ? 'Encrypt' : 'Decrypt';
    section(`${actionLabel} Mode`);

    const text = prompt(c(CLR.bold, 'Enter text: '));
    if (!text) {
      console.log(c(CLR.red, 'No text entered.\n'));
      return askAction();
    }

    const keyInput = prompt(c(CLR.bold, 'Enter key (4‑digit number or up‑to‑6‑letter word, leave empty for default): '));
    let key = keyInput.trim() || undefined;  // undefined triggers fallback in the library

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

    // Copy-friendly line
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