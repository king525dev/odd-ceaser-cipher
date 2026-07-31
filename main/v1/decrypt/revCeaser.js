const { decryptString } = require('./revUnicodeShift');

function decrypt(string, key) {
    const numKey = Number(key);
    const shift = Math.round((numKey / 7) % 0x110000);
    console.log(`Caesar shift: ${shift}`)
    return decryptString(string, shift);
}
module.exports = decrypt;