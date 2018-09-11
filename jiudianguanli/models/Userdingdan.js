//类，mongoose使用的类，用户类
var mongoose = require("mongoose");

//这个模型返回一个构造函数
var userdingdanSchema = mongoose.Schema({
    "jiage":String,
    "zhengjianleixing" : String,
    "zhengjianhao" : String,
    "xingming" : String,
    "sex" : String,
    "fangjianhao" : String,
    "fangjianleixing" : String,
    "username" : String,
    "startdate":String,
    "enddate":String,
    "zt":String
});

//根据schema创建模型！
var Userdingdan = mongoose.model("Userdingdan",userdingdanSchema);

//暴露！
module.exports = Userdingdan;