const table = require("./asciiCharacters");

function encrypt(string, key){
     string = string.replaceAll(" ", "&").split("");
     const caeserKey = Math.round((key/7)%(table[0].length))
     console.log(caeserKey)

     for(let i = 0 ; string.length > i; i++){
          const index = table[0].indexOf(string[i]);

          if(index > -1){

               const cipherIndex = () => {
                    let cid = index - caeserKey
                    if (cid < 0){
                         return (table[0].length) + cid;
                    }else{
                         return cid;
                    }
               }

               string[i] = table[0][cipherIndex()]
          }
     }
     return string;
}

module.exports = encrypt;