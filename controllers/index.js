var Movie = require('../models/movieModel');
var Comment = require('../models/commentModel');
var Catetory = require('../models/catetoryModel');

// 首页电影列表
exports.index = function(req, res) {
  var _user = req.session.user;
  res.locals.user = _user;
  if(!_user){
    return res.redirect('/signin')
  }
  Catetory
  .find({})
  .populate({path:"movies",options:{limit:5}})
  .exec(function(err,catetories) {
    if (err) {
      console.log(err)
    }else{
      res.render('index', { 
        title: '首页',
        catetories:catetories
      })
    }
  })
}

// 电影详情
exports.movie = function(req, res) {
  var id = req.params.id;
  var _user = req.session.user;
  Movie.findOne({_id:id}).exec(function(err,movie) {
    // 更新访问次数（访客统计）
    Movie.update({_id:id},{$inc:{pv:1}},function(err) {
      if(err){console.log(err)} 
    });
    Comment
    .find({movie:id})
    .populate('from','name')  // 查询关联的用户的数据 *************
    .populate('replay.from replay.to','name')
    .exec(function(err,comments) {
      if (err) {
        console.log(err)
      }else{
        res.render('detail', { 
          title: '详情页',
          movie:movie,
          user:_user,
          comments:comments
        }); 
      }  
    })
  })
};

// 分类分页及搜索
exports.search = function(req, res) {
  var catId = req.query.cat;
  var q = req.query.q;
  var count = 2;  // 每页条数
  var page = parseInt(req.query.page,10) || 0;
  var index = page*count;

  if (catId) { // 分页
    Catetory
    .find({_id:catId})
    .populate({path:"movies",select:"title poster",ptions:{limit:2,skip:index}})
    .exec(function(err,catetories) {
      if (err) {
        console.log(err)
      }else{
        var catetory = catetories[0] || {};
        var movies = catetory.movies || [];
        var results = movies.slice(index,index+count);
        res.render('results', { 
          title: '结果列表页面',
          keyword:catetory.name,
          currentPage:+page+1,
          query:"cat="+catId,
          totalPage:Math.ceil(movies.length/count),
          movies:results
        })
      }
    })
  }else{  // 搜索
    Movie
    .find({title:new RegExp(q+'.*','i')})
    .exec(function(err,movies) {
      if (err) {
        console.log(err)
      }else{
        var results = movies.slice(index,index+count);
        res.render('results', { 
          title: '搜索结果',
          keyword:q,
          currentPage:+page+1,
          totalPage:Math.ceil(movies.length/count),
          query:"q="+q,
          movies:results
        })
      }
    })
  }
}