var express = require('express');
var path = require('path');
var ejs = require('ejs');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
// 上传海报需要connect-multiparty中间件
var multiPart = require('connect-multiparty');

// session
var session = require('express-session')
// 基于mangodb的session持久化
var mongoStore = require('connect-mongo')(session);
var bodyParser = require('body-parser');

var dbUrl = 'mongodb://localhost/userdb';

var route = require('./routes/routeConfig');
var mongoose = require('mongoose');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', ejs.__express);
app.set('view engine', 'html');


app.locals.moment = require('moment');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(multiPart());
app.use(express.static(path.join(__dirname, 'public')));

// 保持回话状态
// session依赖于前面的cookieParser
app.use(session({
	secret:'imooc',
	store:new mongoStore({
		url:dbUrl,
		collection:'sessions'
	})
}))


app.use('/', route);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// 配置
if ('development' === app.get('env')) {
	app.set('showStatck',true);
	app.locals.pretty = true;
	mongoose.set('debug',true);
}

module.exports = app;
