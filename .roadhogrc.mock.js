const mock = {};
let fs = require('fs');
let path = require('path');

let pathArr = [];

function getFile (src) {
    src = src || path.join(process.cwd() ,'/src/mock');
    // 读取 src/mock 目录
    fs.readdirSync(src).forEach(function (file) {
        const filepath = path.join(src, file);
        let stats = fs.statSync(filepath);

        if (stats.isFile()) {
            pathArr.push(filepath)
        } else {
            getFile(filepath);
        }
    });
}

getFile();

pathArr.forEach(function(file) {
    Object.assign(mock, require(file));
});
module.exports = mock;

