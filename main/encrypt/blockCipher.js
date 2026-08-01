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