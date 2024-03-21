function logicOperator(nibble, mask, gate){

     nibble.toString().split("");
     mask.toString().split("");
     const resValue = []
     
     for (i = 0; i < nibble.length; i++){
          resValue.push(gate(nibble[i], mask[i]))
     }

     return resValue.join("");
}

function NOT(a){
     if(a == 1){
          return 0;
     }else{
          return 1;
     }
}

function XOR(a, b){
     if(a == b){
          return 0;
     }else{
          return 1;
     }
}

function AND(a, b){
     if(a == b && a !== 0){
          return 1;
     }else{
          return 0;
     }
}

function OR(a, b){
     if(a == 0 && b == 0){
          return 0;
     }else{
          return 1;
     }
}

console.log(logicOperator("101010", "111111", XOR))

//        >NOT GATE<
// +----------------------------+
// |                            |
// | 1              --->      0 |
// | 0              --->      1 |
// |                            |
// +----------------------------+

//        >AND GATE<
// +----------------------------+
// |                            |
// | 1    +    1    --->      1 |
// | 1    +    0    --->      0 |
// | 0    +    1    --->      0 |
// | 0    +    0    --->      0 |
// |                            |
// +----------------------------+

//        >OR GATE<
// +----------------------------+
// |                            |
// | 1    +    1    --->      1 |
// | 1    +    0    --->      1 |
// | 0    +    1    --->      1 |
// | 0    +    0    --->      0 |
// |                            |
// +----------------------------+

//        >XOR GATE<
// +----------------------------+
// |                            |
// | 1    +    1    --->      0 |
// | 1    +    0    --->      1 |
// | 0    +    1    --->      1 |
// | 0    +    0    --->      0 |
// |                            |
// +----------------------------+