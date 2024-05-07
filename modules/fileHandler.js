const fs = require("fs");
const path = require('path');

function printer(name, string){
     path.basename += "-out"
     fs.writeFile(name, string, (err) => {
          if(err){
               console.log(err);
          }else{
               console.log("File Created");
          }
     })
}

function scanner(name){
     fs.readFile(name, "utf8", (err, file) => {
          if(err){
               console.log(err);
          }else{
               return file;
          }
     });
}

function fileHandler(name, text, print){
     if(print){
          return printer(name, text);
     }else{
          return scanner(name)
     }
}

console.log(scanner("schema.txt"));

module.exports = fileHandler;