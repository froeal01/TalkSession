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
		dailyTimes: function(callback){
			getDailySchedule(adminId,null,function(err,dayEvents){
				if(err){
					callback(err);
				}
				callback(null,dayEvents)
			});
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

function getDailySchedule(adminId, date,cb){
 var date = date || today();
 pg.connect(config.dbString, function(err,client,done){
 	if(err){
 		throw(err);
 	}
 	client.query('select * from appointments where appointment_date = $1 AND created_by = $2', [date,parseInt(adminId)], function(err,results){
 		if(err){
 			throw(err) // handleError better
 		}
 		if(results.rowCount > 0){
 			var values = results.rows.map(function(values){return new Appointment(values);});
 			cb(null, values)
 		} else {
 			cb(null,"No scheduled appointments");
 		}
 	});
 });
}



function today(){
	var today = new Date();
	var year = today.getFullYear();
	var month = today.getMonth() + 1;
	var day = today.getDate()
	return year.toString() + "-" + (month.toString().length ===2 ? month.toString() : "0" + month.toString()) + "-" + (day.toString().length ===2 ? day.toString() : "0" + day.toString())
}
module.exports = User;