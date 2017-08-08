var fs = require('fs');
var path = require('path');

// 判断指定路径 path 下是否有目录 dir
function isdir (dir, src) {

	src = src || process.cwd();

	// dir: 'src/services/test'
	// 先判断是否有 src 目录，如果有再往下，如果没有，直接返回 false
	var dirArr = path.normalize(dir).split('\\');
	var desc = '';
	for (var i = 0; i < dirArr.length; i++) {
		desc += '/' + dirArr[i];
        try {
            fs.readdirSync(path.join(process.cwd(), desc));
		} catch (e) {
        	return false;
		}

	}
	
	return true;
}

module.exports = isdir; 