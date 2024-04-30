const oddCeaser = require('./revOddCeaser');
const ceaser = require('./revCeaser')

function decrypt(text, key){

     //Odd Ceaser
     const iniOut = oddCeaser(text.split(""), key);

     //Ceaser
     const finalOut = ceaser(iniOut, key)

     return finalOut;
}

console.log(decrypt(`Hrq"t!#jlrqez`, 1234))