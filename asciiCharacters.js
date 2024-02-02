const asciiArray = [];

for (let i = 0; i < 128; i++) {

     const conditions = [
          String.fromCharCode(i) === " ", 
          typeof(String.fromCharCode(i)), 
          String.fromCharCode(i) === "&", 
     ]

     let deter = 0;
     for(let j = 0; j < conditions.length; i++){
          if(conditions[j]){
               deter++
          }
     }

     if(deter == conditions.length){
          asciiArray.push(String.fromCharCode(i));
     }
}

console.log(asciiArray);