const table = require("../asciiCharacters");

function encrypt(string, key){
    string = string.split(""); 
    const dict = table[1];
    const dictLen = dict.length;
    const caeserKey = Math.round((key / 7) % dictLen);

    for (let i = 0; i < string.length; i++) {
        const index = dict.indexOf(string[i]);
        if (index > -1) {
            const newIndex = (index - caeserKey + dictLen) % dictLen;
            string[i] = dict[newIndex];
        }
    }
    return string;
}

module.exports = encrypt;