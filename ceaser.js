const table = require("./asciiCharacters");

function encrypt(string, key){
     string = string.replaceAll(" ", "&").split("");
     const caeserKey = Math.round((key/7)%(table.length))
     console.log(caeserKey)

     for(let i = 0 ; string.length > i; i++){
          const index = table.indexOf(string[i]);

          if(index > -1){

               const cipherIndex = () => {
                    let cid = index - caeserKey
                    if (cid < 0){
                         return (table.length) + cid;
                    }else{
                         return cid;
                    }
               }

               string[i] = table[cipherIndex()]
          }
     }
     return string;
}

module.exports = encrypt;