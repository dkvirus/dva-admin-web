var fs = require('fs');
var path = require('path');

// 在指定路径下创建目录
function mkdir (dir, src) {
	
	// 获取执行根目录
	src = src || process.cwd();	
	dir = dir.replace(process.cwd(), '');
	
	// dir: 'src/services/test'
	// 先判断是否有 src 目录，如果有再往下，如果没有，直接返回 false
	var dirArr = path.normalize(dir).split('\\');
	var desc = '';
	for (var i = 0; i < dirArr.length; i++) {
		desc += '/' + dirArr[i];
        try {
            fs.readdirSync(path.join(process.cwd(), desc));
		} catch (e) {
        	// 没有该目录时报错，此时创建该目录
			fs.mkdirSync(path.join(process.cwd(), desc));
		}

	}
	
	return true;
}

module.exports = mkdir;