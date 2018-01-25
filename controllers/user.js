var User = require('../models/userModel');

// 注册
exports.showSignup = function(req, res) {
  res.render('signup', { 
    title: '注册页面'
  }); 
};

// 登录
exports.showSignin = function(req, res) {
  res.render('signin', { 
    title: '登录页面'
  }); 
};

// 用户列表
exports.list = function(req, res) {
  User.find({}).exec(function(err,users) {
      if (err) {
        console.log(err)
      }else{
        res.render('userlist', { 
          title: '用户列表页',
          users:users
        }); 
      }
  })
};

// 注册
exports.signup = function(req, res) {
  var _user = {name:req.body.name, password:req.body.password}; 
  User.findOne({name:_user.name},function(err,user) {
    if (err) {
      return console.log(err)
    }
    if (user) {
      return res.redirect('/signin')
    }else{
      var user = new User(_user);
      user.save(function(err,user) {
        if (err) {return console.log(err)}
        res.redirect('/')
      })
    }
  })
};

// 登录
exports.signin = function(req, res) {
  var _user = {name:req.body.name, password:req.body.password};
  var name = _user.name;
  var password = _user.password;
  User.findOne({name:name},function(err,user) {
    if (err) {return console.log(err)}
    if (!user) {
      return res.redirect('/signup')
    }else{
      user.comparePassword(password,function(err,isMatch) {
        if (err) {return console.log(err)}
        if (isMatch) {
          req.session.user = user;
          return res.redirect('/')
        }else{
          return res.redirect('/signin')
          console.log('密码不正确')
        }
      })
    }
  })
};

// 登出
exports.logout = function(req, res) {
  delete req.session.user;
  // delete res.session.user;
  res.redirect('/')
};

// midware for user
// 登录中间件（必须先登录）
exports.signinRequired = function(req, res, next) {
  var user = req.session.user;
  if (!user) {
    return res.redirect('/signin');
    console.log("还未登录，请先登录");
  }
  next()
};

// 管理员中间件（必须是管理员才有权限做后续操作）
exports.adminRequired = function(req, res, next) {
  var user = req.session.user;
  if (user.role <= 10) {
    console.log("你没有该权限");
    return res.redirect('/signin')
  }
  next()
};