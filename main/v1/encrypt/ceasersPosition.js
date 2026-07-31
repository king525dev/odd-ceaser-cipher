const { singleEncrypt } = require('./unicodeShift');

function ceasersPosition(text) {
    const chars = [...text];
    for (let i = 0; i < chars.length; i++) {
        chars[i] = singleEncrypt(chars[i], i);   // shift backward by index
    }
    return chars.join('');
}

function cog(text, seed) {
    const chars = [...text];
    for (let i = 0; i < chars.length; i++) {
        chars[i] = singleEncrypt(chars[i], i + seed); // shift backward by i+seed
    }
    return chars.join('');
}

module.exports = { ceasersPosition, cog };