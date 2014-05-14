var pg = require('pg');
var config = require('../../config');
var fs = require('fs');
var assert = require('assert');
var async = require('async');

assert(config.dbString.indexOf("test") != -1);

exports.clear = function(cb){
	async.parallel([
		function(callback){
			pg.connect(config.dbString, function(err,client,done){
				if(err){
					throw(err);
				}
				client.query('delete from users',[],function(err){
					done();
					if (err){
						callback(err);
					}
					callback(null);
				});
			});
		},
		function(callback){
			pg.connect(config.dbString, function(err,client,done){
				if(err){
					throw(err);
				}
				client.query('delete from users',[],function(err){
					done();
					if (err){
						callback(err);
					}
					callback(null);
				});
			});
		}

	],function(err){
		cb(err);
	});
}

exports.setup = function(name,cb){
pg.connect(config.dbString,function(err,client,done){


	var contents = fs.readFileSync('test/test_setup/' + name + '.sql').toString();
	client.query(contents,function(err,results){
		done();
		if(err){
			throw err;
		}
		cb();
	});
});
}