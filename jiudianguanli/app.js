//引用模块
var express = require("express");
var session = require('express-session')
var mongoose = require("mongoose");

//路由
var common_router = require("./router/common-router.js");
var admin_router = require("./router/admin-router.js");
var user_router = require("./router/user-router.js");

//创建APP
var app = express();
mongoose.connect('mongodb://localhost:27017/jiudianxitong');

//设置默认模板引擎
app.set("view engine","ejs");

//设置session
//使用一个中间件，就是session中间件。这个中间件必须排在第一个
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'jiudianxitong', //加密字符串，我们下发的随机乱码都是依靠这个字符串加密的
    resave: false,
    saveUninitialized: true
}));

app.use ("/public"                          ,express.static("public"));

//路由清单
app.get ("/"                                ,common_router.showIndex);              //登录页面
app.post("/checklogin"                      ,common_router.checklogin);             //Ajax接口，检查登录是否成功，能够返回{result:-2}
app.get('/reg'                              ,common_router.showReg);                //注册页面
app.get('/checkusername'                    ,common_router.checkUsername);          //判断用户名是否已注册
app.post('/doreg'                           ,common_router.doReg);                  //注册

app.get('/admin'                            ,admin_router.showAdmin);                //管理员页面--房类管理
app.get('/admin/all'                        ,admin_router.AllAdmin);                 //管理员页面--所有房类管理
app.get('/admin/allleibie'                  ,admin_router.AllLeiBieAdmin);           //管理员页面--所有房类管理
app.post('/admin'                           ,admin_router.AddAdmin);                 //管理员面板--添加房类管理
app.delete('/admin/:sid'                    ,admin_router.delAdmin);                 //管理员面板--删除房类管理
app.get('/admin/updata'                     ,admin_router.updataAdmin);              //管理员页面--显示更改房类管理页
app.post('/admin/change'                    ,admin_router.changeAdmin);              //管理员页面--更改房类管理
app.post('/admin/changefangcount'           ,admin_router.changeAdminFangCount);     //管理员页面--更改房类管理--剩余房间数

app.get('/admin/fangjianguanli'             ,admin_router.showAdminFangjianGuanli);  //管理员页面--房间管理
app.post('/admin/fangjianguanli'            ,admin_router.AddAdminFangjianGuanli);   //管理员页面--添加房间管理
app.get('/admin/fangjianguanli/all'         ,admin_router.AllAdminFangjianGuanli);   //管理员页面--所有房间管理
app.delete('/admin/fangjianguanli/:sid'     ,admin_router.delAdminFangjianGuanli);   //管理员面板--删除房间管理
app.get('/admin/fangjianguanli/updata'      ,admin_router.updataAdminFangjianGuanli);//管理员页面--显示更改房间管理页
app.post('/admin/fangjianguanli/change'     ,admin_router.changeAdminFangjianGuanli);//管理员页面--更改房间管理
app.post('/admin/fangjianguanli/changezt'   ,admin_router.changeAdminZt);            //管理员页面--更改房间状态

app.get('/admin/jiluchaxun'                 ,admin_router.showAdminJiluChaxun);      //管理员页面--记录查询
app.get('/user/all'                         ,user_router.AllAdminJiluChaxun);        //管理员页面--所有用户
app.get('/user/searchname/:name'            ,user_router.searchname);                //管理员页面--条件查找

app.get('/admin/tuifangguanli'              ,admin_router.showAdminTuifangGuanli);   //管理员页面--退房管理
app.get('/user/searchfanghao/:fangjianhao'  ,user_router.searchfanghao);             //管理员页面--房间号查找
app.get('/user/dotuifang/:fangjianhao'      ,user_router.dotuifang);                 //管理员页面--退房

app.get('/admin/ruzhuguanli'                ,admin_router.showAdminRuzhuGuanli);     //管理员页面--入住管理
app.get('/admin/ruzhuguanli/:fangjianhao'   ,admin_router.AdminRuzhuGuanlichangezt); //管理员页面--订单入住状态

app.get('/user/xiugaimima'                  ,user_router.showAdminXiugaiMima);       //用户页面--修改密码
app.post('/user/changmima'                  ,user_router.ChangeAdminXiugaiMima);     //用户页面--修改密码提交

app.get('/user'                             ,user_router.showUser);                  //用户页面--预定房间
app.post('/user/add'                        ,user_router.AddUser);                   //用户页面--添加订单
app.get('/user/dingdanchaxun'               ,user_router.showUserDingdanChaxun);     //用户页面--订单查询
app.get('/user/dingdanchaxun/:username'     ,user_router.showUserDingda);            //用户页面--用户订单

app.get('/tuichu'                           ,common_router.tuichu);        //退出

//监听
app.listen(3000);


