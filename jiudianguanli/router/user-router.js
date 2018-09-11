var path = require("path");
var formidable = require("formidable");
var Userdingdan = require("../models/Userdingdan.js")
var User = require("../models/User.js")
var crypto = require("crypto");
var Hourse = require("../models/Hourse.js")
var Type = require("../models/type.js")
var fs = require("fs");
var url = require("url");

//用户页面--预定房间
exports.showUser = function(req,res){
    //使用这个页面需要登录！
    if(!(req.session.login && req.session.type == "user")){
        res.send("本页面需要登录，请<a href=/>登录</a>");
        return;
    }
    res.render("user",{
        "username" :   req.session.username
    });
}
//用户页面--添加订单
exports.AddUser = function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        Userdingdan.create({
            "jiage":fields.jiage,
            "zhengjianleixing" :fields.zhengjianleixing,
            "zhengjianhao" : fields.zhengjianhao,
            "xingming" : fields.xingming,
            "sex" : fields.sex,
            "fangjianhao" : fields.fangjianhao,
            "fangjianleixing" : fields.fangjianleixing,
            "username" :fields.username,
            "startdate":fields.startdate,
            "enddate": fields.enddate,
            "zt":fields.zt
        },function (err,result) {
                res.json({"results":1,"fangjianhao":fields.fangjianhao})
        })
    });
}
//用户页面--订单查询
exports.showUserDingdanChaxun = function(req,res){
    //使用这个页面需要登录！
    if(!(req.session.login && req.session.type == "user")){
        res.send("本页面需要登录，请<a href=/>登录</a>");
        return;
    }
    res.render("userDingdanChaxun",{
        "username" :   req.session.username
    });
}
//用户页面--用户订单
exports.showUserDingda = function(req,res){
    var username = req.params.username;
    Userdingdan.find({"username":username}).exec(function(err,results){
        res.json({
            "results" : results
        });
    });
}


//用户页面--修改密码
exports.showAdminXiugaiMima = function(req,res){
    res.sendFile(path.join(__dirname , "../views/adminXiugaiMima.html"));
}
//用户页面--修改密码提交
exports.ChangeAdminXiugaiMima = function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        //得到用户输入的表单数据，用户名和密码：
        var username = fields.username;
        var password = fields.password;
        var sha256 = crypto.createHash("sha256");
        password = sha256.update(password).digest("hex").toString();
        User.find({"username":username},function (err,results) {
            results[0].username = username;
            results[0].password = password;
            results[0].save(function (err,results) {
                res.json({"result":1})
            })
        })
    });
}


//管理员页面--所有用户
exports.AllAdminJiluChaxun = function (req,res) {
    var page = url.parse(req.url,true).query.page - 1 || 0;
    var pagesize = 5;
    Userdingdan.count({},function(err,count){
        Userdingdan.find({}).limit(pagesize).skip(pagesize * page).exec(function(err,results){
            res.json({
                "pageAmount" : Math.ceil(count / pagesize),
                "results" : results
            });
        });
    });
}
//管理员页面--条件查找
exports.searchname = function (req,res) {
    var name = req.params.name;
        Userdingdan.find({"xingming":name}).exec(function(err,results){
            res.json({
                "results" : results
            });
        });
}

//管理员页面--房间号查找
exports.searchfanghao = function (req,res) {
    var fangjianhao = req.params.fangjianhao;
    Userdingdan.find({"fangjianhao":fangjianhao}).exec(function(err,results){
        res.json({
            "results" : results
        });
    });
}

//管理员页面--退房
exports.dotuifang = function (req,res) {
    var fangjianhao = req.params.fangjianhao;
    //删除退房订单
    Userdingdan.find({"fangjianhao":fangjianhao}).exec(function(err,results){
        results[0].remove(function (err,results) {
            res.json("退房成功")
        })
    });

    //房间管理-- 状态（未入住）
    Hourse.find({"fangjianhao":fangjianhao}).exec(function(err,results){
        results[0].fangjianhao = results[0].fangjianhao;
        results[0].leixing = results[0].leixing;
        results[0].weizhi = results[0].weizhi;
        results[0].miaoshu = results[0].miaoshu;
        results[0].zhuangtai = "未入住";
        results[0].save(function (err,result) {
        })
        //房间类型 --剩余房间个数++
        Type.find({"name":results[0].leixing}).exec(function(err,resu){
            resu[0].id = resu[0].id;
            resu[0].name = resu[0].name;
            resu[0].mianji = resu[0].mianji;
            resu[0].chuangwei = resu[0].chuangwei;
            resu[0].zaocan = resu[0].zaocan;
            resu[0].wangluo = resu[0].wangluo;
            resu[0].dianshi = resu[0].dianshi;
            resu[0].jiage = resu[0].jiage;
            resu[0].fangjiancount = resu[0].fangjiancount;
            var num = resu[0].shengyucount;
            num ++;
            resu[0].shengyucount = num;
            resu[0].save()
        });
    });


}

