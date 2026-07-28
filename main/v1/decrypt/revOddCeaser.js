const ceaser = require('./revSimpleCeaser');
const table = require("../asciiCharacters");

function makeMatrix(string){
     const length = string.length;
     const results = to2DArray(string, 4);
     return results;
}

function to2DArray(array, size) {
     let result = [];
     for(let i = 0; i < array.length; i += size) {
          result.push(array.slice(i, i + size));
     }
     return result; 
}

function oddCeaser(string, key){
     const main = makeMatrix(string);
     key = key.toString().split("");
     
     for (let i = 0; i < main.length; i++) {
          for (let j = 0; j < main[i].length; j++) {
               main[i][j] = ceaser.single(main[i][j], key[j], table[1])
          }
          main[i] = main[i].join("");
     }

     return main.join("");
}

module.exports = oddCeaser;