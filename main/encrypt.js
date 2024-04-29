const newKey = require('./keyGenerator');
const ceaserCipher = require("./ceaser");
const oddCeaser = require("./oddCeaser");

const nKey = newKey(999, 10000, true);

function encrypt(text, key){

     //Generate Key
     key = (key)?key:nKey;

     //Initial Ceaser
     let firstOut = ceaserCipher(text, key);

     //Odd Ceaser
     const finalOut = oddCeaser(firstOut, key);

     return finalOut;
}

console.log(encrypt("All my fellas", "4853"));