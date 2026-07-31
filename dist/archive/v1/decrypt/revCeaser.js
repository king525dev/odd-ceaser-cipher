const table = require("./asciiCharacters");

function decrypt(string, key){
     string = string.replaceAll("&", " ").split("");
     const caeserKey = Math.round((key/7)%(table[1].length))

     for(let i = 0 ; string.length > i; i++){
          const index = table[1].indexOf(string[i]);

          if(index > -1){

               const cipherIndex = () => {
                    let cid = index + caeserKey;
                    if (cid >= table[1].length){
                         return cid - (table[1].length);
                    }else{
                         return cid;
                    }
               }

               string[i] = table[1][cipherIndex()];
          }
     }
     return string;
}

module.exports = decrypt;