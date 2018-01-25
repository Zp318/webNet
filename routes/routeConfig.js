var express = require('express');
var router = express.Router();
var Index = require('../controllers/index.js');
var User = require('../controllers/user.js');
var Movie = require('../controllers/movie.js');
var Comment = require('../controllers/comment.js');
var Catetory = require('../controllers/catetory.js');

// 首页
router.get('/', Index.index);
router.get('/movie/:id', Index.movie);

// 用户管理
// 中间件控制登录和权限
// router.get('/admin/user/list', User.signinRequired, User.adminRequired, User.list);
router.get('/admin/user/list', User.signinRequired, User.list);
router.post('/user/signup', User.signup);
router.post('/user/signin', User.signin);
router.get('/signin', User.showSignin);
router.get('/signup', User.showSignup);
router.get('/logout', User.logout);

//电影管理 
// router.get('/admin/movie', User.signinRequired, User.adminRequired, Movie.typing);
// router.get('/admin/movie/update', User.signinRequired, User.adminRequired, Movie.update);
// router.post('/admin/movie/new', User.signinRequired, User.adminRequired, Movie.savePoster, Movie.new)
// router.get('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.list);
// router.get('/admin/movie/delete', User.signinRequired, User.adminRequired, Movie.delete);
router.get('/admin/movie', Movie.typing);
router.get('/admin/movie/update', Movie.update);
router.post('/admin/movie/new', Movie.savePoster, Movie.new)
router.get('/admin/movie/list', Movie.list);
router.get('/admin/movie/delete', Movie.delete);


// 评论
router.post('/user/comment', User.signinRequired, Comment.save);

// 分类
// router.get('/admin/catetory/new', User.signinRequired, User.adminRequired, Catetory.new);
// router.post('/admin/catetory', User.signinRequired, User.adminRequired, Catetory.save)
// router.get('/admin/catetory/list', User.signinRequired, User.adminRequired, Catetory.list);
router.get('/admin/catetory/new', Catetory.new);
router.post('/admin/catetory', Catetory.save)
router.get('/admin/catetory/list', Catetory.list);

// 分类列表分页及搜索
router.get('/results', Index.search);

module.exports = router;