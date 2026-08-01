// Range of valid Unicode code points
const UNICODE_MAX = 0x10FFFF;

// Characters we don't shift (control chars, surrogates, non-characters)
function isShiftable(codePoint) {
    if (codePoint >= 0xD800 && codePoint <= 0xDFFF) return false;
    if (codePoint === 0xFFFE || codePoint === 0xFFFF) return false;
    return true;
}

// Single character shift (backward for encryption)
function singleEncrypt(char, shift) {
    const codePoint = char.codePointAt(0);          
    if (!isShiftable(codePoint)) return char;
    const newCodePoint = (codePoint - shift + 0x110000) % 0x110000;
    return String.fromCodePoint(newCodePoint);
}

// Whole string shift
function encryptString(str, shift) {
    const result = [];
    for (let i = 0; i < str.length; i++) {
        const codePoint = str.codePointAt(i);
        const char = String.fromCodePoint(codePoint);
        const shifted = singleEncrypt(char, shift);
        result.push(shifted);
        if (codePoint > 0xFFFF) i++; 
    }
    return result.join('');
}

module.exports = { singleEncrypt, encryptString };