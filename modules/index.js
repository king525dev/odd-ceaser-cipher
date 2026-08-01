const en = require('../main/encrypt/encrypt');
const de = require('../main/decrypt/decrypt');


const encrypt = (string, key) => {
     return en(string, key);
}

const decrypt = (string, key) => {
     return de(string, key);
}


//Initialize functions
function OddCeaser(string, key){
     if(!action){
          return decrypt(string, key);
     }else{
          return encrypt(string, key);
     }
}

const input = encrypt("hello world, I am ODD CEASER!!! ", "2026")
const output = decrypt(input.out, input.key)

console.log(input)
console.log(output)