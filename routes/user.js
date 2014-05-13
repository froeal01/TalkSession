var User = require('../models/user.js');

exports.index = function(req,res){
	User.getClientDash(req.session.userId, function(err,results){
		 res.render('users/index.ejs',{dashInfo:results});
	});
}