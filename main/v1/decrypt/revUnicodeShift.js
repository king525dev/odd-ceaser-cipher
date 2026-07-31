const UNICODE_MAX = 0x10FFFF;

function isShiftable(codePoint) {
    if (codePoint >= 0xD800 && codePoint <= 0xDFFF) return false;
    if (codePoint === 0xFFFE || codePoint === 0xFFFF) return false;
    return true;
}

function singleDecrypt(char, shift) {
    const codePoint = char.codePointAt(0);
    if (!isShiftable(codePoint)) return char;
    const newCodePoint = (codePoint + shift) % 0x110000;
    return String.fromCodePoint(newCodePoint);
}

function decryptString(str, shift) {
    const result = [];
    for (let i = 0; i < str.length; i++) {
        const codePoint = str.codePointAt(i);
        const char = String.fromCodePoint(codePoint);
        const shifted = singleDecrypt(char, shift);
        result.push(shifted);
        if (codePoint > 0xFFFF) i++;
    }
    return result.join('');
}

module.exports = { singleDecrypt, decryptString };