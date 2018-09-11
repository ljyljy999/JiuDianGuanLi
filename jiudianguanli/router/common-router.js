//本文件就是roter，是控制器
var path = require("path");
var formidable = require("formidable");
var Admin = require("../models/Admin.js")//管理员
var User = require("../models/User.js");//注册的用户
var crypto = require("crypto");
var url = require('url');


//显示首页，就是/这个路由，它有两个作用，如果学生用户登录了，显示选课表单了，如果没有登录，就显示登录界面
exports.showIndex = function(req,res){
    if(req.session.login && req.session.type == "user"){
        //登录成功要做的业务
        res.render("user",{
            "username" :   req.session.username
        });
    }else{
        //呈递没有登录表单
        res.sendFile(path.join(__dirname , "../views/index.html"));
    }
}

//验证登录
exports.checklogin = function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        //得到用户输入的表单数据，用户名和密码：
        var username = fields.username;
        var password = fields.password;
        var sha256 = crypto.createHash("sha256");
        password = sha256.update(password).digest("hex").toString();

        if(err){
            //-1表示数据库错误
            res.json({"result":-1});
            return;
        }

        if(!username || !password){
            console.log(-3);
            //-4表示没有填写
            res.json({"result":-4});
            return;
        }

        //根据用户输入的用户名是不是admin来判断是用户还是管理员
        if(username == "admin"){
            Admin.find({"username":username,"password":password},function (err,result) {
                if(result.length == 1){
                    req.session.username = username;
                    req.session.type = "admin";
                    req.session.login = true;
                    res.json({"result":1 , "type" : "admin"});
                    return;
                }else if(result.length == 0){
                    res.json({"result":-2});
                    return;
                }
            })
        }else{
            User.find({"username":username,"password":password},function (err,result) {
                if(err){
                    res.json({"result":-1});
                    return;
                }
                if(result.length == 1){
                    req.session.username = username;
                    req.session.type = "user";
                    req.session.login = true;
                    res.json({"result":1 , "type" : "user"});
                    return;
                }else if(result.length == 0){
                    res.json({"result":-2});
                    return;
                }
            })
        }
    });
}

//显示404
exports.show404 = function(req,res){
    res.status(404).send("没有这个页面，请检查网址！");
}


//退出
exports.tuichu = function (req,res) {
    if( req.session.login){
        req.session.type = null;
        req.session.login = false;
        res.redirect('/');
    }
}

//显示注册
exports.showReg = function (req,res) {
    if(req.session.login && req.session.type == "student"){
        //登录成功要做的业务
        res.render("xuanke",{
            "xingming" : req.session.xingming,
            "xuehao" : req.session.xuehao,
            "grade" : req.session.grade
        });
    }else{
        //呈递没有登录表单
        res.sendFile(path.join(__dirname , "../views/reg.html"));
    }
}

//判断用户名是否重复
exports.checkUsername = function(req,res){
    var username = url.parse(req.url,true).query.username;
    User.find({"username":username},function (err,result) {
        if(result.length == 1){
            res.json({"result":1});
            return;
        }else if(result.length == 0){
            res.json({"result":-1});
            return;
        }
    })
}

//注册
exports.doReg = function (req,res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        //得到用户输入的表单数据，用户名和密码：
        var username = fields.username;
        var password = fields.password;
        //加密密码
        var sha256 = crypto.createHash("sha256");
        password = sha256.update(password).digest("hex").toString();
        User.create({"username":username,"password":password},function (err,result) {
            res.json({"result":1})
        })


    })
}