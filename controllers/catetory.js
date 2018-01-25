var Catetory = require('../models/catetoryModel');

// 录入分类页面
exports.new = function(req,res) {
	res.render('catetory_admin',{
		title:"后台分类录入页",
		catetory:{}
	})
}

// 提交新的分类
exports.save = function(req,res) {
	var _catetory = {name:req.body.name};
	var catetory = new Catetory(_catetory);
	
	catetory.save(function(err,catetory) {
		if (err) {return console.log(err)}
		res.redirect('/admin/catetory/list')
	})
}

// 分类列表
exports.list = function(req, res) {
	Catetory.find({}).exec(function(err,catetories) {
	    if (err) {
	        console.log(err)
	    }else{
	        res.render('catetorylist', { 
	          title: '分类列表页',
	          catetories:catetories
	        }); 
	    }
	})
};