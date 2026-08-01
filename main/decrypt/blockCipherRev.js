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