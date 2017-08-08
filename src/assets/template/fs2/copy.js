var fs = require('fs');
var path = require('path');
var copyfile = require('./copyfile');
var copydict = require('./copydict');

/**
 复制 src 目录下所有文件
 @param src 框架模板文件路径 'dk-cli/frame/'
 @param desc 要复制到哪里路径，默认执行目录根目录 process.cwd()
*/
function copy (src, desc) {
	

	
	desc = desc || process.cwd(); 
	
	// 判断 src 的状态，由 src 可知道要复制的是文件还是目录 
	// src 为文件，直接复制到 desc 去
	// src 为目录，先复制目录，再查看目录子结构，再判断
	
	fs.stat(src, function (err, stats) {
	   if (err) {
		    return console.error(err);
	   }
	   
	   // src = 'C:\Users\Administrator\Desktop\dk-cli\frame'
	   // desc = 'D:\code\test\test-command\test'
	   
	   if (stats.isFile()) {
			// 复制文件
			if (~path.basename(desc).indexOf('.')) {
				desc = path.dirname(desc);
			}
			
			copyfile(src, desc);
	   } else if (stats.isDirectory()) {
		    
			if (path.basename(src) !== 'frame') {
				// 复制目录
				copydict(src, desc);
			}
			
		    // 遍历目录
			fs.readdir(src, function (err, files) {
				if (err) {
					return console.error(err);
				}
				
				if (path.basename(src) !== 'frame') {
					desc = path.join(desc, path.basename(src));
				}
				
				files.forEach(function (file) {
					copy(path.join(src, file), desc);
				});
			});

	   }    
	});
	
}

module.exports = copy;
