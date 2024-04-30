const encrypt = require('./main/encrypt/encrypt');
const decrypt = require('./main/decrypt/decrypt');

function OddCeaser(string, key, action){
     if(!action){
          return decrypt(string, key);
     }else{
          return encrypt(string, key);
     }
}

const ini = OddCeaser("All my fellas", "", true)
const final = OddCeaser(ini.out, ini.key, false)

console.log(ini.out)
console.log(final.out)