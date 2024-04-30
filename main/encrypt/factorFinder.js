function findFactors(num) {
     for (let i = Math.floor(Math.sqrt(num)); i > 0; i--) {
          if (num % i === 0) {
               return [i, num / i];
          }
     }
     return [1, num];
}

module.exports = findFactors;