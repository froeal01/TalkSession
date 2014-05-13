var User = require('../models/user.js')

function loadUser(req, res, next){
	if(req.session.userId){
		User.findById(req.session.userId, function(err,user){
			if (user){
				req.currentUser = user;
				next();
			} else{
				res.redirect('/');
			}
		});
	} else {
		res.redirect('/');
	}
}

module.exports = loadUser;

