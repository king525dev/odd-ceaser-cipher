const newKey = require('./keyGenerator');
const ceaserCipher = require("./ceaser");
const oddCeaser = require("./oddCeaser");

const nKey = newKey(999, 10000, true);

function encrypt(text, key){

     if (key === undefined || key === null) {
          throw new Error('Key must be a string of exactly 4 digits');
          key = newKey(999, 10000, true);
     }

    if (typeof key !== 'string' || !/^\d{4}$/.test(key)) {
        throw new Error('Key must be a string of exactly 4 digits');
        key = newKey(999, 10000, true);
    }

     //Initial Ceaser
     let iniOut = ceaserCipher(text, key);

     //Odd Ceaser
     const finalOut = oddCeaser(iniOut, key);

     return {
          out: finalOut,
          key
     };
}

module.exports = encrypt;