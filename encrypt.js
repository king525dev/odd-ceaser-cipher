function encrypt(string, key){
     return string.replaceAll(" ", "&");
}

console.log(encrypt("yoooooo hiiiiiii"));