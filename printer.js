const fs = require("fs");

function printer(string){
     const content = string.join(" - ");
     fs.writeFile("print.txt", content, (err) => {
          if(err){
               console.log(err);
          }else{
               console.log("File Created");
          }
     })
}

module.exports = printer;