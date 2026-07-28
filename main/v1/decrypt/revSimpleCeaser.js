function singleCeaser(str, shift, dict) {
    const index = dict.indexOf(str);
    if (index > -1) {
        const newIndex = (index + parseInt(shift)) % dict.length;
        str = dict[newIndex];
    }
    return str;
}

function groupCeaser(arr, shift, dict) {
    // Correct version using modulo
    for (let i = 0; i < arr.length; i++) {
        const index = dict.indexOf(arr[i]);
        if (index > -1) {
            const newIndex = (index + shift) % dict.length;
            arr[i] = dict[newIndex];
        }
    }
    return arr;
}

module.exports = {
    single: singleCeaser,
    group: groupCeaser
};