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

     if(index > -1){
          const cipherIndex = () => {
               let cid = index + parseInt(shift)
               if (cid > dict.length){
                    return dict.length - cid;
               }else{
                    return cid;
               }
          }
          str = dict[cipherIndex()]
     }

     return str;
}
module.exports = {
     single: singleCeaser,
     group: groupCeaser
}