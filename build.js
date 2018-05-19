const fs = require('fs');

let swdata =
    fs
        .readFileSync('./zipServerWorker.js', { encoding: 'utf8' })
        .replace(/this\.importScripts\('(.*);?'\)/g, (m, src) => {
            return fs.readFileSync(src, { encoding: 'utf8' });
        });

fs.writeFileSync('./dist/zipServerWorker.js', swdata, { encoding: 'utf8' });

// copy the ZipServer over
fs.copyFileSync(
    './ZipServer.js',
    './dist/ZipServer.js'
);