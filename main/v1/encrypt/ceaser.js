const table = require("../asciiCharacters");

function encrypt(string, key){
    string = string.split("");   // no more space substitution
    const dict = table[1];
    const dictLen = dict.length;
    const caeserKey = Math.round((key / 7) % dictLen);

    for (let i = 0; i < string.length; i++) {
        const index = dict.indexOf(string[i]);
        if (index > -1) {
            // backward shift with positive modulo
            const newIndex = (index - caeserKey + dictLen) % dictLen;
            string[i] = dict[newIndex];
        }
    }
    return string;
}

module.exports = encrypt;