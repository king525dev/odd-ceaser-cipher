const rcedit = require('rcedit');

async function main(){
     await rcedit("./index-win.exe", { icon: "./icons/icon.ico" });
}

main();