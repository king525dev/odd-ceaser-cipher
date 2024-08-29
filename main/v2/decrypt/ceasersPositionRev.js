const revCeaser = require('../../v1/decrypt/revSimpleCeaser')
const table = require("../../v1/decrypt/asciiCharacters");
const arr = table[1];

const ceasersPosition = (cipherText) => {

     const text = [...cipherText];

     for( let i = 0; i < text.length; i++ ){
          //console.log(`Before: ${i} --> ${text[i]}`)
          text[i] = revCeaser.single(text[i], i, arr)
          //console.log(`After: ${i} --> ${text[i]}`)
     }

     return text.join('')
}

const cog = (cipherText, seed) => {

     //console.log("Dict: " + arr)

     const text = [...cipherText];
     // console.log("Received-text:\t\t" + text)
     // console.log("Received-seed:\t\t" + seed)

     for( let i = 0; i < text.length; i++ ){
          const varSeed = i + seed
          text[i] = revCeaser.single(text[i], varSeed, arr)
     }

     //console.log("Output-text\t\t" + text.join(" |-| "))

     return text.join("")
}

//console.log(ceasersPosition("F`RCeO8bT5WQ:TF"))

module.exports = {
     ceasersPosition,
     cog
}