const factorFinder = require('./factorFinder');
const ceaser = require('./simpleCeaser');
const table = require("./asciiCharacters");

function makeMatrix(string){
     const length = string.length;
     
     const split = factorFinder(length);
     const rowNumber = (split[0] == 1)? (Math.round(length/2)):(split[0]);

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
     key = key.toString();
     
     for (let i = 0; i < main.length; i++) {
          for (let j = 0; j < main[i].length; j++) {
               main[i][j] = ceaser.single(main[i][j], key[j], table[2])
          }
          main[i] = main[i].join("");
     }

     return main.join("");
}

module.exports = oddCeaser;