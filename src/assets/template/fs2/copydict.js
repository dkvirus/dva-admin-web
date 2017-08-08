var fs = require('fs');
var path = require('path');
var isdir = require('./isdir');
var mkdir = require('./mkdir');

// 复制目录,判断参数，仅仅是复制目录 mkdir
// src 从哪里复制，路径名
// desc 复制到哪里，路径名
function copydict (src, desc) {
	
	desc = desc || process.cwd(); 
		
	// 获取目录名称
	var dictname = path.basename(src);
	
	// 创建目录
	mkdir(path.join(desc, dictname));
		
}

module.exports = copydict;