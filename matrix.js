const factorFinder = require('./factorFinder');

function to2DArray(array, size) {
     let result = [];
     for(let i = 0; i < array.length; i += size) {
          result.push(array.slice(i, i + size));
     }
     return result; 
}

function makeMatrix(string){
     const length = string.length;
     //string = string.split("")
     
     const split = factorFinder(length);
     const rowNumber = (split[0] == 1)? (Math.round(length/2)):(split[0]);

     const results = to2DArray(string, rowNumber);
     return results;
}

function oddSwitch(a, b){
     return (a[0]*b[1])+(b[0]*a[1]);
}

function splitKey(key){
     return [Number(key.toString().slice(0, 2)), Number(key.toString().slice(2))];
}

function matrixCipher(matrix, key){
     const resultant = [];

     const keyMatrix = splitKey(key);
     for(let i = 0; i > matrix.length; i++){
          for(let j = 0; j > matrix[i].length; j++){
               const coords = [i, j];
               const finalMatrix = oddSwitch(keyMatrix, coords);
               resultant.push(finalMatrix);
          }
     }

     return resultant;
}

const a = makeMatrix("helloWorld");
console.log(oddSwitch([1, 2], [3, 4]))
console.log(matrixCipher(a, 1845))