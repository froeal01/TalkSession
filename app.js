//** Module Dependencies. **//
var express = require('express');
var partials = require('express-partials');
var http = require('http');
var path = require('path');
var index = require('./routes/index.js');
var events = require('./routes/events.js');
var app = express();


// ** for all environments **//

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, '/views'));
app.set('view engine','ejs');
app.use(express.favicon("public/images/favicon.ico"));
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.cookieParser('your secret here'));
app.use(express.cookieSession());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(partials());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.enable('trust proxy');

// development only

if ('development' === app.get('env')){
	console.log('This is development');
	app.use(express.errorHandler());
} else {
	console.log("This is production");
}

// index
app.get('/', index.index);

// calendar index
app.get('/events',events.index);
app.get('/events/:date', events.new);


http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port' + app.get('port'));
});