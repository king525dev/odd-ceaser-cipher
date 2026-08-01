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