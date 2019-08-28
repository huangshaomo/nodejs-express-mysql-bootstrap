let express = require("express");

let router = new express.Router();

//导入数据库模块
const mysql = require("../../config/db.js");

//导入时间格式化
const moment = require("moment");

// 导入分页方法
const page = require("../../common/page.js");

//设置文件上传
const multer = require("multer");

// 设置存放文件的临时目录
const upload = multer({ dest: "tmp/" });

// 引入图片上传方法
const uploads = require("../../common/uploads");


// 会员管理首页
router.get('/', function (req, res, next) {
	// res.send("会员管理首页");
	// 开发分页
	// 第一页 0  5
	// 第二页 5  5
	// 第三页 10 5
	// 第四页 15 5

	// 第一步：获取页面,URL上的数据，如果URL上有p带了数据，取得该p的数值，否则取1
	let p = req.query.p ? req.query.p : 1;
	// console.log(p);
	// 默认每页展示数据个数
	let size = 5;
	// // 第二步：计算页码开始的位置
	// let start = (p - 1) * size;

	//接收检索数据
	let search = req.query.search ? req.query.search : ""; //获取点击提交按钮提交的输入框里面的数据

	// 计算总数据
	mysql.query("select count(*) tot from user where username like ? ", ['%' + search + '%'], function (err, data) {
		if (err) {
			return "";
		} else {
			// console.log(data[0].tot);
			let tot = data[0].tot;
			let fpage = page(tot, p, size);
			// // 计算总页数:总数据/每页显示的个数，多出来的当一页处理
			// let pages = Math.ceil(tot / size);
			mysql.query("select * from user where username like ? order by id desc limit ?,?", ['%' + search + '%', fpage.start, fpage.size], function (err, data) {
				if (err) {
					return "";
				} else {
					// console.log(data);
					// 加载页面
					data.forEach(item => {
						item.time = moment(item.time * 1000).format("YYYY-MM-DD HH:mm:ss");
					})
					res.render("admin/user/index.html",
						{
							data: data,
							search: search,
							show: fpage.show
						}
					);
				}
			});
		}
	});


});

// 会员添加页面
router.get('/add', function (req, res, next) {
	res.render("admin/user/add");
});

// 会员添加操作
router.post('/add', upload.single("avatar"), function (req, res, next) {
	// 获取上传文件资源
	let imgRes = req.file;
	// 获取上传的数据
	let { username, password, repassword, status } = req.body;
	// 获取当前毫秒时间戳
	let time = (Math.round(new Date().getTime()) / 1000);//秒时间戳，需要转换成毫秒
	// 进行图片上传
	let avatar = uploads(imgRes, "avatar");//返回图片存放的地址

	// console.log(avatar);
	if (username) {
		if (password) {
			if (username.length >= 6 && username.length <= 12) {
				if (password.length >= 8) {
					if (password === repassword) {
						// 查询数据库是否存在同名用户
						mysql.query("select * from user where username = ?", [username], function (err, data) {
							if (err) {
								console.log(data);
								return "";
							} else {
								console.log(data);
								if (data.length == 0) {
									// 判断用户是否上传图片
									if(!imgRes){
										avatar = '/public/home/images/icon/icon.png'
									}
									// 执行数据库插入操作
									mysql.query("insert into user(username,password,status,time,avatar) value(?,?,?,?,?)", [username, password, status, time, avatar], function (err, data) {
										if (err) {
											return "";
										} else {
											if (data.affectedRows == 1) {
												res.send("<script>alert('会员添加成功');location.href = '/admin/user'</script>");
											} else {
												res.send("<script>alert('会员添加失败');history.go(-1)</script>");
											}
										}
									});
									// console.log(imgRes);
									// console.log(req.body);
								} else {
									res.send("<script>alert('该用户已被注册');history.go(-1)</script>");
								}
							}
						});
					} else {
						res.send("<script>alert('两次输入的密码不一致');history.go(-1)</script>");
					}
				} else {
					res.send("<script>alert('密码长度要大于8位间');history.go(-1)</script>");
				}
			} else {
				res.send("<script>alert('用户名长度在6-12位之间');history.go(-1)</script>");
			}
		} else {
			res.send("<script>alert('请输入密码');history.go(-1)</script>");
		}
	} else {
		res.send("<script>alert('请输入用户名');history.go(-1)</script>");
	}

});


// // 会员管理修改页面
// router.get('/edit',function(req,res,next){
// 	res.send("会员管理修改页面");
// });

// // 会员管理增加操作
// router.get('/insert',function(req,res,next){
// 	res.send("会员管理添加操作");
// });

// router.get('/save',function(req,res,next){
// 	res.send("会员管理修改操作");
// });

// router.get('/delete',function(req,res,next){
// 	res.send("会员管理删除操作");
// });

module.exports = router;