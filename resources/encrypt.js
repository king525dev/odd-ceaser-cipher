const newKey = require('./keyGenerator');
const ceaserCipher = require("./ceaser")

const ket = newKey(999, 10000, true);

console.log(ket)
console.log(ceaserCipher("All my fellas", ket).join(""))