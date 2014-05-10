var pg = require('pg');
var config = require('../config')


var User = function(arg){
	this.email = arg.email;
	this.password = arg.password;
	this.userId = arg.user_id;
}

User.findOne = function(email, cb){
	pg.connect(config.dbString, function (err, client, done){
		if(err){
			throw err;
		}
		client.query("select * from users where email like $1",[email], function(err,results){
			done();

			if (err) {
				throw err;
			} else if(results.rowCount > 0){
				cb(null, new User(results.rows[0]));
			}
			else{
				cb(null);
			}

		});
	
	});

}

User.prototype.authenticate = function(password){
	return this.password === password;
}



module.exports = User;