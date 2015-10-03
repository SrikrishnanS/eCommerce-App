var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var connect = require('connect');
var redis   = require("redis");
var RedisStore = require('connect-redis')(session);

var routes = require('./controller/index');
var health = require('./controller/health');
var login = require('./controller/login');
var home = require('./controller/home');
var user = require('./controller/user');
var product = require('./controller/product');

var serverConfig = require('./config/server');
var client  = redis.createClient();
var app = express();
var port = serverConfig.port;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'static')));
app.use(session({secret: 'secret',resave: false,saveUninitialized: true,rolling:true, store: new RedisStore({ host: 'localhost', port: 8000, client: client,ttl :  260}) }));

app.use('/', routes);
app.use('/health', health);
app.use('/login', login);
app.use('/home', home);
app.use('/', user);
app.use('/', product);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});



// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(port);
console.log("Listening at port " + port);

module.exports = app;
