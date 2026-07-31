const { encryptString } = require('./unicodeShift');

function encrypt(string, key) {
    const numKey = Number(key);
    const shift = Math.round((numKey / 7) % 0x110000);   // 0x110000 = 1,114,112
    console.log(`Caesar shift: ${shift}`)
    return encryptString(string, shift);
}
module.exports = encrypt;