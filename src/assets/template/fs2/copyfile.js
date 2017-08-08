var fs = require('fs');
var path = require('path');
var isdir = require('./isdir');
var mkdir = require('./mkdir');

// 复制文件：文件在哪里  src，复制到哪里去 desc
// src 为文件路径 tmp/test
// desc 为目录路径  tmp 

// 新文件需不需要改名字
// 新文件复制的时候需不需要做局部处理，提供回调函数
// 已经存在文件，是替换还是取消操作，默认是替换
function copyfile (src, desc) {
	
	// src = 'C:\Users\Administrator\Desktop\dk-cli\frame\demo.txt'
	// desc = 'D:\code\test\test-command\test'
	
	// 用流处理
	// 创建一个可读流
	var readerStream = fs.createReadStream(src);

	// 创建一个可写流
	var writerStream = fs.createWriteStream(path.join(desc, path.basename(src)));

	// 管道读写操作
	// 读取 input.txt 文件内容，并将内容写入到 output.txt 文件中
	readerStream.pipe(writerStream);
	
	// readFile 先去读 src 的文件，如果读取错误，报出错误
	// fs.readFile(src, function (err, data) {
		// if (err) {
			// src 为目录 tmp 时报错
			// 没找到 src 路径文件时报错 
			// return console.error(err);
		// }
		
		// 判断 desc 目录是否存在，不存在创建它
		// if (!isdir(desc)) {
			// mkdir(desc);
		// }
		
		// writeFile 将内容写到新文件中，这里是生成脚手架，没有这种可能性
		// var filename = path.basename(src);
		// fs.writeFile(path.join(desc, filename), data.toString(), function (err) {
			// if (err) {
				// return console.error(err);
			// }
		// });
		
	// })	
	
}

module.exports = copyfile;