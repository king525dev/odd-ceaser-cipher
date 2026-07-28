const newKey = require('./keyGenerator');
const ceaserCipher = require("./ceaser");
const oddCeaser = require("./oddCeaser");

function encrypt(text, key){

     //Generate Key
     key = (key)?key:nKey;

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