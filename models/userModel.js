var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
mongoose.Promise = global.Promise;
var SALT_WORK_FACTORY = 10;

// 创建一个数据库连接
mongoose.connect('mongodb://localhost/userdb');

// 连接成功
mongoose.connection.on('connected', function () {
    console.log('数据库连接成功');
});

// 连接异常
mongoose.connection.on('error',function (err) {
    console.log('数据库连接出现错误，错误为：'+ err);
});

// 连接断开
mongoose.connection.on('disconnected', function () {
    console.log('数据库连接断开');
});

// 定义一个Schema
var UserSchema = new mongoose.Schema({
	name:{
        unique:true,
        type:String
    },
    password:String,
    // 权限 0(normal) 1(verified) 2(professonal) >10(admin) >50(super admin)
    role:{
        type:Number,
        default:0
    },
    meta:{
        createAt:{
            type:Date,
            default:Date.now()
        },
        updateAt:{
            type:Date,
            default:Date.now()
        }
    }
});

UserSchema.methods = {
    comparePassword:function(_password,cb) {
        bcrypt.compare(_password,this.password,function(err,isMatch) {
            if (err) {return cb(err)}
            cb(null,isMatch)    
        })
    }
}

UserSchema.pre('save',function(next) {
    var user = this;
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now()
    }else{
        this.meta.updateAt = Date.now()
    }

    bcrypt.genSalt(SALT_WORK_FACTORY,function(err,salt) {
        if (err) {
            next(err);
        }else{
            bcrypt.hash(user.password,salt,function(err,hash) {
                if (err) {return next(err)}
                user.password = hash;
                next()
            })
        }
    });
});

// 将该Schema发布为Model
var User = mongoose.model('User',UserSchema);

module.exports = User;