var pg = require('pg');
var config = require('../config')
var async = require('async')
var Appointment = require('./appointment.js')


var User = function(arg){
	this.email = arg.email;
	this.password = arg.password;
	this.userId = arg.user_id;
	this.admin = arg.admin;
}

User.findOne = function(email, cb){
	pg.connect(config.dbString, function (err, client, done){
		if(err){
			throw err;
		}
		client.query("select * from users where email like $1",[email], function(err,results){
			done();

			if (err) {
				throw err;
			} else if(results.rowCount > 0){
				cb(null, new User(results.rows[0]));
			}
			else{
				cb(null);
			}

		});
	
	});

}

User.findById = function(userId, cb){
	if (!(userId)){
		cb();
	}
	pg.connect(config.dbString, function (err, client, done){
		if(err){
			throw err;
		}
		client.query('select * from users where user_id = $1',[userId], function(err,results){
			done();
			if (err){
				throw err;
			} 
				cb(null, new User(results.rows[0]));
		});
	});
}

User.getAdminDashboard = function(adminId,cb) { //admin id passed for when multiples admins

	async.parallel({
		clientTimes: function(callback){
			callback();
		},
		appointmentConfirms: function(callback){
			callback();
		}
	}, 
	function(err,results){
		if(err){
			cb(err,null);
		}
		cb(null,results);
	}); 
}





User.prototype.isAdmin = function(){
	return this.admin === true;
}


User.prototype.authenticate = function(password){
	return this.password === password;
}




// function earliestClientTimes (adminId,cb){ //adminId is passed to easily scale when more admins
// 	pg.connect(config.dbString, function(err,client,done){
// 		if(err){
// 			throw(err);
// 		}
// 		client.query('select ')
// 	});
// }


module.exports = User;