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