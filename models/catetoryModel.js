var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

// 创建一个数据库连接
mongoose.connect('mongodb://localhost/catetorydb');

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
var CatetorySchema = new Schema({
    name:String,
    movies:[{type:ObjectId,ref:"Movie"}],
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

CatetorySchema.pre('save',function(next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now()
    }else{
        this.meta.updateAt = Date.now()
    }
    next();
});

CatetorySchema.statics = {
    fetch:function(cb) {
        return this.find({}).sort('meta.updateAt').exec(cb)
    },
    finById:function(id,cb) {
        return this.findOne({_id:id}).exec(cb)
    }
}

// 将该Schema发布为Model
var Catetory = mongoose.model('Catetory',CatetorySchema);

module.exports = Catetory;