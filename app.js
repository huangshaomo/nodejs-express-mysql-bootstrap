//导入express框架
let express = require("express");

//1.初始化express
let app  = express();

//处理post请求
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));//未编码的（{扩展：假}）

// 导入cookie-parse模块
const cookieParser  = require('cookie-parser');
// 导入session模块
const session = require('express-session');
// 使用 session 中间件
app.use(session({
    secret: 'keyboard cat',// 用来对session id相关的cookie进行签名,相当于是一个加密密钥，值可以是任意字符串
    resave: false, // 强制session保存到session store中，建议false 
    saveUninitialized: false,  // 是否每次都重新保存会话，建议false  强制没有“初始化”的session保存到storage中
    cookie : {
        maxAge : 1000 * 60 * 300, // 设置 session 的有效时间，单位毫秒
    },
}));

//2.设置模板引擎相关信息,首先要用npm安装模板引擎 npm install ejs
let ejs = require("ejs");

let path = require("path");
//3.设置资源模板的存放目录
//第一个参数,固定的
//第二个参数：模板存放的目录
app.set("views",'./views');//设置模板的目录

//4.定义使用的模板引擎
//第一个参数：模板引擎的名称，模板引擎的后缀
//第二个参数：使用模板引擎的方法
app.engine("html",ejs.__express);// 使用ejs引擎解析html文件中ejs语法

// 5.在app中注册模板引擎
// 第一个参数：固定不变
// 第二个参数：与定义的模板引擎的名称有关
app.set("view engine","html");  // 设置解析模板文件类型：这里为html文件

// 设置静态资源的访问，便不会通过路由去寻找
app.use("/public",express.static(__dirname+"/public"));
app.use("/upload",express.static(__dirname+"/upload"));
app.use("/images",express.static(__dirname+"/images"));


//导入前台的路由文件
let indexRouter = require("./routers/index");

//导入后台的路由文件
let adminRouter = require("./routers/admin");
// 使用前台的路由
// 参数1：匹配的路由规则
// 参数2:请求路由规则
app.use('/',indexRouter);
app.use('/admin',adminRouter);
//加载ueditor 模块
var ueditor = require("ueditor");
 
//使用模块
app.use("/public/baidu/ueditors", ueditor(path.join(__dirname, ''), function (req, res, next) {
    // ueditor 客户发起上传图片请求
    if (req.query.action === 'uploadimage') {
        var foo = req.ueditor;
 
        var imgname = req.ueditor.filename;
 
        var img_url = '/images/ueditor/';
        res.ue_up(img_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
        res.setHeader('Content-Type', 'text/html');//IE8下载需要设置返回头尾text/html 不然json返回文件会被直接下载打开
    }
    //  客户端发起图片列表请求
    else if (req.query.action === 'listimage') {
        var dir_url = '/images/ueditor/';
        res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片
    }
    // 客户端发起其它请求
    else {
        // console.log('config.json')
        res.setHeader('Content-Type', 'application/json');
        res.redirect('/public/baidu/php/config.json');
    }
}));

// 使用EJS模板变量值使用<%= variable_name %>输出方式，字符串输出时默认经过escape转义编码。 
// 当我们想要输出一些动态生成的HTML标签时可使用<%- variable_nam %>输出方式，这种方式不会被escape转义编码。

//监听服务器-之后启动app.js
app.listen(3050,function(){
    console.log('node 服务器已启动 端口 3050');
})