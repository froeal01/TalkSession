var config = {};

if (process.env.ENV === "TEST"){
	config.testString = "tcp://talksession:talksession@127.0.0.1:5432/test";
	config.dbString = "tcp://talksession:talksession@127.0.0.1:5432/test";
	console.log('this is a test');
} else{
	console.log("Not a test");
	config.dbString = "tcp://talksession:talksession@127.0.0.1:5432/talksession";
}

config.concurrency = 1

module.exports = config;
