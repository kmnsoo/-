process.env.NODE_ENV = ( process.env.NODE_ENV && ( process.env.NODE_ENV ).trim().toLowerCase() == 'production' ) ? 'production' : 'development';
let createError = require('http-errors');
let express = require('express');
let glob = require('glob');
let path = require('path');
let config = require('./config');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
const expressLayouts = require('express-ejs-layouts');

var cors = require('cors'); // 임시사용


let app = express();

var bodyParser = require('body-parser'); //POST 방식 전송을 위해서 필요함                                               
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended : true}));
require('events').EventEmitter.prototype._maxListeners = 100;
app.use(cookieParser());

// view enfine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('layout', 'layout');
app.use(expressLayouts);
app.set("layout extractScripts", true);

app.use(logger('dev'));
app.use(express.json({limit: '500mb'}));
app.use(express.urlencoded({limit: '500mb', extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// CORS 설정
app.use(cors()); // 임시사용


// app.set({'access-control-allow-origin':'*'});

//session & database
let session = require('express-session');

let MySQLStore = require('express-mysql-session')(session); 
// mysql session store 방식
var options = {
	host: process.env.NODE_ENV=='production'?config.DATABASE_INFO.pro.HOST:config.DATABASE_INFO.dev.HOST,
	port: process.env.NODE_ENV=='production'?config.DATABASE_INFO.pro.PORT:config.DATABASE_INFO.dev.PORT,
	user: process.env.NODE_ENV=='production'?config.DATABASE_INFO.pro.USER:config.DATABASE_INFO.dev.USER,
	password: process.env.NODE_ENV=='production'?config.DATABASE_INFO.pro.PASSWORD:config.DATABASE_INFO.dev.PASSWORD,
  database: process.env.NODE_ENV=='production'?config.DATABASE_INFO.pro.DATABASE:config.DATABASE_INFO.dev.DATABASE,
	expiration: 86400000, // The maximum age of a valid session; milliseconds:
};
let sessionStore = new MySQLStore(options);

app.use(session({
	key: 'S_DATA',
  secret: 'FFAFDSA#$$$ghewirEhdgoanfrhk@!',
	store: sessionStore,
	resave: false,
	saveUninitialized: true
}));

// 세션을 담아놓는다.
app.use(function (req, res, next) {
  if (typeof req.session.authority !== 'undefined'){
      res.locals.isLogin = (req.session.authority > 0);
      res.locals.userInfo = req.session.user; 
  } else {
      res.locals.isLogin = false;
  }
  next();
});

// settings for page layout
app.use('/*', function (req, res, next) {
  app.set('layout', 'layout');
  app.set('views', path.join(__dirname, 'views'));
  next();
});

app.use('/login', function (req, res, next) {
  app.set('layout', 'login');
  app.set('views', path.join(__dirname, 'views'));
  next();
});




// 로그인 관련 처리 auth 
let zThorizer = require('./jet_modules/zThorizer');
app.use(function (req, res, next) {
    let authTestResult = zThorizer.authenticate(req);
    console.log(`authTestResult=[${authTestResult}]`);
    switch (authTestResult) {
        case 1 :
            //승인
            res.locals.uid = req.session.uid;
            next();
            break;
        case 0 :
            //권한없음
            res.render('message', {message: 'You do not have permission'});
            break;
        case -1 :
            //로그인필요
            res.redirect('/login');
            break;
    }
});

// settings for routes
let routes = glob.sync('routes/**/*.js');
routes.forEach(function (file) {
    let route = file.substr(6, file.length - 9);
    route = route.replace('index', '');
    app.use(route, require('./' + file)(app));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

module.exports = app;
