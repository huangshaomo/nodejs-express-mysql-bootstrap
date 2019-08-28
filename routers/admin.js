// 后台路由文件

// 导入express
let express = require("express");

// 实例化
let router = express.Router();

//载入MD5密码加密模块
let crypto = require('crypto');

//载入mysql数据库模块
let mysql = require("../config/db.js");

// 监听用户的访问地址
router.use(function (req, res, next) {
	// 判断url地址,是否可以直接进行访问，如果用户没有访问登录页面或check页面
	if (req.url != "/login" && req.url != "/check") {
		// 判断用户是否登录——判断请求头是否带有下面两则信息，后台是否登录且用户名是否存在
		if (req.session.HsmMessageIsAdmin && req.session.HsmMessageUsername) {
			next();
		} else {
			res.send("<script>alert('请登录');location.href = '/admin/login';</script>");
		}
	} else {
		// 如果访问的是登录页面或check页面
		next();
	}
});
// 登录页面
router.get("/login", function (req, res, next) {
	res.render("admin/login.html");
})

//登录处理操作
router.post("/check", function (req, res, next) {
	console.log(req.body);
	console.log(req.session);
	// 接收数据
	let {username, password } = req.body;
	// 判断用户是否输入
	if (username) {
		if (password) {
			// 加密密码
			let md5 = crypto.createHash('md5');
			password = md5.update(password).digest('hex');
			// 判断数据库中是否存在该用户
			mysql.query("select * from admin where username = ? and password = ?", [username, password], function (err, data) {
				if (err) {
					return "";
				} else {
					// 如果在数据库中查询到对应的数据
					if (data[0]) {
						// 再次比对数据库中的数据与输入的数据
						if(data[0].username == username && data[0].password == password){
						req.session.HsmMessageIsAdmin = true;
						req.session.HsmMessageUsername = data[0].username;
						res.send("<script>location.href = '/admin';</script>");
						}else{
							res.send("<script>alert('登录失败');location.href = '/admin/login';</script>");
						}
					} else {
						res.send("<script>alert('登录失败');location.href = '/admin/login';</script>");
					}
				}
			});
		} else {
			res.send("<script>alert('请登录');location.href = '/admin/login';</script>");
		}
	} else {
		res.send("<script>alert('请登录');location.href = '/admin/login';</script>");
	}
})

// 退出登录
router.get("/logout", function (req, res, next) {
	req.session.HsmMessageIsAdmin = false;
	req.session.HsmMessageUsername = "";
	res.send("<script>alert('退出成功');location.href = '/admin';</script>");

});

//  后台首页路由

router.get("/", function (req, res, next) {

	// 加载对应后台页面
	res.render("admin/index");
});

// 后台欢迎页面

router.get("/welcome", function (req, res, next) {
	// 加载对应欢迎页面
	res.render("admin/welcome");
});

// 注册管理员路由

let adminRouter = require('./admin/admin');
router.use('/admin', adminRouter);

// 注册会员管理路由
let userRouter = require('./admin/user');
router.use('/user', userRouter);

// 栏目管理

// 注册轮播图管理路由
let sliderRouter = require('./admin/slider');
router.use('/slider', sliderRouter);

// 注册新闻分类管理路由
let typeRouter = require("./admin/newstype");
router.use('/newstype', typeRouter);//当访问/type时，匹配typeRouter里面的路由
// 新闻管理
let newsRouter = require("./admin/news.js");
router.use('/news', newsRouter);//当访问/type时，匹配typeRouter里面的路由

// 评论管理
let commentRouter = require("./admin/comment.js");
router.use('/comment', commentRouter);//当访问/type时，匹配typeRouter里面的路由
// 注册登记系统管理路由
let systemRouter = require('./admin/system');
router.use('/system', systemRouter);


module.exports = router;