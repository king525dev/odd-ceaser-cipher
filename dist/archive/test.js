const encrypt = require('./main/encrypt/encrypt');
const decrypt = require('./main/decrypt/decrypt');

//Initialize functions
function OddCeaser(string, key, action){
     if(!action){
          return decrypt(string, key);
     }else{
          return encrypt(string, key);
     }
}

const ini = OddCeaser("Hello World", "", true)
const final = OddCeaser(ini.out, ini.key, false)

console.log("--> OUTPUT")
console.log("\t" + ini)
console.log("\t" +final)

console.log("--> RESULTS")
console.log("\t" + ini.out)
console.log("\t" +final.out)