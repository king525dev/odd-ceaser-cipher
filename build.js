// build.js
const exe = require('@angablue/exe');

const build = exe({
     entry: './index.js',
     out: './OddCeaser.exe',
     //pkg: ['-C', 'GZip'], // Specify extra pkg arguments
     productVersion: '1.1.0',
     fileVersion: '1.1.0',
     target: 'latest-win-x64',
     icon: './icons/icon.ico', // Application icons must be in .ico format
     properties: {
          FileDescription: 'Odd Ceaser Cipher',
          ProductName: 'Odd Ceaser Cipher',
          LegalCopyright: 'king525dev https://king525dev.github.io/vcard-personal-portfolio/',
          OriginalFilename: 'Odd Ceaser Cipher.exe'
     }
});

build.then(() => console.log('Build completed!'));

/*

To convert to executable...
https://anga.blue/blog/windows-executable-file-exe-node-js

*/

/*

` "package": "node build" `
          --> Builds an executable

` "build": "esbuild index.js --bundle --platform=node --outfile=out.js" `
          --> Puts all javascript in a single file called "out.js"

*/