var path = require("path");
var formidable = require("formidable");
var Hourse = require("../models/Hourse.js")
var Type = require("../models/type.js")
var Userdingdan = require("../models/Userdingdan.js")
var url = require("url");

//管理员面板--房类管理
exports.showAdmin = function(req,res){
    //使用这个页面需要登录！
    if(!(req.session.login && req.session.type == "admin")){
       res.send("本页面需要登录，请<a href=/>登录</a>");
       return;
    }
    res.sendFile(path.join(__dirname , "../views/admin.html"));
}
//管理员页面--所有房类管理
exports.AllAdmin = function(req,res){
    var page = url.parse(req.url,true).query.page - 1 || 0;
    var pagesize = 5;
    //寻找条目总数
    Type.count({},function(err,count){
        Type.find({}).limit(pagesize).skip(pagesize * page).exec(function(err,results){
            res.json({
                "pageAmount" : Math.ceil(count / pagesize),
                "results" : results
            });
        });
    });

}
//管理员页面--所有房类管理
exports.AllLeiBieAdmin = function(req,res){
        Type.find({}).exec(function(err,results){
            res.json({
                "results" : results
            });
        });
}
//管理员面板--添加房类管理
exports.AddAdmin = function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        Type.create({
            "id" : fields.xuhao,
            "name" : fields.leibie,
            "mianji" : fields.mianji,
            "chuangwei" : fields.chuangweishu,
            "zaocan" : fields.zaocan,
            "wangluo" : fields.wangluo,
            "dianshi" : fields.dianshi,
            "jiage" : fields.jiage,
            "fangjiancount" : fields.fangjianshuliang,
            "shengyucount" : fields.fangjianshuliang
        },function (err,result) {
                res.redirect('/admin')
        })
    });
}
//管理员面板--删除房类管理
exports.delAdmin = function(req,res){
    var sid = req.params.sid;
    Type.find({"id" : sid},function(err,results){
        if(err || results.length == 0){
            res.json({"result" : -1});
            return;
        }

        //删除
        results[0].remove(function(err){
            if(err){
                res.json({"result" : -1});
                return;
            }

            res.json({"result" : 1});
        });
    });
}
//管理员面板---显示更改房类管理页
exports.updataAdmin = function(req,res){
    var sid = url.parse(req.url,true).query.sid;
    Type.find({"id":sid}).exec(function(err,results){
        res.json({
            "results" : results
        });
    });
}
//管理员页面--更改房类管理
exports.changeAdmin = function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        Type.find({"id":fields.id}).exec(function(err,results){
           results[0].id = fields.id;
           results[0].name = fields.name;
           results[0].mianji = fields.mianji;
           results[0].chuangwei = fields.chuangwei;
           results[0].zaocan = fields.zaocan;
           results[0].wangluo = fields.wangluo;
           results[0].dianshi = fields.dianshi;
           results[0].jiage = fields.jiage;
           results[0].fangjiancount = fields.fangjiancount;
           results[0].shengyucount = fields.shengyucount;
            results[0].save(function (err,result) {
                res.json("修改成功");
            })
        });
    });
}
//管理员页面--更改房类管理--剩余房间数
exports.changeAdminFangCount = function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        Type.find({"name":fields.leixing}).exec(function(err,results){
            results[0].id = results[0].id;
            results[0].name = results[0].name;
            results[0].mianji = results[0].mianji;
            results[0].chuangwei = results[0].chuangwei;
            results[0].zaocan = results[0].zaocan;
            results[0].wangluo = results[0].wangluo;
            results[0].dianshi = results[0].dianshi;
            results[0].jiage = results[0].jiage;
            results[0].fangjiancount = results[0].fangjiancount;
            var num = results[0].shengyucount;
            num --;
            results[0].shengyucount = num;
            results[0].save(function (err,result) {
                res.json("添加订单成功");
            })
        });
    });
}

//管理员页面--房间管理
exports.showAdminFangjianGuanli = function(req,res){
    //使用这个页面需要登录！
    if(!(req.session.login && req.session.type == "admin")){
        res.send("本页面需要登录，请<a href=/>登录</a>");
        return;
    }
    res.sendFile(path.join(__dirname , "../views/adminFangjianGuanli.html"));
}
//管理员页面--添加房间管理
exports.AddAdminFangjianGuanli = function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        Hourse.create({
            "fangjianhao" : fields.fangjianhao,
            "leixing" : fields.leibie,
            "weizhi" : fields.weizhi,
            "miaoshu" : fields.miaoshu,
            "zhuangtai" : fields.zhuangtai
        },function (err,result) {
            res.redirect('/admin/fangjianguanli')
        })
    });
}
//管理员页面--所有房间管理
exports.AllAdminFangjianGuanli = function(req,res){
    var page = url.parse(req.url,true).query.page - 1 || 0;
    var pagesize = 5;
    //寻找条目总数
    Hourse.count({},function(err,count){
        Hourse.find({}).limit(pagesize).skip(pagesize * page).exec(function(err,results){
            res.json({
                "pageAmount" : Math.ceil(count / pagesize),
                "results" : results
            });
        });
    });

}
//管理员面板--删除房间管理
exports.delAdminFangjianGuanli = function(req,res){
    var sid = req.params.sid;
    Hourse.find({"fangjianhao" : sid},function(err,results){
        if(err || results.length == 0){
            res.json({"result" : -1});
            return;
        }

        //删除
        results[0].remove(function(err){
            if(err){
                res.json({"result" : -1});
                return;
            }

            res.json({"result" : 1});
        });
    });
}
//管理员面板---显示更改房间管理页
exports.updataAdminFangjianGuanli = function(req,res){
    var sid = url.parse(req.url,true).query.sid;
    Hourse.find({"fangjianhao":sid}).exec(function(err,results){
        res.json({
            "results" : results
        });
    });
}
//管理员页面--更改房间管理
exports.changeAdminFangjianGuanli = function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        Hourse.find({"fangjianhao":fields.fangjianhao}).exec(function(err,results){
            results[0].fangjianhao = fields.fangjianhao;
            results[0].leixing = fields.leixing;
            results[0].weizhi = fields.weizhi;
            results[0].miaoshu = fields.miaoshu;
            results[0].zhuangtai = fields.zhuangtai;
            results[0].save(function (err,result) {
                res.json("修改成功");
            })
        });
    });
}
//管理员页面--更改房间状态
exports.changeAdminZt = function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        Hourse.find({"fangjianhao":fields.fangjianhao}).exec(function(err,results){
            results[0].fangjianhao = fields.fangjianhao;
            results[0].leixing = results[0].leixing;
            results[0].weizhi = results[0].weizhi;
            results[0].miaoshu = results[0].miaoshu;
            results[0].zhuangtai = "预定";
            results[0].save(function (err,result) {
                res.json({"results":1,"leixing":results[0].leixing})
            })
        });
    });
}

//管理员页面--记录查询
exports.showAdminJiluChaxun = function(req,res){
    //使用这个页面需要登录！
    if(!(req.session.login && req.session.type == "admin")){
        res.send("本页面需要登录，请<a href=/>登录</a>");
        return;
    }
    res.sendFile(path.join(__dirname , "../views/adminJiluChaxun.html"));
}

//管理员页面--退房管理
exports.showAdminTuifangGuanli = function(req,res){
    //使用这个页面需要登录！
    if(!(req.session.login && req.session.type == "admin")){
        res.send("本页面需要登录，请<a href=/>登录</a>");
        return;
    }
    res.sendFile(path.join(__dirname , "../views/adminTuifangGuanli.html"));
}

//管理员页面--入驻管理
exports.showAdminRuzhuGuanli = function(req,res){
    //使用这个页面需要登录！
    if(!(req.session.login && req.session.type == "admin")){
        res.send("本页面需要登录，请<a href=/>登录</a>");
        return;
    }
    res.sendFile(path.join(__dirname , "../views/adminRuzhuGuanli.html"));
}

//管理员页面--订单入住状态
exports.AdminRuzhuGuanlichangezt = function(req,res){
    var fangjianhao = req.params.fangjianhao;
    Hourse.find({"fangjianhao":fangjianhao}).exec(function(err,results){
        results[0].fangjianhao = results[0].fangjianhao;
        results[0].leixing = results[0].leixing;
        results[0].weizhi = results[0].weizhi;
        results[0].miaoshu = results[0].miaoshu;
        results[0].zhuangtai = "已入住";
        results[0].save(function (err,result) {
            res.json("入住成功")
        })
    });
    Userdingdan.find({"fangjianhao":fangjianhao}).exec(function(err,results){
        results[0].zt = "已入住"
        results[0].save()
    });



}
