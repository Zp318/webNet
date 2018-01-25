var Movie = require('../models/movieModel');
var Catetory = require('../models/catetoryModel');
var _ = require('underscore');
var fs = require('fs');
var path = require('path');

// 电影录入页面
exports.typing = function(req, res, next) {
  Catetory.find({}).exec(function(err,catetories) {
    res.render('admin', { 
      title: '后台录入页',
      catetories:catetories,
      movie:{} 
    });
  })
};

// 修改电影信息页面
exports.update = function(req, res) {
  // 修改的电影的id
  var id = req.query.id;
  if (id) {
    Movie.findOne({_id:id}).exec(function(err,movie) {
      Catetory.find({}).exec(function(err,catetories) {
        if (err) {
          console.log(err)
        } else {
          res.render('admin',{ 
            title: '后台更新页',
            movie:movie,
            catetories:catetories
          })
        }
      })
    })  
  }
};

// 录入新电影页面
exports.new = function(req,res) {
    var movieObj =req.body.movie;
    // 是已有电影的修改还是新增电影
    var id = movieObj._id;
    var _movie;

    // 如果req.poster存在，更新海报为上传的poster
    if (req.poster) {
      movieObj.poster = req.poster;
    }

    if(id){
        Movie.findOne({_id:id}).exec(function (err, movie) {
            if (err){
                console.log(err)
            }
            _movie=_.extend(movie,movieObj);
            _movie.save(function (err, movie) {
                if(err){
                    console.log(err)
                }
                res.redirect('/movie/'+movie._id);
            })
        })
    }else {
        _movie=new Movie(movieObj);
        var catetoryId = _movie.catetory;
        _movie.save(function (err, movie) {
            if(err){
                console.log(err)
            }
            Catetory.findOne({_id:catetoryId}).exec(function(err,catetory) {
              catetory.movies.push(movie._id);
              catetory.save(function(err,catetory) {
                res.redirect('/movie/'+movie._id);
              })
            })
        })
    }

};

// 报存新上传海报
exports.savePoster = function(req,res,next) {
  var posterData = req.files.uploadPoster;
  var filePath = posterData.path;
  var originalFilename = posterData.originalFilename;
  if (originalFilename) {
    fs.readFile(filePath, function(err, data) {
      var timestamp = Date.now();
      var type = posterData.type.split('/')[1];
      var poster = timestamp + '.' + type;
      var newPath = path.join(__dirname, '../../', '/public/upload/' + poster);
      fs.writeFile(newPath, data, function(err) {
        req.poster = poster;
        next()
      })
    })
  }else {
    next()
  }
} 

// 电影列表页面
exports.list = function(req, res) {
  Movie
  .find({})
  .populate('catetory', 'name') // 查找关联数据库catetory中的分类名
  .exec(function(err,movies) {
      if (err) {
        console.log(err)
      }else{
        res.render('list', { 
          title: '列表页',
          movies:movies
        }); 
      }
  })
};

// 删除电影
exports.delete = function(req, res) {
  var id = req.query.id;
  if (id) {
    Movie.findOne({_id:id},function(err,movie) {
      if (err) {
        console.log(err)
      }else{
        movie.remove();
      }
    })
    res.redirect('/admin/movie/list');
  }
};