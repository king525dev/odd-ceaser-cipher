const table = require("./asciiCharacters");

function decrypt(string, key){
     string = string.replaceAll("&", " ").split("");
     const caeserKey = Math.round((key/7)%(table[1].length))
     console.log(`Key -> ${caeserKey}`);

     for(let i = 0 ; string.length > i; i++){
          const index = table[1].indexOf(string[i]);
          console.log(`iniIndex -> ${index}`);

          if(index > -1){

               const cipherIndex = () => {
                    let cid = index + caeserKey;
                    console.log(`postIndex -> ${cid}`);
                    if (cid > table[1].length){
                         return cid - (table[1].length);
                    }else{
                         return cid;
                    }
               }

               console.log(cipherIndex())
               string[i] = table[1][cipherIndex()]
               console.log(`New Word -> ${string[i]}`)
          }
     }
     return string;
}

module.exports = decrypt;