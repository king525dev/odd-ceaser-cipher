function generateKey(min, max, round){

     let a = [dateNumber(), superRandomiser()];
     let b = [dateNumber(), superRandomiser()];

     const final = oddSwitch(a, b);

     if(max){
          if(final > max){
               return (round)?Math.round(final%max):final%max;
          }else{
               while(final < max){
                    final = final**5
               }
               return (round)?Math.round(final%max):final%max
          }
     }else{
          return final;
     }
}

const dateNumber = () => {
     const date = new Date();
     const secondsNumber = ((date.getSeconds())*(date.getMilliseconds()))+5;
     const minuteNumber = ((date.getMinutes())*(date.getHours()))+5;
     const hoursNumber = ((date.getDate())*(date.getFullYear())*(date.getMonth()))+5;

     const fullDateNumber = (secondsNumber*minuteNumber*hoursNumber)/(secondsNumber+minuteNumber+hoursNumber);
     
     return fullDateNumber;
}

const superRandomiser = () => {
     const rand1 = (Math.random()*100) + (Math.sqrt(Math.random()*1000));
     const rand2 = (Math.random()*100) * (Math.sqrt(Math.random()*1000));
     const rand3 = (Math.random()*100)**2;

     const congregate = (rand1*rand2*rand3)/(rand1+rand2+rand3);

     return (congregate*(Math.random()*100));
}

function oddSwitch(a, b){
     return (a[0]*b[1])+(b[0]*a[1])
}

console.log(generateKey(10000, true))