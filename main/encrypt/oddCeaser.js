const { singleEncrypt } = require('./unicodeShift');

function makeMatrix(string) {
    const results = to2DArray(string, 4);
    return results;
}

function to2DArray(array, size) {
    let result = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
}

function oddCeaser(string, key) {
    const chars = [...string]; // split into array of characters (including surrogate pairs properly)
    const main = to2DArray(chars, 4);
    key = key.toString().split("");
    
    for (let i = 0; i < main.length; i++) {
        for (let j = 0; j < main[i].length; j++) {
            main[i][j] = singleEncrypt(main[i][j], parseInt(key[j]));
        }
        main[i] = main[i].join("");
    }
    return main.join("");
}

module.exports = oddCeaser;