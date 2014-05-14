var pg = require('pg');
var config = require('../config');
var async = require('async');
var App = require('./appointment.js');
var helper = require('../helper.js');


var User = function(arg){
	this.email = arg.email;
	this.password = arg.password;
	this.firstName = arg.first_name;
	this.userId = arg.user_id;
	this.admin = arg.admin;
}

User.findOne = function(email, cb){
	helper.dbCallFirstRow('select * from users where email like $1',[email],User,cb);
}	
	


User.findById = function(userId, cb){
	helper.dbCallFirstRow('select * from users where user_id = $1',[userId],User,cb);
}


User.getAdminDashboard = function(adminId,cb) { //admin id passed for when multiples admins

	async.parallel({
		clientTimes: function(callback){
			getClientConfirmedAppointment(adminId,callback) 
			
		},
		appointmentConfirms: function(callback){
			getAppointmentsNeedingConfirm(adminId,callback)
		}
	}, 
	function(err,results){
		if(err){
			cb(err,null);
		}
		cb(null,results);
	}); 
}

function getClientConfirmedAppointment(adminId,callback){
	
	helper.dbCallAllRows('select DISTINCT ON(client_email) client_email, appointment_date, client_name, start_time,end_time '+
		 'FROM appointments WHERE appointment_date > now() AND confirmed = true '+
		  'ORDER BY client_email, appointment_date, client_name, start_time,end_time ASC;',[],App,function(err,confirmed){
		  	callback(err,confirmed);
		  });
}





	// pg.connect(config.dbString, function(err,client,done){
	// 	if(err){
	// 		throw(err) //handle me
	// 	}
	// 	client.query('select DISTINCT ON(client_email) client_email, appointment_date, client_name, start_time,end_time '+
	// 	 'FROM appointments WHERE appointment_date > now() AND confirmed = true '+
	// 	  'ORDER BY client_email, appointment_date, client_name, start_time,end_time ASC;',[],function(err,results){
	// 	   	done();
	// 	   	if(err){
	// 	   		throw(err);
	// 	   	}
	// 	   	if(results.rowCount > 0){
	// 		   	var confirmed = results.rows.map(function(result){return result});
	// 		   	cb(null,confirmed);
	// 	   	} else{
	// 	   		cb(null,results);
	// 	   	}
	// 	   });
	// });


function getAppointmentsNeedingConfirm(adminId,callback){
	helper.dbCallAllRows('select * from appointments WHERE created_by = $1 AND booked = true AND confirmed = false',[parseInt(adminId)], App, function(err,pending){
		callback(err,pending);
	});
}





	// pg.connect(config.dbString, function(err,client,done){
	// 	if(err){
	// 		throw(err);
	// 	}
	// 	client.query('select * from appointments WHERE created_by = $1 AND booked = true AND confirmed = false',[parseInt(adminId)],function(err,results){
	// 		done();
	// 		if(err){
	// 			throw(err);
	// 		}
	// 		if (results.rowCount > 0){
	// 			var pending = results.rows.map(function(result){return result});
	// 			cb(null,pending);
	// 		}else{
	// 			cb(null,results)
	// 		}
	// 	});
	// });


User.getClientDash = function(userId,cb){
	async.waterfall([
		function(callback){
			User.findById(userId, callback);
		},
		function(user,callback){
			user.pendingAppointments(user,callback);
		},
		function(user,pending,callback){
			user.confirmedAppointments(user,pending,callback);
		}

		], function(err,results){
			cb(err,results);
		});
}

User.prototype.pendingAppointments = function(user,callback){
	var user = this;

	helper.dbCallAllRows("select appointment_date, to_char(start_time,'HH12:MI:SS:am') as start_time, to_char(end_time, 'HH12:MI:SS:am') as end_time from appointments WHERE client_email like $1 AND confirmed = false ORDER BY appointment_date",[user.email],App,function(err,results){
		callback(err,user,results);
	});

}


User.prototype.confirmedAppointments = function(user,pending,callback){
	
helper.dbCallAllRows("select appointment_date, to_char(start_time,'HH12:MI:SS:am') as start_time, to_char(end_time, 'HH12:MI:SS:am') as end_time FROM appointments WHERE appointment_id in (select appointment_id from users_appointments_join where user_id = $1) ORDER BY appointment_date", [parseInt(user.userId)],App,function(err,results){
	callback(null,{pendingAppointments: pending, confirmedAppointments: results});
});

}


User.prototype.isAdmin = function(){
	return this.admin === true;
}


User.prototype.authenticate = function(password){
	return this.password === password;
}

User.prototype.bookAppointment = function(appointmentId,cb){
	var userId = this.userId;
	var query = 'INSERT INTO users_appointments_join (user_id, appointment_id, created_at) VALUES($1,$2,to_timestamp($3)'
	var params = [parseInt(userId),parseInt(appointmentId)]

	helper.dbCall(query,params,function(err,results){
		if(err){
			cb(err);
		}else{
			cb();
		}
	});
}



module.exports = User;