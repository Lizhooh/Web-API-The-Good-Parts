const fs = require('fs');
const onlyspace = require('only-space');

let str = fs.readFileSync('./README.md').toString();

str = onlyspace(str);

console.log(str);

fs.writeFileSync('./README.md', str);