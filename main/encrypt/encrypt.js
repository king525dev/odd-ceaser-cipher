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