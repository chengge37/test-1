var http = require('http'),
	url = require('url'),
	superagent = require('superagent'),
	cheerio = require('cheerio'),
	async = require('async'),
	eventproxy = require('eventproxy'),
	express = require('express'),
	app = express();


var pageUrls = [],
	pageNum = 10,
	ep = new eventproxy(),
	titlelnkArr = [],
	strHtml = '',
	mainUrl = 'https://segmentfault.com',
	reg = /js|javascript|css|node/i;

for (var i = 1; i <= pageNum; i++) {
	pageUrls.push('https://segmentfault.com/questions?page='+i);	
}
app.use(onRequest)

function onRequest(req, res,next){
	pageUrls.forEach(function(pageUrl){
		superagent.get(pageUrl)
		.end(function(err, pres){

			var $ = cheerio.load(pres.text);
			var curPageUrls = $('.stream-list__item');
			for(var j = 0; j < curPageUrls.length; j++){
				
				var obj = {
					title: curPageUrls.eq(j).find('.title').text(),
					href: mainUrl + curPageUrls.eq(j).find('.title a').attr('href'),
					views: curPageUrls.eq(j).find('.views').text()
				}
				titlelnkArr.push(obj);
				ep.emit('titleLink', obj)
			}
		});
	});
	ep.after('titleLink',pageUrls.length * 30, function(obj){
		strHtml = '';
		obj.filter(function(item){
			if( reg.test(item.title) ){
				return true
			}
			return false;
		}).sort(function(a,b){
			return parseInt( b.views) - parseInt( a.views)
		}).forEach(function(item){
				strHtml+=`<p><a href="${item.href}">${item.title}</p><a>
				<p>${item.views}</p><br>`;
		})
	})
	next();

}

app.get('/ww', function(req, res){
  	res.send(strHtml);
});

app.listen(3000);
