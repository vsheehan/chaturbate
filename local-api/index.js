const fs = require('fs');

fs.readFile('tips.txt', (err, data) => {
    if (err) throw err;
    console.log(data);
})
