var Comment = require('../models/commentModel');

// 提交评论
exports.save = function(req,res) {
	var _comment = {
		movie:req.body.movie,
		from:req.body.from,
		content:req.body.content,
		tid:req.body.tid,
		cid:req.body.cid
	};

	var movieId = _comment.movie;
	if (_comment.cid) { //回复他人评论
		Comment.findOne({_id:_comment.cid}).exec(function(err,comment) {
			var replay = {
				from:_comment.from,
				to:_comment.tid,
				content:_comment.content
			}
			comment.replay.push(replay);
			comment.save(function(err,comment) {
				if (err) {return console.log(err)}
				res.redirect('/movie/'+movieId);
			})
		})
	}else{ // 发表新评论
		var comment = new Comment(_comment);
		comment.save(function(err,comment) {
			if (err) {return console.log(err)}
			res.redirect('/movie/'+movieId);
		})
	}
}