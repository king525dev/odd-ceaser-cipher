#!/usr/bin/env node
'use strict';

// ------------------------------------------------------------
//  Import your cipher functions
// ------------------------------------------------------------
const enV2 = require('./main/v1.1/encrypt/encrypt');
const deV2 = require('./main/v1.1/decrypt/decrypt');

const encrypt = (string, key) => enV2(string, key);
const decrypt = (string, key) => deV2(string, key);

// ------------------------------------------------------------
//  Convenience: extract only the output string
// ------------------------------------------------------------
function encryptOut(input, key) {
    return encrypt(input, key).out;
}

function decryptOut(input, key) {
    return decrypt(input, key).out;
}

// ------------------------------------------------------------
//  ANSI styling
// ------------------------------------------------------------
const GREEN   = '\x1b[32m';
const RED     = '\x1b[31m';
const BOLD    = '\x1b[1m';
const DIM     = '\x1b[2m';
const RESET   = '\x1b[0m';
const YELLOW  = '\x1b[33m';
const CYAN    = '\x1b[36m';

let totalPassed = 0;
let totalFailed = 0;

// ------------------------------------------------------------
//  Truncate for display
// ------------------------------------------------------------
function truncate(str, maxLen = 60) {
    if (typeof str !== 'string') return String(str);
    if (str.length <= maxLen) return str;
    return str.slice(0, maxLen) + '…';
}

// ------------------------------------------------------------
//  Print mini explanation
// ------------------------------------------------------------
function printExplanation(purpose, input, expected, actual) {
    console.log(`    ${YELLOW}Purpose${RESET} : ${purpose}`);
    console.log(`    ${CYAN}Input${RESET}   : ${truncate(String(input), 80)}`);
    console.log(`    ${GREEN}Expected${RESET}: ${truncate(String(expected), 80)}`);
    console.log(`    ${RED}Actual${RESET}  : ${truncate(String(actual), 80)}`);
}

// ------------------------------------------------------------
//  Test runner
// ------------------------------------------------------------
function runSection(section) {
    console.log("\n")
    console.log(`\n${BOLD}${section.name}${RESET}`);
    let secPassed = 0;
    let secFailed = 0;

    for (const test of section.tests) {
        let result = {};
        console.log("\n")
        try {
            result = test.fn();
        } catch (e) {
            result = {
                passed: false,
                purpose: test.desc,
                input: '',
                expected: 'No error',
                actual: `Error: ${e.message}`
            };
        }

        const marker = result.passed ? `${GREEN}✓${RESET}` : `${RED}✗${RESET}`;
        console.log(`  ${marker} ${test.desc}`);
        printExplanation(
            result.purpose || test.desc,
            result.input,
            result.expected,
            result.actual
        );

        if (result.passed) secPassed++;
        else secFailed++;
    }

    const total = secPassed + secFailed;
    const allPass = secFailed === 0;
    const status = allPass ? `${GREEN}PASS${RESET}` : `${RED}FAIL${RESET}`;
    console.log(`  Section Result: ${status} (${secPassed}/${total} passed)`);

    totalPassed += secPassed;
    totalFailed += secFailed;
}

// ------------------------------------------------------------
//  4‑digit keys
// ------------------------------------------------------------
const K1  = '0001';
const K2  = '1234';
const K3  = '9999';
const K4  = '5555';
const K5  = '0808';
const K6  = '4242';
const K7  = '0110';
const K8  = '3141';
const K9  = '2718';
const K10 = '7777';

// ------------------------------------------------------------
//  Helper test functions – now all use encryptOut/decryptOut
// ------------------------------------------------------------

// Encryption changes string
function explainEncryptChanges(input, key) {
    const enc = encryptOut(input, key);
    const passed = enc !== input;
    return {
        passed,
        purpose: 'Encryption must alter the input string',
        input: `"${input}" with key="${key}"`,
        expected: 'different from input',
        actual: `"${truncate(enc)}" ${passed ? '(changed)' : '(unchanged)'}`
    };
}

// Encryption returns a string (the out property)
function explainEncryptReturnsString(input, key) {
    const encObj = encrypt(input, key);
    const enc = encObj.out;
    const passed = typeof enc === 'string';
    return {
        passed,
        purpose: 'Encryption must return an object with a string "out" property',
        input: `"${input}" with key="${key}"`,
        expected: 'string',
        actual: `typeof out = ${typeof enc}, value = "${truncate(enc)}"`
    };
}

// Roundtrip
function explainRoundtrip(input, key) {
    const encObj = encrypt(input, key);
    const decObj = decrypt(encObj.out, key);
    const enc = encObj.out;
    const dec = decObj.out;
    const passed = dec === input;
    // Also check that the returned key matches what we gave (optional)
    const keyMatch = (encObj.key === key && decObj.key === key);
    return {
        passed,
        purpose: 'Encrypt then decrypt must return original text (and returned key should match)',
        input: `"${truncate(input)}" (key="${key}")`,
        expected: `"${truncate(input)}" (returned key: "${key}")`,
        actual: `"${truncate(dec)}" ${passed ? '(match)' : '(MISMATCH)'}, ` +
                `enc key="${encObj.key}", dec key="${decObj.key}"${keyMatch ? '' : ' (key mismatch!)'}`
    };
}

// No-throw
function explainNoThrow(fn, purposeDetail) {
    try {
        fn();
        return {
            passed: true,
            purpose: purposeDetail,
            input: 'N/A',
            expected: 'No error',
            actual: 'No error thrown'
        };
    } catch (e) {
        return {
            passed: false,
            purpose: purposeDetail,
            input: 'N/A',
            expected: 'No error',
            actual: `Error thrown: ${e.message}`
        };
    }
}

// Expect error
function explainExpectsError(fn, purposeDetail) {
    try {
        fn();
        return {
            passed: false,
            purpose: purposeDetail,
            input: 'N/A',
            expected: 'Error should be thrown',
            actual: 'No error thrown (unexpected success)'
        };
    } catch (e) {
        return {
            passed: true,
            purpose: purposeDetail,
            input: 'N/A',
            expected: 'Error thrown',
            actual: `Error: ${e.message}`
        };
    }
}

// Case preservation
function explainCasePreservation() {
    const encObj = encrypt('AbC', K2);
    const decObj = decrypt(encObj.out, K2);
    const enc = encObj.out;
    const dec = decObj.out;
    const passed = dec === 'AbC';
    return {
        passed,
        purpose: 'Check that letter case is preserved after roundtrip',
        input: '"AbC" (key="1234")',
        expected: '"AbC"',
        actual: `"${dec}" ${passed ? '(match)' : '(MISMATCH)'}`
    };
}

// ------------------------------------------------------------
//  Test sections
// ------------------------------------------------------------
const sections = [
    {
        name: '1. Initial Encryption Verification',
        tests: [
            {
                desc: 'Encrypt "hello" with key "1234" produces a different string',
                fn: () => explainEncryptChanges('hello', K2)
            },
            {
                desc: 'Encrypt "hello" with key "0001" is not identical to input',
                fn: () => explainEncryptChanges('hello', K1)
            },
            {
                desc: 'Encrypt empty string with key "5555" returns a string',
                fn: () => explainEncryptReturnsString('', K4)
            },
            {
                desc: 'Encrypt with key "9999" produces a different string',
                fn: () => explainEncryptChanges('hello', K3)
            },
            {
                desc: 'Encrypt with key "0808" returns a string (even if unchanged)',
                fn: () => explainEncryptReturnsString('abc', K5)
            }
        ]
    },
    {
        name: '2. Operation Without Explicit Key',
        tests: [
            {
                desc: 'Encrypt "test" with missing key does not throw',
                fn: () => explainNoThrow(() => encryptOut('test'), 'Call encrypt without key argument')
            },
            {
                desc: 'Encrypt "test" with undefined key does not throw',
                fn: () => explainNoThrow(() => encryptOut('test', undefined), 'Call encrypt with undefined key')
            },
            {
                desc: 'Encrypt "test" with null key does not throw',
                fn: () => explainNoThrow(() => encryptOut('test', null), 'Call encrypt with null key')
            },
            {
                desc: 'Encrypt "test" with empty string key does not throw',
                fn: () => explainNoThrow(() => encryptOut('test', ''), 'Call encrypt with empty string key')
            },
            {
                desc: 'Decrypt "test" with missing key does not throw',
                fn: () => explainNoThrow(() => decryptOut('test'), 'Call decrypt without key argument')
            },
            {
                desc: 'Decrypt "test" with undefined key does not throw',
                fn: () => explainNoThrow(() => decryptOut('test', undefined), 'Call decrypt with undefined key')
            }
        ]
    },
    {
        name: '3. Roundtrip Accuracy: Core Algorithm (40 test cases)',
        tests: [
            { desc: 'Empty string (key="1234")',                  fn: () => explainRoundtrip('', K2) },
            { desc: '"a" (key="0001")',                            fn: () => explainRoundtrip('a', K1) },
            { desc: '"z" (key="0001")',                            fn: () => explainRoundtrip('z', K1) },
            { desc: '"A" (key="3141")',                            fn: () => explainRoundtrip('A', K8) },
            { desc: '"Z" (key="3141")',                            fn: () => explainRoundtrip('Z', K8) },
            { desc: '"Hello World" (key="2718")',                  fn: () => explainRoundtrip('Hello World', K9) },
            { desc: '"Caesar cipher" (key="0110")',                fn: () => explainRoundtrip('Caesar cipher', K7) },
            { desc: '"MixedCase123" (key="5555")',                 fn: () => explainRoundtrip('MixedCase123', K4) },
            { desc: '"Test with space !" (key="4242")',            fn: () => explainRoundtrip('Test with space !', K6) },
            { desc: '"Numbers 98765" (key="0808")',                fn: () => explainRoundtrip('Numbers 98765', K5) },
            { desc: '"Symbols @#$%^" (key="7777")',                fn: () => explainRoundtrip('Symbols @#$%^', K10) },
            { desc: 'Tab "\\there" (key="1234")',                  fn: () => explainRoundtrip('Tab\there', K2) },
            { desc: 'Newline "\\nhere" (key="1234")',              fn: () => explainRoundtrip('Newline\nhere', K2) },
            { desc: 'Unicode "ñ" (key="5555")',                    fn: () => explainRoundtrip('ñ', K4) },
            { desc: 'Emoji "😀😃" (key="0001")',                   fn: () => explainRoundtrip('😀😃', K1) },
            { desc: 'Japanese "日本語" (key="0110")',              fn: () => explainRoundtrip('日本語', K7) },
            { desc: 'Cyrillic "Кириллица" (key="4242")',           fn: () => explainRoundtrip('Кириллица', K6) },
            { desc: 'Greek "αβγ" (key="3141")',                    fn: () => explainRoundtrip('αβγ', K8) },
            { desc: 'Longer string (50+ chars) (key="2718")',      fn: () => explainRoundtrip('Lorem ipsum dolor sit amet, consectetur adipiscing elit.', K9) },
            { desc: '"0" with key "0000"',                         fn: () => explainRoundtrip('0', '0000') },
            { desc: '"abc" with key "0000"',                       fn: () => explainRoundtrip('abc', '0000') },
            { desc: '"xyz" with key "2626"',                       fn: () => explainRoundtrip('xyz', '2626') },
            { desc: '"ABC" with key "5252"',                       fn: () => explainRoundtrip('ABC', '5252') },
            { desc: '"a" with key "9999"',                         fn: () => explainRoundtrip('a', K3) },
            { desc: '"a" with key "1111"',                         fn: () => explainRoundtrip('a', '1111') },
            { desc: '"Hello" with key "1234"',                     fn: () => explainRoundtrip('Hello', K2) },
            { desc: '"Hello" with large but 4‑digit key "9999"',   fn: () => explainRoundtrip('Hello', K3) },
            { desc: 'Multiple spaces (key="4242")',                fn: () => explainRoundtrip('Spaces   multiple', K6) },
            { desc: 'Punctuation ",;:!?" (key="2718")',            fn: () => explainRoundtrip('Punctuation,;:!?', K9) },
            { desc: 'Backslash and slash (key="0808")',            fn: () => explainRoundtrip('Backslash \\ and slash /', K5) },
            { desc: 'Quotes \' and " (key="3141")',                fn: () => explainRoundtrip('Single \' and double " quotes', K8) },
            { desc: 'Accented chars "éàü" (key="5555")',           fn: () => explainRoundtrip('éàü', K4) },
            { desc: 'Digits "0123456789" (key="0110")',            fn: () => explainRoundtrip('0123456789', K7) },
            { desc: 'Special "<>&" (key="0001")',                  fn: () => explainRoundtrip('<>&', K1) },
            { desc: 'Multiline text (key="7777")',                 fn: () => explainRoundtrip('Multiple\nlines\nhere', K10) },
            { desc: 'Leading/trailing spaces (key="1234")',        fn: () => explainRoundtrip('  space  ', K2) },
            { desc: 'All common symbols (key="4242")',             fn: () => explainRoundtrip('!@#$%^&*()_+-=[]{}|;:\',.<>/?`~', K6) },
            { desc: 'The quick brown fox (key="2718")',            fn: () => explainRoundtrip('The quick brown fox jumps over the lazy dog', K9) },
            { desc: 'Case sensitive "CaseSensitive" (key="3141")', fn: () => explainRoundtrip('CaseSensitive', K8) },
            { desc: 'Scientific number "1234.567e-10" (key="0808")', fn: () => explainRoundtrip('1234.567e-10', K5) }
        ]
    },
    {
        name: '4. Roundtrip with Numeric Strings',
        tests: [
            { desc: '"12345" (key="1234")',            fn: () => explainRoundtrip('12345', K2) },
            { desc: '"00000" (key="0001")',            fn: () => explainRoundtrip('00000', K1) },
            { desc: '"-100" (key="5555")',             fn: () => explainRoundtrip('-100', K4) },
            { desc: '"3.14159" (key="3141")',          fn: () => explainRoundtrip('3.14159', K8) },
            { desc: '"0xFF" (key="4242")',             fn: () => explainRoundtrip('0xFF', K6) },
            { desc: '"1,000,000" (key="0110")',        fn: () => explainRoundtrip('1,000,000', K7) },
            { desc: '"1/2" (key="7777")',              fn: () => explainRoundtrip('1/2', K10) },
            { desc: '"1e10" (key="9999")',             fn: () => explainRoundtrip('1e10', K3) }
        ]
    },
    {
        name: '5. Roundtrip with Symbolic Strings',
        tests: [
            { desc: '"!@#$%^&*()" (key="1234")',                        fn: () => explainRoundtrip('!@#$%^&*()', K2) },
            { desc: '"~`{}|[]\\\\:;\\"\'<>,.?/" (key="4242")',         fn: () => explainRoundtrip('~`{}|[]\\:;"\'<>,.?/', K6) },
            { desc: '"©®™€£¥¢" (key="5555")',                           fn: () => explainRoundtrip('©®™€£¥¢', K4) },
            { desc: 'Arrow symbols "→↓↑←" (key="0001")',                fn: () => explainRoundtrip('→↓↑←', K1) },
            { desc: 'Math symbols "≤≥≠≈∞" (key="3141")',                fn: () => explainRoundtrip('≤≥≠≈∞', K8) },
            { desc: 'Stars "★☆☺☻" (key="0808")',                        fn: () => explainRoundtrip('★☆☺☻', K5) },
            { desc: '"§¶•ªº–—" (key="0110")',                           fn: () => explainRoundtrip('§¶•ªº–—', K7) },
            { desc: 'Quotation marks "«»‘’“”" (key="2718")',            fn: () => explainRoundtrip('«»‘’“”', K9) },
            { desc: 'Mixed café! @100% (key="7777")',                   fn: () => explainRoundtrip('café! @100%', K10) }
        ]
    },
    {
        name: '6. Roundtrip with Long Texts and Essays',
        tests: [
            {
                desc: 'Lorem ipsum (448 chars) key="1234"',
                fn: () => explainRoundtrip(
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' +
                    'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ' +
                    'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ' +
                    'ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit ' +
                    'in voluptate velit esse cillum dolore eu fugiat nulla pariatur.', K2)
            },
            {
                desc: 'Lorem ipsum (448 chars) key="9999"',
                fn: () => explainRoundtrip(
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' +
                    'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ' +
                    'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ' +
                    'ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit ' +
                    'in voluptate velit esse cillum dolore eu fugiat nulla pariatur.', K3)
            },
            {
                desc: '10 000 "a" characters (key="0808")',
                fn: () => explainRoundtrip('a'.repeat(10000), K5)
            }
        ]
    },
    {
        name: '7. Edge Cases and Robustness (invalid keys, special chars)',
        tests: [
            {
                desc: 'Key 3‑digit "123" – should fail gracefully',
                fn: () => explainExpectsError(() => encryptOut('test', '123'), 'Key must be exactly 4 digits')
            },
            {
                desc: 'Key 5‑digit "12345" – should fail gracefully',
                fn: () => explainExpectsError(() => encryptOut('test', '12345'), 'Key must be exactly 4 digits')
            },
            {
                desc: 'Key negative "-1234" – should fail gracefully',
                fn: () => explainExpectsError(() => encryptOut('test', '-1234'), 'Key must be non‑negative digits')
            },
            {
                desc: 'Key non‑numeric "abcd" – should fail gracefully',
                fn: () => explainExpectsError(() => encryptOut('test', 'abcd'), 'Key must contain only digits')
            },
            {
                desc: 'Key is boolean true – should fail gracefully',
                fn: () => explainExpectsError(() => encryptOut('test', true), 'Key must be a string')
            },
            {
                desc: 'Key is an object {} – should fail gracefully',
                fn: () => explainExpectsError(() => encryptOut('test', {}), 'Key must be a string')
            },
            {
                desc: 'Key is an array [] – should fail gracefully',
                fn: () => explainExpectsError(() => encryptOut('test', []), 'Key must be a string')
            },
            {
                desc: 'Key float‑like "2.50" – should fail gracefully',
                fn: () => explainExpectsError(() => encryptOut('test', '2.50'), 'Key must not contain a dot')
            },
            { desc: 'Null byte "a\\x00b" (key="1234")',            fn: () => explainRoundtrip('a\x00b', K2) },
            { desc: 'Control chars "\\x01\\x02\\x1F" (key="1234")', fn: () => explainRoundtrip('\x01\x02\x1F', K2) },
            { desc: 'DEL char "\\x7F" (key="5555")',               fn: () => explainRoundtrip('\x7F', K4) },
            { desc: 'Extended ASCII "Çüéâäàå" (key="4242")',       fn: () => explainRoundtrip('Çüéâäàå', K6) },
            { desc: 'ZWJ emoji sequence "👩‍🚀" (key="0001")',      fn: () => explainRoundtrip('👩‍🚀', K1) },
            {
                desc: 'Case preservation after roundtrip',
                fn: () => explainCasePreservation()
            },
            { desc: 'Mixed whitespace "a b\\tc\\nd" (key="3141")', fn: () => explainRoundtrip('a b\tc\nd', K8) }
        ]
    }
];

// ------------------------------------------------------------
//  Run everything
// ------------------------------------------------------------
console.log(`${BOLD}Cipher Test Suite${RESET}`);
console.log('─'.repeat(60));

for (const section of sections) {
    runSection(section);
}

console.log(`\n${BOLD}Overall Result: ${totalPassed} passed, ${totalFailed} failed${RESET}`);
process.exit(totalFailed > 0 ? 1 : 0);