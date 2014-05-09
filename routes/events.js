exports.index = function (req, res){
	res.render('events/index.ejs');
}

exports.new = function (req, res){
	res.end();
}