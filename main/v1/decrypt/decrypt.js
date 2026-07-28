const oddCeaser = require('./revOddCeaser');
const ceaser = require('./revCeaser')

function decrypt(text, key){

     if (key === undefined || key === null) {
          console.error("No key inputted, Defaulting....")
          key = '5555';
    }
    if (typeof key !== 'string' || !/^\d{4}$/.test(key)) {
          console.error("Invalid Key type, Defaulting....")
          key = '5555';
    }

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