const newKey = require('./keyGenerator');
const ceaserCipher = require("./ceaser");
const binaryConverter = require('./binaryConverter');
const logicOperator = require('./logicOperator');

const nKey = newKey(999, 10000, true);

function encrypt(text, key){

     //Generate Key
     key = (key)?key:nKey;

     //Initial Ceaser
     let out = ceaserCipher(text, key);

     //Convert Key to sixBitBinary
     let binKey = binaryConverter((key%64), true);

     //Convert each position in the text to a binary
     const initialBinaryPositions = []
     for ( i = 0; i < out.length; i++){
          const binVal = binaryConverter(i, true);
          initialBinaryPositions.push(binVal);
     }
     // console.log(`iniBin: ${initialBinaryPositions}\n`)

     //Put each value through the operation `(A XOR B) XOR (NOT B)`
     const finalBinaryPositions = []
     initialBinaryPositions.forEach((nib) => {
          const firstOperation = logicOperator.logicOperator(nib, binKey, logicOperator.XOR);
          const secondOperation = logicOperator.logicOperator(binKey, nib, logicOperator.NOT);
          const finalOperation = logicOperator.logicOperator(firstOperation, secondOperation, logicOperator.XOR);
          finalBinaryPositions.push(finalOperation);
     });
     // console.log(`finalBin: ${finalBinaryPositions}\n`)

     //Convert each value back to denary
     const finalPositions = []
     finalBinaryPositions.forEach((nib) => {
          const num = binaryConverter(nib, false);
          finalPositions.push(num)
     });
     // console.log(`finalPos: ${finalPositions}\n`)

     //Transpose each element to the new positions
     for ( i = 0; i < out.length; i++){
          out[i] = out[finalPositions[i]]
     }

     //Return output
     return out.join("");
}

console.log(encrypt("All my fellas", "4853"));