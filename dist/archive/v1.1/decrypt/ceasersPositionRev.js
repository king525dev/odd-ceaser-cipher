const revCeaser = require('../../v1/decrypt/revSimpleCeaser')
const table = require("../../v1/decrypt/asciiCharacters");
const arr = table[1];

const ceasersPosition = (cipherText) => {

     const text = [...cipherText];

     for( let i = 0; i < text.length; i++ ){
          text[i] = revCeaser.single(text[i], i, arr)
     }

     return text.join('')
}

const cog = (cipherText, seed) => {

     const text = [...cipherText];

     for( let i = 0; i < text.length; i++ ){
          const varSeed = i + seed
          text[i] = revCeaser.single(text[i], varSeed, arr)
     }

     return text.join("")
}

module.exports = {
     ceasersPosition,
     cog
}