const newKey = require('./keyGenerator');
const ceaserCipher = require("./ceaser")

const key = newKey(999, 10000, true);

// console.log(key)
console.log(ceaserCipher("All my fellas", key).join(""))