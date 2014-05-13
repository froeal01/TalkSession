var User = require('../models/user.js');
var async = require('async');

exports.home = function (req, res){
	 
	User.getAdminDashboard(req.session.userId,function(err,results){
	

	 res.render('admins/home',{dashboard: results});

	});
}