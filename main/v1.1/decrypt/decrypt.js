const v1 = require('../../v1/decrypt/decrypt');
const reposition = require('./ceasersPositionRev');

const knead = (string, key) => {

     let text = string;
     strKey = `${key}`;

     //Cog Shift
     text = reposition.cog(text, splitAdd(key))

     // Initial Position unshift
     text = reposition.ceasersPosition(text)

     return text;
}

const splitAdd = (num) => {
     const key = [...`${num}`];
     let accSum = 5;

     key.map((keyNum) => {
          keyNum = Number(keyNum);
          accSum = accSum + keyNum
     });

     return accSum;
}

function decrypt(string, key){
     
     let text = string;

     // Determine Knead number
     const kneadNum = splitAdd(key) %10;

     //Knead Cipher text
     text = knead(text, key)

     // Initial Position unshift
     text = reposition.ceasersPosition(text);

     // Go through version-1
     const iniOut = v1(text, key);
     text = iniOut.out;
     key = iniOut.key;

     // Return Output
     return {
          out: text,
          key
     };
}

module.exports = decrypt;