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
	
	helper.dbCallAllRows("select * FROM(SELECT DISTINCT ON(client_email) client_name, to_char(appointment_date, 'Day, Month DD YYYY') as appointment_date, to_char(start_time,'HH12:MI:SS:am') as start_time, to_char(end_time,'HH12:MI:SS:am') as end_time " +  
		"FROM appointments WHERE appointment_date >= now() AND confirmed = true ORDER BY client_email, appointment_date desc) AS aptdates " + 
    "ORDER BY appointment_date desc",[],App,function(err,confirmed){
		  	callback(err,confirmed);
		  });
}


function getAppointmentsNeedingConfirm(adminId,callback){
	helper.dbCallAllRows("select to_char(appointment_date,'Day, Month DD YYYY') as appointment_date, client_name, to_char(start_time, 'HH12:MI:SS:am') as start_time,to_char(end_time, 'HH12:MI:SS:am') as end_time, appointment_id from appointments WHERE created_by = $1 AND booked = true AND confirmed = false",[parseInt(adminId)], App, function(err,pending){
		callback(err,pending);
	});
}

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

	helper.dbCallAllRows("select to_char(appointment_date,'Day, Month DD YYYY') as appointment_date, to_char(start_time,'HH12:MI:SS:am') as start_time, to_char(end_time, 'HH12:MI:SS:am') as end_time from appointments WHERE client_email like $1 AND confirmed = false ORDER BY appointment_date",[user.email],App,function(err,results){
		callback(err,user,results);
	});

}


User.prototype.confirmedAppointments = function(user,pending,callback){
	
helper.dbCallAllRows("select to_char(appointment_date,'Day, Month DD YYYY') as appointment_date, to_char(start_time,'HH12:MI:SS:am') as start_time, to_char(end_time, 'HH12:MI:SS:am') as end_time FROM appointments WHERE appointment_id in (select appointment_id from users_appointments_join where user_id = $1) AND appointment_date >= now() ORDER BY appointment_date asc", [parseInt(user.userId)],App,function(err,results){
	callback(err,{pendingAppointments: pending, confirmedAppointments: results});
});

}


User.prototype.isAdmin = function(){
	return this.admin === true;
}


User.prototype.authenticate = function(password){
	return this.password === password;
}

User.prototype.bookAppointment = function(appointmentId,callback){
	var userId = this.userId;
	helper.dbCall('INSERT INTO users_appointments_join (user_id, appointment_id, created_at) VALUES($1,$2,to_timestamp($3))',[parseInt(userId),parseInt(appointmentId),Date.now()],function(err,results){
		callback(err,results)
	});
}



module.exports = User;