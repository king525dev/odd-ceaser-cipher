const fs = require("fs");
const path = require('path');
const date = require('./modules/date');
const encrypt = require('./main/encrypt/encrypt');
const decrypt = require('./main/decrypt/decrypt');
const prompt = require('prompt-sync')();

//Initialize functions
function OddCeaser(string, key, action){
     if(!action){
          return decrypt(string, key);
     }else{
          return encrypt(string, key);
     }
}

function fileHandler(dir, key, action){
     fs.readFile(dir, "utf8", (err, file) => {
          if(err){
               console.log(err);
          }else{
               const nDir = path.join(__dirname, `out-${date()}.txt`)
               const cip = OddCeaser(file, key, action)
               const out = `${cip.out}\n\nKey: ${cip.key}`
               fs.writeFile(nDir, out, (err) => {
                    if(err){
                         console.log(err);
                    }else{
                         console.log("File Created");
                    }
               });
          }
     });
}

function intro(){
console.log(`
========================================================================================================================================
           ____  _____  _____     _____ ______           _____ ______ _____     _____ _____ _____  _    _ ______ _____  
          / __ \\|  __ \\|  __ \\   / ____|  ____|   /\\    / ____|  ____|  __ \\   / ____|_   _|  __ \\| |  | |  ____|  __ \\ 
         | |  | | |  | | |  | | | |    | |__     /  \\  | (___ | |__  | |__) | | |      | | | |__) | |__| | |__  | |__) |
         | |  | | |  | | |  | | | |    |  __|   / /\\ \\  \\___ \\|  __| |  _  /  | |      | | |  ___/|  __  |  __| |  _  / 
         | |__| | |__| | |__| | | |____| |____ / ____ \\ ____) | |____| | \\ \\  | |____ _| |_| |    | |  | | |____| | \\ \\ 
          \\____/|_____/|_____/   \\_____|______/_/    \\_\\_____/|______|_|  \\_\\  \\_____|_____|_|    |_|  |_|______|_|  \\_\\  
          
=========================================================================================================================================
          `);
}

function restart(){
     const pr = prompt("\nDo you want to run the program again? (y or n): ");
     if(pr == "y" || pr == "yes" || pr == "true"){
          console.log(`\n\n========================================================================================================================================\n`);
          query();
     }else if(pr == "k"){
          return;
     }else{
          return;
     }
}

function query(){
     //First Query
     let q2 = prompt("Are you encrypting\\decrypting (en or de): ");

     if(q2 == "en" || q2 == "y" || q2 == "true" || q2 == "yes"){
          q2 = true;
     }else if(q2 == "de" || q2 == "n" || q2 == "false" || q2 == "no"){
          q2 = false;
     }else if(q2 == "k"){
          return;
     }else{
          console.error("Incorrect input, Try again\n\n");
          query();
          return;
     }

     //Second Query
     let q1 = prompt("Are you working with a file (y or n): ");

     if(q1 == "y" || q1 == "yes" || q1 == "true"){

          const q3 = prompt("Input the file directory: ");
          if(q3 == "k"){
               return;
          }
          const q4 = prompt("Input a 4-digit integer key (optional): ");
          if(q4 == "k"){
               return;
          }

          fileHandler(q3, q4, q2);
          restart();
     }else if (q1 == "n" || q1 == "no" || q1 == "false"){
          const q3 = prompt("Input the text: ");
          if(q3 == "k"){
               return;
          }
          const q4 = prompt("Input a 4-digit integer key (optional): ");
          if(q4 == "k"){
               return;
          }

          const output = OddCeaser(q3, q4, q2);
          console.log(`\nOutput --> \n${output.out}\n`)
          console.log(`Key: ${output.key}`)
          restart();
     }else if(q1 == "k"){
          return;
     }else{
          console.error("Incorrect input, Try again\n\n");
          query();
          return;
     }
}

//Main
function main(){

     //Intro
     intro();
     console.log("\n");

     //Run Query
     query();

}

main();