//** Module Dependencies. **//
var express = require('express');
var partials = require('express-partials');
var http = require('http');
var path = require('path');
var index = require('./routes/index.js');
var events = require('./routes/events.js');
var sessions = require('./routes/sessions.js');
var users = require('./routes/user.js')
var admin =  require("./routes/admins.js");
var adminAuth = require ('./middleware/adminAuth.js');
var userAuth = require ('./middleware/userAuth.js');
var config = require('./config.js')
var pg = require('pg').native
var app = express();
var helpers = require('express-helpers');


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
helpers(app);	
// development only

if ('development' === app.get('env')){
	console.log('This is development');
	app.use(express.errorHandler());
} else {
	console.log("This is production");
}

// index
app.get('/', index.index);

// calendar 

app.get('/events/:date', userAuth, events.show);
app.post('/events/:date', userAuth, events.update);
app.post('/dailyschedule', adminAuth, events.dailyschedule);
app.post('/timeslots', userAuth, events.monthlyslots);
app.post('/decline-appointment',adminAuth, events.decline);
app.post('/accept-appointment',adminAuth, events.accept);

// sessions
app.post('/', sessions.create);
app.get('/signout', sessions.delete);

// client path
app.get('/home',userAuth,users.index);

//** admin path **//
app.get('/admins/home', adminAuth, admin.home);
app.get('/admins/events/new', adminAuth, events.new);
app.post('/admins/events/new', adminAuth, events.create);

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port' + app.get('port'));
});



