//类，mongoose使用的类，用户类
var mongoose = require("mongoose");

//这个模型返回一个构造函数
var typeSchema = mongoose.Schema({
    "id" : Number,
    "name" : String,
    "mianji" : String,
    "chuangwei" : String,
    "zaocan" : String,
    "wangluo" : String,
    "dianshi" : String,
    "jiage" : String,
    "fangjiancount" : String,
    "shengyucount" : String
});

//根据schema创建模型！
var Type = mongoose.model("Type",typeSchema);

//暴露！
module.exports = Type;