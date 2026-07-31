const oddCeaser = require('./revOddCeaser');
const ceaser = require('./revCeaser')
const reposition = require('./ceasersPositionRev');

const splitAdd = (num) => {
    const digits = [...String(num)];
    let accSum = 5;
    digits.forEach(d => accSum += Number(d));
    return accSum;
};

function decrypt(text, key){
     if (key === undefined || key === null || (typeof key === 'string' && key.trim() === '')) {
          console.error("No key inputted, Defaulting....")
          key = '5555';
    }
    if (typeof key !== 'string' || !/^\d{4}$/.test(key)) {
          throw new Error('Key must be a string of exactly 4 digits');
          key = '5555';
    }

    let iniOut = text;

     // Reverse extra layers 
    const seed = splitAdd(key);
    iniOut = reposition.cog(text, seed);            
    iniOut = reposition.ceasersPosition(iniOut);      

     //Odd Ceaser
      iniOut = oddCeaser(iniOut, key);

     //Ceaser
     let finalOut = ceaser(iniOut, key)

     return {
          out: finalOut,
          key
     }
}

module.exports = decrypt;