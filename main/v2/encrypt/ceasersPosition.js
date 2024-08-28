const ceaser = require('../../v1/encrypt/simpleCeaser');
const table = require("../../v1/encrypt/asciiCharacters");
const arr = table[2];

const ceasersPosition = (plainText) => {

     const text = [...plainText];

     for( let i = 0; i < text.length; i++ ){
          text[i] = ceaser.single(text[i], i, arr)
     }

     return text.join("")
}

const cog = (plainText, seed) => {

     const text = [...plainText];

     for( let i = 0; i < text.length; i++ ){
          const varSeed = i + seed
          text[i] = ceaser.single(text[i], varSeed, arr)
     }

     return text.join("")
}

module.exports = {
     ceasersPosition,
     cog
}