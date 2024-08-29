function groupCeaser(arr, shift, dict) {
     for(let i = 0 ; arr.length > i; i++){
          const index = dict.indexOf(arr[i]);

          if(index > -1){
               const cipherIndex = () => {
                    let cid = index + shift
                    if (cid > dict.length){
                         return dict.length - cid;
                    }else{
                         return cid;
                    }
               }
               arr[i] = dict[cipherIndex()]
          }
     }

     return arr;
}

function singleCeaser(str, shift, dict) {
     const index = dict.indexOf(str);

     //console.log("Err Core: " +  dict)

     if(index > -1){
          const cipherIndex = () => {
               let cid = index + parseInt(shift)
               //console.log(`${str} -> ${cid}`)
               if (cid > dict.length){
                    //console.log("\t\t" + cid - dict.length)
                    return cid - dict.length;
               }else{
                    //console.log("\t\t" + cid)
                    return cid;
               }
          }
          str = dict[cipherIndex()]
          //console.log("Char: " + str)
     }

     return str;
}
module.exports = {
     single: singleCeaser,
     group: groupCeaser
}