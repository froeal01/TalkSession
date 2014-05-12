var User = require('../models/user.js')

function loadAdmin(req, res, next){
	if(req.session.userId){
		User.findById(req.session.userId, function(err,user){
			if (user && user.isAdmin){
				req.currentUser = user;
				next();
			} else{
				res.redirect('/', {error: "You do not have permission for that page"});
			}
		});
	} else {
		res.redirect('/', {error: "Please Login"});
	}
}

module.exports = loadAdmin;

