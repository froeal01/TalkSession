var pg = require('pg');
var config = require('../config')
var async = require('async')
var Appointment = require('./appointment.js')


var User = function(arg){
	this.email = arg.email;
	this.password = arg.password;
	this.firstName = arg.first_name;
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
			getClientConfirmedAppointment(adminId, function(err,confirmed){
				if(err){
					callback(err);
				}
				callback(null,confirmed);
			});
			
		},
		appointmentConfirms: function(callback){
			getAppointmentsNeedingConfirm(adminId,function(err,pending){
				if(err){
					callback(err);
				}
				callback(null,pending)
			});
		}
	}, 
	function(err,results){
		if(err){
			cb(err,null);
		}
		cb(null,results);
	}); 
}

function getClientConfirmedAppointment(adminId,cb){
	pg.connect(config.dbString, function(err,client,done){
		if(err){
			throw(err) //handle me
		}
		client.query('select DISTINCT ON(client_email)  MIN(appointment_date) ' +
		 'as appointment_date,start_time,end_time,client_name,client_email from appointments '+
		  'WHERE appointment_date >= current_date  AND end_time <= current_time AND confirmed = true ' +
		  'GROUP BY client_email,start_time,end_time,client_name,appointment_date '+
		   'ORDER BY client_email, abs(current_date - appointment_date) asc',[],function(err,results){
		   	done();
		   	if(err){
		   		throw(err);
		   	}
		   	if(results.rowCount > 0){
			   	var confirmed = results.rows.map(function(result){return result});
			   	cb(null,confirmed);
		   	} else{
		   		cb(null,results);
		   	}
		   });
	});
}

function getAppointmentsNeedingConfirm(adminId,cb){
	pg.connect(config.dbString, function(err,client,done){
		if(err){
			throw(err);
		}
		client.query('select * from appointments WHERE created_by = $1 AND booked = true AND confirmed = false',[parseInt(adminId)],function(err,results){
			done();
			if(err){
				throw(err);
			}
			if (results.rowCount > 0){
				var pending = results.rows.map(function(result){return result});
				cb(null,pending);
			}else{
				cb(null,results)
			}
		});
	});
}

User.getClientDash = function(userId,cb){
	async.waterfall([
		function(callback){
			User.findById(userId, function(err,user){
				if(err){
					callback(err);
				}
				callback(null,user);
			});
		},
		function(user,callback){
			user.pendingAppointments(function(err,pending){
				if(err){
					callback(err);
				}
				callback(null,user,pending);
			})
		},
		function(user,pending,callback){
			user.confirmedAppointments(user,function(err,confirmed){
				if(err){
					callback(err);
				}
				callback(null,{pendingAppointments: pending, confirmedAppointments: confirmed});
			});
		}

		], function(err,results){
			cb(err,results);
		});
}

User.prototype.pendingAppointments = function(cb){
	var user = this;
	pg.connect(config.dbString, function(err,client,done){
		if (err){
			throw(err);
		}
		client.query("select appointment_date, to_char(start_time,'HH12:MI:SS:am') as start_time, to_char(end_time, 'HH12:MI:SS:am') as end_time from appointments WHERE client_email like $1 AND confirmed = false ORDER BY appointment_date",[user.email],function(err,results){
			done();
			if (err){
				throw(err);
			}
			if (results.rowCount > 0){
			
				var pending = results.rows.map(function(result){return result});
				cb(null,pending);
			} else{
				cb(null,"No Appointments Pending");
			}
		});
	});
}

User.prototype.confirmedAppointments = function(user,cb){
	pg.connect(config.dbString, function(err,client,done){
		done();
		if(err){
			throw(err);
		}
		client.query("select appointment_date, to_char(start_time,'HH12:MI:SS:am') as start_time, to_char(end_time, 'HH12:MI:SS:am') as end_time FROM appointments WHERE appointment_id in (select appointment_id from users_appointments_join where user_id = $1) ORDER BY appointment_date", [parseInt(user.userId)],function(err,results){
			if(err){
				throw(err);
			}
			if(results.rowCount > 0){
				var confirmed = results.rows.map(function(result){return result});
				cb(null,confirmed);
			} else {
				cb(null, "No Confirmed Appointments");
			}
		});
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
	pg.connect(config.dbString, function(err,client,done){
		if(err){
			throw(err);
		}
		client.query('INSERT INTO users_appointments_join (user_id, appointment_id, created_at) VALUES($1,$2,to_timestamp($3)',[parseInt(userId),parseInt(appointmentId)], function(err,results){
			done();
			if (err){
				throw(err)
			}
			cb(null,results);
		});
	});
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