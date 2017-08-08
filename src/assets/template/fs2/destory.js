/*删除文件/文件夹，就算文件夹内有子文件，一并删除*/
/**
stat 	判断状态，是文件还是文件夹						默认在执行路径下,添加上执行路径也可以 
unlink 	删除文件										默认在执行路径下,添加上执行路径也可以 
rmdir	删除文件夹，文件夹内有内容，无法删除			需要手动加上执行路径 process.cwd()，不加不行
readdir	读取该文件夹下有什么子文件或子目录				需要手动加上执行路径 process.cwd()，不加不行
 */

let fs = require('fs');
let path = require('path');

// src 默认在执行路径下
function destory(src) {

	// TODO 判断 src 是否在执行目录下，如果不在，加上路径
	let stats = fs.statSync(src);

	/*
	|-- 是文件
		|-- 直接使用 unlink 方法删除
	|-- 是文件夹，读取内容
		|-- 内容为空，说明该文件夹是个空目录，直接删除
		|-- 内容不为空，说明该文件夹有内容，进行遍历，遍历结束后再将该目录删除 
	 */
	if (stats.isFile()) {
		// 删除文件
		fs.unlinkSync(src);
	} else {
		// 读取文件夹内容
		let files = fs.readdirSync(src);
		
		// 文件夹里没有内容，删除文件夹，否则进行下一次递归
		if (files.length === 0) {
			fs.rmdirSync(src);
		} else {
			// 递归文件夹内每一个子文件，递归的目的是删除,每个子文件都删除后再删除目录 
			files.forEach(function (file) {
				destory(path.join(src, file));
			});
			fs.rmdirSync(src);
		}				
		
	}

}

module.exports = destory;
