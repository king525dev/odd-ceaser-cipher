const v1 = require('../../v1/encrypt/encrypt');
const reposition = require('./ceasersPosition');

const knead = (string, key) => {

     let text = string;
     strKey = `${key}`;

     // Initial Position shift
     text = reposition.ceasersPosition(text)

     //Cog Shift
     text = reposition.cog(text, splitAdd(key))


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

function encrypt(string, key){

     // Go through version-1
     const iniOut = v1(string, key);
     let text = iniOut.out;
     key = iniOut.key;

     // Initial Position shift
     text = reposition.ceasersPosition(text)

     // Determine Knead number
     const kneadNum = splitAdd(key) %10;
     
     //Knead Plain text
          text = knead(text, key)

     // Return Output
     return {
          out: text,
          key
     };
}

module.exports = encrypt