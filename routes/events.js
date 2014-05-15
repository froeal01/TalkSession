var Appointment = require('../models/appointment.js')


exports.show = function (req, res){
	Appointment.showDailyTimes(req.params.date,function(err,results){
		if(err){
			throw(err);
		}
		res.render('events/show.ejs', {availableTimes : results, date : req.params.date});
	});
}

exports.new = function(req, res){
	res.render('events/new');
}

exports.create = function(req,res){
	Appointment.create(req.body.dates, req.body.times, req.session.userId, function(err,status){
		if(err){
			res.send({error:err,message:status});
		} else {
			res.send({message:status});
		}
	});
}

exports.update = function(req,res){
	Appointment.update(req.body.id,req.session.userId,function(err,message){
		if(err){
			throw(err);
		}
		res.redirect('/home');
	});
}

exports.dailyschedule = function(req,res){
	Appointment.getDailySchedule(req.session.userId,function(err,results){
		if(err){
			throw(err);
		}
		res.send({times:results});
	});
}

exports.monthlyslots = function (req,res){
	Appointment.monthlyTimes(function(error,results){
		res.send({openings:results});
	});
}

exports.decline = function(req,res){
	Appointment.declineAppointment(req.body.data, function(err,results){
		if(err){
			res.send({message: "Something Went Wrong!"});
		}
		res.send();
	});
}

exports.accept = function(req,res){
	Appointment.acceptAppointment(req.body.data, function(err,results){
		if(err){
			res.send({message: "Something Went Wrong!"});
			res.end();
		}
		res.send();
	})
}







