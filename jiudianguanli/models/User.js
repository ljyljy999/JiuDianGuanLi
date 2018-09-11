//类，mongoose使用的类，用户类
var mongoose = require("mongoose");

//这个模型返回一个构造函数
var userSchema = mongoose.Schema({
    "username" : String,
    "password" : String
});

//根据schema创建模型！
var User = mongoose.model("User",userSchema);

//暴露！
module.exports = User;