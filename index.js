const encrypt = require('./main/encrypt/encrypt');
const decrypt = require('./main/decrypt/decrypt');
const readline = require("readline");
const rl = readline.createInterface({
     input: process.stdin,
     output: process.stdout
});

//Initialize function
function OddCeaser(string, key, action){
     if(!action){
          return decrypt(string, key);
     }else{
          return encrypt(string, key);
     }
}