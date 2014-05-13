var User = require('../models/user.js')

exports.create = function (req, res){
	
	User.findOne(req.body.email, function (err,user){
		if (user && user.authenticate(req.body.password)){

			req.session.userId = user.userId;
			user.admin ? res.redirect('/admins/home') : res.redirect('/events');
		} else if (user){

			res.render('index',{error: "Wrong email or password"});
		} else {
			err = err || "User not Found";
			res.render('index',{error:err});
		}
	});

};


exports.delete = function (req,res){
	req.session = null;
	res.redirect('/'); //show message on index
}