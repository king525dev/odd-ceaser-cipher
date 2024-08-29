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

     console.log(`ini: ${string}`)

     // Go through version-1
     const iniOut = v1(string, key);
     let text = iniOut.out;
     key = iniOut.key;

     console.log(`Stage-1: ${text}`)

     // Initial Position shift
     text = reposition.ceasersPosition(text)

     console.log(`Stage-2: ${text}`)

     // Determine Knead number
     const kneadNum = splitAdd(key) %10;
     
     //Knead Plain text
     //for ( j = 0; j < kneadNum; j++){
          text = knead(text, key)
     //}

     console.log(`Stage-3: ${text}`)

     // Return Output
     return {
          out: text,
          key
     };
}

console.log(
     encrypt("ooooooooooooooooooooooooooooooooo", 2006)
)