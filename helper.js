var config = ('./config');
var pg = ('pg');


var handleError = function(err,cb,done){
	if(done){done();}
	cb(err);
};
module.exports.handlerError = handleError;

var dbCall = module.exports.dbCall = function(query,parameters,cb){
	pg.connect(config.dbString, function(err,client,done){
		if(err){
			return handleError(err,cb,done);
		}
		client.query(query,parameters,function(err,results){
			done();
			if (err){
				return handleError(err,cb);
			}
			cb(null,results);
		});
	});
}

module.exports.dbCallFirstRow = function(query,parameters,Object,cb){
	dbCall(query,parameters,function(err,results){
		if(err){
			return handleError(err,cb);
		} else if (results.rowCount > 0){
			cb(null,new Object(results.rows[0]));
		} else {
			cb(null)l
		}
	});
}