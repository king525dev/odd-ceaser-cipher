const oddCeaser = require('./revOddCeaser');
const ceaser = require('./revCeaser')

function decrypt(text, key){

     //Odd Ceaser
     const iniOut = oddCeaser(text.split(""), key);

     //Ceaser
     const finalOut = ceaser(iniOut, key)

     return {
          out: finalOut.join(""),
          key
     }
}

module.exports = decrypt;