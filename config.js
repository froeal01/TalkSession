var config = {};

if (process.env.NODE_ENV === "TEST"){
	config.testString = "tcp://talksession:talksession@127.0.0.1:5432/test";
	config.dbString = "tcp://talksession:talksession@127.0.0.1:5432/test";
	console.log('this is a test');
} else if (process.env.NODE_ENV === 'production') {
	console.log('on heroku');
	config.dbString = 'postgres://bodaabkopnbvgp:-xEoWHkcCBpZSjMoEUe7_zIVMS@ec2-54-243-49-82.compute-1.amazonaws.com:5432/d86li98l0n5hoq'
	} else{
		console.log("Not a test");
		config.dbString = "tcp://talksession:talksession@127.0.0.1:5432/talksession";
	}
	
config.concurrency = 1
module.exports = config;
