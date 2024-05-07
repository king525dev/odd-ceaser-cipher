function formatDate(){
     const dater = new Date();
     let myDate = dater.getUTCDate();
     let year = dater.getUTCFullYear();
     let month = (dater.getMonth() + 1);
     let hours = dater.getUTCHours();
     let minutes = dater.getUTCMinutes();

     if (minutes < 10) { minutes = `0${minutes}`}
     if (hours < 10) { hours = `0${hours}`}
     if (month < 10) { month = `0${month}`}
     if (myDate < 10) { myDate = `0${myDate}`}

     return `${myDate}${month}${year}-${hours}${minutes}`
}

module.exports = formatDate;