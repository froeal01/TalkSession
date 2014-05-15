var assert = require("assert");
var rewire = require('rewire');
var Appointment = rewire('../models/appointment');
var async = require('async');
var sinon = require('sinon');
var db = require('./test_setup/setup.js');


before(function(done){
	db.clear(function(){
		db.setup('user',function(){
			db.setup('appointment',done)
		});
	});
});

var appointment1 {
	appointmentDate: '2014-05-14',
	startTime: '14:00',
	endTime:'14:45',
	created_by: 1,
	booked: false,
	confirmed: false,
	created_at: '2014-05-14',
	modified_at: '2014-05-14'
}

var appointment2 {
	appointmentDate: '2014-05-25',
	startTime: '14:00',
	endTime:'14:45',
	created_by: 1,
	booked: true,
	clientName: 'mr.client',
	clientEmail: 'client@email.com',
	confirmed: true,
	created_at: '2014-05-14',
	modified_at: '2014-05-14'
}




describe ("create appointment",function(){

	it("saves an appointment when date and time is supplied",function(){
		Appointment.create('2014-05-15','10:00 - 10:45',function(err,results){
			assert(!err);
		});
	});
	it( "does not save an appointment when date is no supplied",function(){
		Appointment.create(null,'10:00 - 10:45',function(err,results){
			assert(err);
		});
	})
});


describe ('loading from database',function(){
	it("loads todays appointment if created by admin and booked/confirmed true",function(){
		Appointment.getDailySchedule(1,'2014-05-20',function(err,results){
			assert(!err);
			assert(results);
			assert(results.length == 1);
		});
	});
	it('loads empty slots for client calendar',function(){
		Appointment.monthlyTimes(function(err,results){
			assert(!err);
			assert(results);
			assert(results.length == 1);
		})
	});
})





