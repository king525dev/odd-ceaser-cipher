const print = require('./printer');
const asciiArray = [];
const unWantedChars = [
     0, 7, 8, 9, 10, 11, 12, 13, 14, 15, 127, 27, 32
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

     // console.log(String.fromCharCode(i) + " -----> " + i)
     // console.log(unWantedChars.includes(i))

     if(deter == conditions.length){
          asciiArray.push(String.fromCharCode(i));
          console.log(String.fromCharCode(i))
     }
}


console.log(asciiArray)
print(asciiArray);