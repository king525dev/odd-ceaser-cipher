function logicOperator(nibble, mask, gate){

     nibble.toString().split("");
     mask.toString().split("");
     const resValue = []
     
     for (i = 0; i < nibble.length; i++){
          resValue.push(gate(nibble[i], mask[i]))
     }

     return resValue.join("");
     // const num = [
     //      [Number(nibble[0]), Number(nibble[1])],
     //      [Number(nibble[2]), Number(nibble[3])],
     //      [Number(nibble[4]), Number(nibble[5])]
     // ]

     // num.forEach((arr) => {
     //      arr.forEach((num) => {
     //           console.log(num);
     //      });
     // });

     // const x11 = XOR(num[0][0], num[0][1]);
     // const x12 = XOR(num[1][0], num[1][1]);
     // const x13 =XOR(num[2][0], num[2][1]);

     // const x21 = XOR(x11, x12);
     // const x22 = x13

     // const x31 = XOR(x21, x22)

     // return x31;
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
     if(a == b){
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
// | 0    +    0    --->      1 |
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