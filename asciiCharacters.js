const print = require('./printer');
const asciiArray = [];
const unWantedChars = [
     0, 7, 8, 9, 10, 11, 12, 13, 14, 15, 127, 27, 32, 1, 2, 3, 4, 5, 6, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 20, 31, 16, 17, 18, 30
]

for (let i = 0; i < 128; i++) {

     const conditions = [
          String.fromCharCode(i) !== " ", 
          typeof(String.fromCharCode(i)) == "string", 
          String.fromCharCode(i) !== "&",
          String.fromCharCode(i).startsWith("\\") == false,
          String.fromCharCode(i).startsWith("\x00") == false,
          unWantedChars.includes(i) == false
          ]

     var deter = 0;
     for(let j = 0; j < conditions.length; j++){
          if(conditions[j]){
               deter++
          }
     }

     if(deter == conditions.length){
          asciiArray.push(`[${String.fromCharCode(i)} -> ${i}]`);

     }
}

module.exports = asciiArray;