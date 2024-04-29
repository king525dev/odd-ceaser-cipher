function binaryConverter(num, bin){
     if(bin){
          let binaryEquivalent = Number(num).toString(2);
          return binaryEquivalent;
     }else{
          const decimalEquivalent = parseInt(num, 2);
          return decimalEquivalent;
     }
}

// console.log(binaryConverter(1111, false))

module.exports = binaryConverter;