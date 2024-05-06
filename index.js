const encrypt = require('./main/encrypt/encrypt');
const decrypt = require('./main/decrypt/decrypt');
const prompt = require('prompt-sync')();
const fileHandler = require('./fileHandler');
const readline = require("readline");
const rl = readline.createInterface({
     input: process.stdin,
     output: process.stdout
});

//Initialize functions
function OddCeaser(string, key, action){
     if(!action){
          return decrypt(string, key);
     }else{
          return encrypt(string, key);
     }
}

function file(dir, key, action){
     const input = fileHandler(dir, "", false);
     const output = OddCeaser(input, key, action);
     fileHandler(dir, output, true);
     console.log("Operation Completed")
}

//Query
function main(){
     let q1 = prompt("Are you encrypting\\decrypting a file (y or n): ");
     let q2 = prompt("Are you encrypting\\decrypting (en or de): ");

     if(q2 == "en" || q2 == "y" || q2 == "true" || q2 == "yes"){
          q2 = true;
     }else if(q2 == "de" || q2 == "n" || q2 == "false" || q2 == "no"){
          q2 = false;
     }else{
          console.error("Incorrect input, Try again");
          main();
          return;
     }

     if(q1 == "y" || q1 == "yes" || q1 == "true"){
          const q3 = prompt("Input the file directory: ");
          const q4 = prompt("Input a 4-digit integer key (optional): ");

          file(q3, q4, q2)
     }else if (q1 == "n" || q1 == "no" || q1 == "false"){
          const q3 = prompt("Input the text: ");
          const q4 = prompt("Input a 4-digit integer key (optional): ");

          const output = OddCeaser(q3, q4, q2);
          console.log(`Output: \n\t ${output.out}`)
          console.log(`Key: ${output.key}`)
     }else{
          console.error("Incorrect input, Try again");
          main();
          return;
     }

}

main();