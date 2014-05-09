exports.index = function (req, res){
	res.render('events/index.ejs');
}

exports.show = function (req, res){
	res.render('events/show.ejs');
}