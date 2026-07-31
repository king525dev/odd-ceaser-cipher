const { singleDecrypt } = require('./revUnicodeShift');

function ceasersPosition(text) {
    const chars = [...text];
    for (let i = 0; i < chars.length; i++) {
        chars[i] = singleDecrypt(chars[i], i);   // shift forward by index (undo)
    }
    return chars.join('');
}

function cog(text, seed) {
    const chars = [...text];
    for (let i = 0; i < chars.length; i++) {
        chars[i] = singleDecrypt(chars[i], i + seed); // shift forward by i+seed (undo)
    }
    return chars.join('');
}

module.exports = { ceasersPosition, cog };