function $require (id) {
	
	//先找到文件如果不存在则抛出错误
	//读取文件内容
	var fs = require('fs');
	var path = require('path');

	var code = fs.readFileSync(__dirname+id,'utf-8');
	var filename = path.join(__dirname,id);
	$require.cache = $require.cache || {};
	if($require.cache[filename]){
		return $require.cache[filename].exports;
	}
	//执行代码,营造一个私有空间
	var module = {
		id:filename,
		exports:{}
	}

	var exports = module.exports;
	code = `
		(function($require, module,  exports, __dirname, __filename){
			${code}
		})($require, module,  exports,__dirname,__filename)
	`;

$require.cache[filename] = module;
	//返回值

	eval(code);

	return module.exports;



}

setInterval(function(){
	var test = $require('/store.js');
	console.log(test)
},1000);
