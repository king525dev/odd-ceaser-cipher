const newKey = require('./keyGenerator');
const ceaserCipher = require("./ceaser");
const oddCeaser = require("./oddCeaser");
const reposition = require('./ceasersPosition');

const nKey = newKey(999, 10000, true);

const splitAdd = (num) => {
    const digits = [...String(num)];
    let accSum = 5;
    digits.forEach(d => accSum += Number(d));
    return accSum;
};

function encrypt(text, key){

     if (key === undefined || key === null || (typeof key === 'string' && key.trim() === '')) {
        key = newKey(999, 10000, true);   // this must return a 4‑digit string
     }

    if (typeof key !== 'string' || !/^\d{4}$/.test(key)) {
        throw new Error('Key must be a string of exactly 4 digits');
        key = newKey(999, 10000, true);
    }

     //Initial Ceaser
     let iniOut = ceaserCipher(text, key);

     //Odd Ceaser
     let finalOut = oddCeaser(iniOut, key);

     // Extra layers
    finalOut = reposition.ceasersPosition(finalOut);
    finalOut = reposition.cog(finalOut, splitAdd(key));

     return {
          out: finalOut,
          key
     };
}

module.exports = encrypt;