var User = require('../models/user.js');

exports.home = function (req, res){
	 res.render('admins/home');
}