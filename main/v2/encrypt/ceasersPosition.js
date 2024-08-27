const ceaser = require('../../v1/encrypt/simpleCeaser');
const revCeaser = require('../../v1/decrypt/revSimpleCeaser')
const table = require("../../v1/encrypt/asciiCharacters");
const arr = table[2];

const ceasersPosition = (plainText) => {

     const text = [...plainText];

     for( let i = 0; i < text.length; i++ ){
          text[i] = ceaser.single(text[i], i, arr)
     }

     console.log(text.join(""))
}

const ceasersPositionRev = (cipherText) => {

     const text = [...cipherText];

     for( let i = 0; i < text.length; i++ ){
          text[i] = revCeaser.single(text[i], i, arr)
     }

     console.log(text.join(''))
}

const cog = (plainText, seed) => {

     const text = [...plainText];

     for( let i = 0; i < text.length; i++ ){
          const varSeed = i + seed
          text[i] = ceaser.single(text[i], varSeed, arr)
     }

     console.log(text.join(""))
}

const revCog = (cipherText, seed) => {

     const text = [...cipherText];

     for( let i = 0; i < text.length; i++ ){
          const varSeed = i + seed
          text[i] = revCeaser.single(text[i], varSeed, arr)
     }

     console.log(text.join(""))
}

ceasersPosition("Hello World")
ceasersPositionRev("HdjikzQhjcZ")
cog("Hello World", 4)
revCog("D`fegvMdf_V", 4)