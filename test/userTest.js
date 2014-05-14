var assert = require("assert");
var rewire = require('rewire');
var User = rewire('../models/user');
var async = require('async');
var sinon = require('sinon');
var db = require('./test_setup/setup.js');

before(function(done){
	db.clear(function(){
		db.setup('user',done);
	});
});

var user_admin = {
 email: 'admin@email.com',
 first_name: "mr.admin",
 admin: true,
 password: 'password',
 created_at: Date.now(),
 modified_at: Date.now()

};
var user_client = {
 email: 'client@email.com',
 first_name: "mrs.client",
 password: 'password',
 created_at: Date.now(),
 modified_at: Date.now()

};

var user_invalid = {
	email: 'clientemail.com',
 first_name: "mrs.client",
 created_at: Date.now(),
 modified_at: Date.now()
};

var users = [
	new User(user_admin),
	new User(user_client)
];


function setDbStub(stub){
	assert(stub);

	User.__set__("User",{

		findOne: stub,
		findById: stub,

	});
}

beforeEach(function(){

	User = rewire('../models/user');

});

describe('User Stub', function(){

	it('Has a new User rewired',function(){
		assert(User.findOne);
	});

	it('Can be initialized', function(){
		var user = new User(user_admin);
		assert(user);
	});
});

// describe('Validates User Info',function(){
// 	var admin = new User(user_admin);
// 	var client = new User(user_client);
// 	var invalid = new User(user_invalid);
// 	it('creates a user with valid informat',function(){
		
// 		assert(admin.email = user_admin.email);
// 	});
// 	it('assigns false as default to admin',function(){
// 		assert(client.admin = false);
// 	});
// 	it('does not create user with invalid information',function(){
// 		assert.fail('email required')
// 	});
// });



describe('finding by email',function(){
	
	it('returns one valid user',function(done){
		var user = new User(user_admin);
		User.findOne( 'admin@email.com', function(err,results){
			if(err) done(err);
			assert.equal(results.rowCount == 1);
			done();			
		});
	});
});

describe('find by Id',function(){

	it('returns only one user',function(){
		var user = new User(user_admin);
		User.findById(1,function(err,results){
			console.log(err);
			console.log(results);
			if(err) return cb(err);
			assert.equal(results.rowCount == 1);
			cb();
		});
	});
});






