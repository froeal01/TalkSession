var pg = require('pg');
var config = require('../config')

var Appointment = function(args){
	this.appointmentId = args.appointment_id;
	this.appointmentDate = args.appointment_date;
	this.startTime = args.start_time;
	this.endTime = args.end_time;
	this.createdBy = args.created_by;
	this.clientName = args.client_name;
	this.clientEmail = args.client_email;
	this.confirmed = args.confirmed;
	this.booked = args.booked;
	this.createdAt = args.created_at;
	this.modifiedAt = args.modified_at;
}

Appointment.create = function(dates,times,creatorId,cb){
	var errors = new Array()
 pg.connect(config.dbString, function(err,client,done){
 	if(err){
 		throw err; //toDo work on handlingerrors//
 	}
// begin looping through date Array
	dates.forEach(function(date){
 		//nested loop- times array
 		times.forEach(function(time){
     var startTime = /^(\d+:\d+)/.exec(time)
     var endTime = /(\d+:\d+)$/.exec(time)
     client.query('INSERT INTO appointments (appointment_date, start_time, end_time, created_by, created_at, modified_at) VALUES($1,$2,$3,$4,to_timestamp($5),to_timestamp($6))',[date,startTime[0],endTime[0],parseInt(creatorId), Date.now(),Date.now()],function(err, results){
     	if(err){
     		errors.push(err);
     	}
     });
 			
 		});

	});
	done(); //check why this is not closing connection

 });
 if (errors.length > 0){
 	cb(errors,"failure");
 } else{
 	cb(null,"success");
 }
}

Appointment.showDailyTimes = function (date, cb){
	pg.connect(config.dbString, function(err,client,done){
		if(err){
			throw(err);//handleError better
		}
		client.query("select appointment_date, to_char(start_time,'HH12:MI:SS:am') as start_time, to_char(end_time, 'HH12:MI:SS:am') as end_time from appointments where appointment_date = $1",[date],function(err,results){
			done();
			if(err){
				throw(err);//handleError better
			}
			var values = results.rows.map(function(values){return values;})
			cb(null,values);
		});
	});
}


Appointment.monthlyTimes = function(cb){
	pg.connect(config.dbString, function(err,client,done){
		if(err){
			throw(err); //handleError better
		}
		client.query("select date_trunc('day',appointment_date) as appointment_date2, count(*) from appointments group by appointment_date2 order by appointment_date2",[],function(err,results){
			done();
			if(err){
				throw(err); //handleError better
			}
			var values = results.rows.map(function(values){return values;})
			cb(null,values);
		});
	})
}


Appointment.getDailySchedule = function(adminId, cb){
 var date = today();
 pg.connect(config.dbString, function(err,client,done){
 	if(err){
 		throw(err); //handleError better
 	}
 	client.query('select * from appointments where appointment_date = $1 AND created_by = $2', [date,parseInt(adminId)], function(err,results){
 		done();
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

module.exports = Appointment;