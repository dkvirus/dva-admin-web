var fs = require('fs');
var path = require('path');

// 判断目录 src 下是否包含某个文件 filename
// src 必须为执行目录下的地址
function include (filename, src) {
	
	src = path.join(process.cwd(), src);
	
	try {
		fs.statSync(path.join(src, filename));
	} catch (e) {
		return false;
	}
	
	return true; 
}

module.exports = include;