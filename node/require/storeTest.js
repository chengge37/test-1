//模块的缓存
//时间没变
// setInterval(function(){
// 	var date = require('./store.js');
// 	console.log(date);
// },1000);

//删除缓存
setInterval(function(){
	Object.keys(require.cache).forEach(function(item){
		delete require.cache[item];
	});
	console.log(require.cache)
	var date = require('./store.js');
	console.log('------------------------------');
	console.log(date)

},1000)