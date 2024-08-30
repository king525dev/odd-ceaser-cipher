const fs = require("fs");
const path = require('path');
const date = require('./modules/date');
const enV1 = require('./main/v1/encrypt/encrypt');
const deV1= require('./main/v1/decrypt/decrypt');
const enV2 = require('./main/v1.1/encrypt/encrypt');
const deV2= require('./main/v1.1/decrypt/decrypt');
const prompt = require('prompt-sync')();
version = true;

const encrypt = (string, key, ver) => {
     if (ver){
          return enV2(string, key);
     }else{
          return enV1(string, key);
     }
}

const decrypt = (string, key, ver) => {
     if (ver){
          return deV2(string, key);
     }else{
          return deV1(string, key);
     }
}


//Initialize functions
function OddCeaser(string, key, action){
     if(!action){
          return decrypt(string, key, version);
     }else{
          return encrypt(string, key, version);
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
========================================================================================================================

      ____  _____  _____     _____ ______           _____ ______ _____     _____ _____ _____  _    _ ______ _____  
     / __ \\|  __ \\|  __ \\   / ____|  ____|   /\\    / ____|  ____|  __ \\   / ____|_   _|  __ \\| |  | |  ____|  __ \\ 
    | |  | | |  | | |  | | | |    | |__     /  \\  | (___ | |__  | |__) | | |      | | | |__) | |__| | |__  | |__) |
    | |  | | |  | | |  | | | |    |  __|   / /\\ \\  \\___ \\|  __| |  _  /  | |      | | |  ___/|  __  |  __| |  _  / 
    | |__| | |__| | |__| | | |____| |____ / ____ \\ ____) | |____| | \\ \\  | |____ _| |_| |    | |  | | |____| | \\ \\ 
     \\____/|_____/|_____/   \\_____|______/_/    \\_\\_____/|______|_|  \\_\\  \\_____|_____|_|    |_|  |_|______|_|  \\_\\
                                                                                                               
        
========================================================================================================================
                                                                                                    -- version 1.1.0 --

`);
}

function restart(){
     const pr = prompt("\nDo you want to run the program again? (y or n): ");
     if(pr == "y" || pr == "yes" || pr == "true"){
          console.log(`\n\n========================================================================================================================\n`);
          query();
     }else if(pr == "k"){
          return;
     }else if(pr == "r"){
          main();
          return;
     }else{
          return;
     }
}

function query(){

     //Version Query
     let ver = prompt("Do you want continue with version 1.1.0 (y or n): ");

     if(ver == "v1.0" || ver == "n" || ver == "false" || ver == "no" || ver == "1.0"){
          version = false;
          console.info("\n ---- Switching to Version 1.0.0 .... ----\n");
     }else{
          version = true;
          console.info("\n ---- Switching to Version 1.1.0 .... ----\n");
     }

     //First Query
     let q2 = prompt("Are you encrypting\\decrypting (en or de): ");

     if(q2 == "en" || q2 == "y" || q2 == "true" || q2 == "yes"){
          q2 = true;
     }else if(q2 == "de" || q2 == "n" || q2 == "false" || q2 == "no"){
          q2 = false;
     }else if(q2 == "k"){
          return;
     }else if(q2 == "r"){
          main();
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
          }else if(q3 == "r"){
               main();
               return;
          }
          const q4 = prompt("Input a 4-digit integer key (optional): ");
          if(q4 == "k"){
               return;
          }else if(q4 == "r"){
               main();
               return;
          }

          fileHandler(q3, q4, q2);
          restart();
     }else if (q1 == "n" || q1 == "no" || q1 == "false"){
          const q3 = prompt("Input the text: ");
          if(q3 == "k"){
               return;
          }else if(q3 == "r"){
               main();
               return;
          }
          const q4 = prompt("Input a 4-digit integer key (optional): ");
          if(q4 == "k"){
               return;
          }else if(q4 == "r"){
               main();
               return;
          }

          const output = OddCeaser(q3, q4, q2);
          console.log(`\nOutput --> \n${output.out}\n`)
          console.log(`Key: ${output.key}`)
          restart();
     }else if(q1 == "k"){
          return;
     }else if(q1 == "r"){
          main();
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