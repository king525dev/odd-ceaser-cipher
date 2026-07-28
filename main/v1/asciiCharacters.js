const asciiArray = [];
for (let i = 32; i <= 126; i++) {
    asciiArray.push(String.fromCharCode(i));
}
const fullAsciiArray = [...asciiArray]; // 32-126

module.exports = [/* sixBit not used */, asciiArray, fullAsciiArray];