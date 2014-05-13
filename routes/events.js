var Appointment = require('../models/appointment.js')

exports.index = function (req, res){
	res.render('events/index.ejs');
}

exports.show = function (req, res){
	res.render('events/show.ejs');
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

exports.dailyschedule = function(req,res){
	Appointment.getDailySchedule(req.session.userId,function(err,results){
		if(err){
			throw(err);
		}
		res.send({times:results});
	});
}