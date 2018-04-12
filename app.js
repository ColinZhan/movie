var express = require('express');					    //express框架
var path = require('path');							      //路径处理
var moment = require('moment');               //日期处理
var favicon = require('serve-favicon');       //图标
var logger = require('morgan');               //增强日志内容和可读性
var cookieParser = require('cookie-parser');  //cookie操作
var session = require('express-session');     //session操作
var bodyParser = require('body-parser');      //body里的内容初始化一个对象
var mongoose = require('mongoose');           //mongodb插件
var mongoStore = require('connect-mongo')(session);	//利用connect-mongo设置会话持久化（数据库）
var fs = require('fs');                              //文件读写
var movie = require('./routes/movie');              //路由
var app = express();                                //初始化

/*连接数据库 */
var dburl = 'mongodb://localhost/moviedb';      //数据库地址
mongoose.connect(dburl);                        //调用mongoose的connect方法连接数据库
console.log('moviedb connect success');         //输出日志

// 加载模型
var models_path = __dirname + '/app/models';
var walk = function(path){
  fs.readdirSync(path).forEach(function(file){
    var newPath = path + '/' + file;
    var stat = fs.statSync(newPath);

    if(stat.isFile()){
      if(/(.*)\.(js|coffee)/.test(file)){
        require(newPath);
      }
    }
    else if(stat.isDirectory()){
      walk(newPath);
    }
  })
}
walk(models_path);


app.set('views', path.join(__dirname, './app/views'));			      //视图路径
app.set('view engine', 'jade');                                   //模板引擎

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));  //设置图标
app.use(logger('dev'));
app.use(bodyParser.json());                                       //页面数据 json化
app.use(bodyParser.urlencoded({ extended: true }));               //当extended为false的时候，键值对中的值就为'String'或'Array'形式，为true的时候，则可为任何数据类型。
app.use(cookieParser());
app.use(require('connect-multiparty')());                         //上传图片表单需要用到的插件
app.use(express.static(path.join(__dirname, 'public')));          //静态资源
app.locals.moment = moment;

/* 配置session */
app.use(session({
	secret: 'imovie',
	store: new mongoStore({
		url: dburl,
		collection: 'sessions'
	})
}));

// 用户session预处理
app.use(function(req, res, next){
	var _user = req.session.user;
	app.locals.user = _user;
	return next();
})

// 路由
app.use('/', movie);

// 404
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// 错误处理
app.use(function(err, req, res, next) {
  // 在开发时，设置本地错误消息
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // 渲染错误界面
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
