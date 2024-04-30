const newKey = require('./keyGenerator');
const ceaserCipher = require("./ceaser");
const oddCeaser = require("./oddCeaser");

const nKey = newKey(999, 10000, true);

function encrypt(text, key){

     //Generate Key
     key = (key)?key:nKey;

     //Initial Ceaser
     let iniOut = ceaserCipher(text, key);
     console.log(iniOut)

     //Odd Ceaser
     const finalOut = oddCeaser(iniOut, key);

     return finalOut;
}

console.log(encrypt("All my fellas", 1234));

module.exports = encrypt;