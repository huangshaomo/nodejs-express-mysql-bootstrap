let express = require("express");

// 实例化一个路由类
let router = new express.Router();

// 导入数据库相关配置

let mysql = require("../../config/db");
// console.log(mysql);

//载入MD5密码加密模块
let crypto = require('crypto');

//导入时间格式化模块
let moment = require('moment');

// 导入分页方法
const page = require("../../common/page.js");

// 管理员管理首页 ——实现数据展示，分页，检索，添加，删除，修改
router.get('/', function (req, res, next) {
	//分页

	// 第一步：获取页面,URL上的数据，如果URL上有p带了数据，取得该p的数值，否则取1
	let p = req.query.p ? req.query.p : 1;
		// console.log(req.query)
	// 搜索
	let search = req.query.search ? req.query.search : "";
	// console.log(p);
	// 第二步：默认每页展示数据个数
	let size = 5;
	// 第二步：计算页码开始的位置
	let start = (p - 1) * size;
	// 第三步：统计数据库中数据总条数
	mysql.query("select count(*) tot from admin where username like ? ", ['%' + search + '%'], function (err, data) {
		if(err){
			return '';
		}else{
		//  console.log(data);  //[ RowDataPacket { tot: 15 } ]
		let tot = data[0].tot;
		let fpage = page(tot, p, size);

	// res.send("管理员管理首页");

	// 从数据库中查询数据
	mysql.query("select * from admin where username like ? order by id desc limit ?,?", [`%${search}%`, fpage.start, fpage.size], function (err, data) {
		// 判断是否执行成功
		if (err) {
			return "";
		} else {
			//把时间戳转换成
			data.forEach(item => {
				item.time = moment(item.time * 1000).format("YYYY-MM-DD HH:mm:ss");
			})
			//渲染该页面并把数据传输过去
			res.render("admin/admin/index.html", { data: data, search: search,show:fpage.show });
		}
	});
}
});


});
// router可以认为被当做服务器进行处理请求

// 管理员管理添加页面
router.get('/add', function (req, res, next) {
	// res.send("管理员管理添加页面");
	// 加载对应管理员添加页面
	res.render("admin/admin/add");
});

// 管理员的添加功能
router.post("/add", function (req, res, next) {
	// 接收post方式传过来的数据
	let { username, password, repassword, status } = req.body
	// 判断用户名是否存在
	if (username) {
		// console.log('用户名存在');
		// 判断用户名长度
		if (username.length >= 6 && username.length <= 12) {
			// console.log('用户名长度正确');
			// 判断密码是否存在
			if (password) {
				// console.log('密码存在');
				// 判断两次输入的密码是否一致
				if (password == repassword) {
					// console.log('密码匹配一致');
					// //判断用户名是否已经存在
					mysql.query("select * from admin where username = ?", [username], function (err, data) {
						// 判断是否有错误,
						if (err) {
							return "";
						} else {
							console.log(data);
							// // alert('sad');
							// 判断该用户名是否注册
							if (data.length == 0) {
								// console.log(data.length);
								// 没有注册，插入数据
								//创建当前时间戳
								let time = Math.round((new Date().getTime() / 1000));
								// console.log("time:" + time);
								// 密码加密，需要载入node提供的加密模块
								// 创建加密规则
								let md5 = crypto.createHash('md5');
								password = md5.update(password).digest('hex');
								mysql.query("insert into admin(username,password,status,time) value(?,?,?,?)", [username, password, status, time], function (err, data) {
									if (err) {
										console.log(err);
										return "";
									} else {
										if (data.affectedRows === 1) {
											res.send("<script>alert('管理员添加成功');location.href ='/admin/admin'</script>");
										} else {
											res.send("<script>alert('管理员添加失败');history.go(-1)</script>");
										}
									}
								})
							} else {
								res.send("<script>alert('该账户名已被注册，请重新输入');history.go(-1)</script>");

							}
						}
					});

				} else {
					res.send("<script>alert('两次输入的密码不一致');history.go(-1)</script>");
				}
			} else {
				res.send("<script>alert('请输入密码');history.go(-1)</script>");
			}
		} else {
			res.send("<script>alert('用户名长度在6-12位之间');history.go(-1)</script>");
		}

	} else {
		res.send("<script>alert('请输入用户名');history.go(-1)</script>");
	}
});

// 无刷新修改状态
router.get('/ajax_status', function (req, res, next) {
	// console.log(req.query);
	// 接收对应的数据
	let { id, status } = req.query;//{ id: '8', status: '1' }
	// 修改数据
	mysql.query("update admin set status= ? where id= ?", [status, id], function (err, data) {
		// 判断是否修改成功(报错)
		if (err) {
			return "";
		} else {
			// console.log("data.affectedRows: " +data.affectedRows);
			// 如果已经修改成功
			if (data.affectedRows == 1) {
				res.send("1");
			} else {
				res.send("0");
			}
		}
	});
});

// 1、管理员管理修改页面
router.get('/edit', function (req, res, next) {
	// 接收数据的ID
	let id = req.query.id;
	// 查询对应数据
	mysql.query("select * from admin where id = " + id, function (err, data) {
		if (err) {
			return "";
		} else {
			// 加载修改页面
			res.render("admin/admin/edit.html", { data: data[0] });
		}
	});


});

//2、管理员修改数据功能
router.post("/edit", function (req, res, next) {
	// 接收表单提交的数据
	// console.log(req.body);
	let { username, password, repassword, id, status } = req.body;
	// 判断用户是否修改密码
	let sql = "";
	if (password) {
		var md5 = crypto.createHash('md5');
		password = md5.update(password).digest('hex');
		// sql语句,password加''是为了变成字符串，因为默认是哈希
		sql = `update admin set status = ${status} ,password = '${password}' where id = ${id}`;
	} else {
		// sql语句
		sql = `update admin set status = ${status} where id = ${id}`;
	}
	// console.log(sql);
	mysql.query(sql, function (err, data) {
		if (err) {
			return "";
		} else {
			if (data.affectedRows == 1) {
				res.send("<script>alert('修改成功');location.href='/admin/admin'</script>");

			} else {
				res.send("<script>alert('修改失败');history.go(-1)</script>");

			}
		}
	})
});


// 无刷新删除管理员数据
router.get('/ajax_del', function (req, res, next) {
	// console.log(req.query);
	let id = req.query.id;
	// console.log(id);
	mysql.query(`delete from admin where id = ${id}`, function (err, data) {
		if (err) {
			return "";
		} else {
			if (data.affectedRows == 1) {
				res.send('1');
			} else {
				res.send('0');
			}
		}
	});
});

module.exports = router;