const fs = require("fs");

function printer(name, string){
     fs.writeFile(`${name}.txt`, string, (err) => {
          if(err){
               console.log(err);
          }else{
               console.log("File Created");
          }
     })
}

function scanner(name){
     fs.readFile(`${name}.txt`, "utf8", (err, file) => {
          if(err){
               console.log(err);
          }else{
               return file;
          }
     });
}

function fileHandler(name, text, print){
     if(print){
          printer(name, text);
     }else{
          scanner(name)
     }
}