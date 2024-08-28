const v1 = require('../../v1/encrypt/encrypt');
const reposition = require('./ceasersPosition');

const knead = (string, key) => {

     let iniOut = v1(string, key);
     let text = iniOut.out;
     key = `${iniOut.key}`;

     // Initial Position shift
     text = reposition.ceasersPosition(text)

     //Cog Shift
     key = [...key];
     for(i = 0; i < key.length; i++){
          text = reposition.cog(text, Number(key[i]))
     }

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
     
     // Knead Plain text
     for ( j = 0; j < kneadNum; j++){
          text = knead(text, key)
     }

     // Return Output
     return {
          out: text,
          key
     };
}

console.log(
     encrypt("enigmaenigma")
)