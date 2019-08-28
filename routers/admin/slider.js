let express = require('express');

let router = new express.Router();

//设置文件上传
const multer = require("multer");

// 设置存放文件的临时目录
const upload = multer({ dest: "tmp/" });

// 引入path模块获取文件名后缀
const path = require('path');

// 导入文件系统模块
const fs = require("fs");
//加载上传方法
const uploads = require("../../common/uploads.js");

// 调用分页方法
const page = require("../../common/page.js");

//调用数据库模块
const mysql = require('../../config/db.js');

//轮播图管理路由

// 渲染首页
router.get("/", function (req, res, next) {
    // 第一步：获取页面,URL上的数据，如果URL上有p并带了数据，取得该p的数值，否则取1
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
    mysql.query("select count(*) tot from banner where name like ? ", ['%' + search + '%'], function (err, data) {
        if (err) {
            return '';
        } else {
            //  console.log(data);  //[ RowDataPacket { tot: 15 } ]
            let tot = data[0].tot; //获取数据条数
            let fpage = page(tot, p, size); //
            // res.send("管理员管理首页");

            // 从数据库中查询符合条件的数据
            mysql.query("select * from banner where name like ? order by id desc limit ?,?", [`%${search}%`, fpage.start, fpage.size], function (err, data) {
                // 判断是否执行成功
                if (err) {
                    return "";
                } else {
                    //渲染该页面并把数据传输过去
                    res.render("admin/slider/index.html", { data: data, search: search, show: fpage.show });
                }
            });
        }
    });

});
// 添加页
router.get("/add", function (req, res, next) {
    // 添加页面
    res.render('admin/slider/add.html');
});

// 处理添加功能   --设置上传图片的信息，名字叫img
router.post("/add", upload.single("img"), function (req, res, next) {
    // console.log(req.body);
    // // 获取上传文件的相关数据
    // console.log(req.file);

    // 接收表单提交的数据
    let { name, url, sort } = req.body;
    // 接收文件上传的相关数据
    let imgRes = req.file;

    // 获取文件的临时目录
    let tmpPath = imgRes.path;  //'tmp\\87fe4af813bd4a2d04cfaecdd7e23f7e'

    // 生成图片名:当前时间戳加后缀
    let newName = "" + (new Date().getTime()) + Math.round(Math.random() * 10000);
    // 获取上传文件名的后缀
    let ext = path.extname(imgRes.originalname);  //例如：.png
    // 设置文件上传的指定目录
    let newPath = "/upload/slider/" + newName + ext;

    // 进行文件拷贝
    let fileData = fs.readFileSync(tmpPath);//同步读取里面的文件内容
    fs.writeFileSync(__dirname + "/../../" + newPath, fileData);//同步将读取的文件内容写入到新的文件
    // console.log(__dirname+"/../../"+newPath);//E:\software\apps data\VS code\project\nodejs-express-mysql\routers\admin/../..//upload/slider/15658611447833694.png

    //将数据插入数据库
    mysql.query("insert into banner(name,url,sort,img) value(?,?,?,?)", [name, url, sort, newPath], function (err, data) {
        if (err) {
            return "";
        } else {
            if (data.affectedRows == 1) {
                res.send("<script>alert('添加成功');location.href='/admin/slider'</script>");
            } else {
                res.send("<script>alert('添加失败');history.go(-1)</script>");
            }
        }
    });

});

// 修改页
router.get("/edit", function (req, res, next) {
    //获取要修改数据的id
    let id = req.query.id;

    // 通过id查询对应数据
    mysql.query("select * from banner where id = ? ", [id], function (err, data) {
        if (err) {
            return "";
        } else {
            res.render("admin/slider/edit.html", { data: data[0] });
        }
    });

});


// 修改功能          获取上传时的图片信息
router.post("/edit", upload.single("img"), function (req, res, next) {
    // 接收图片信息
    let imgRes = req.file;
    // 接收表单信息
    let { id, name, url, sort, oldimg } = req.body;
    // console.log(imgRes);
    // console.log(id,name,url,sort);

    // 判断图片资源是否存在以确实是否修改图片
    let sql = "";
    let arr = []
    if (imgRes) {
        // 如果用户点击了上传图片，先上传图片
        // 调用函数，提供图片信息与上传到哪个具体目录
        // console.log(uploads(imgRes,"news"));
        let img = uploads(imgRes, "slider")
        sql = "update banner set name = ?,url = ?,sort = ?, img = ? where id= ?";
        arr = [name, url, sort, img, id];
    } else {
        sql = "update banner set name = ?,url = ?,sort = ? where id= ?";
        arr = [name, url, sort, id];
    }
    // 发送sql 语句
    mysql.query(sql, arr, function (err, data) {
        if (err) {
            return "";
        } else {
            if (data.affectedRows == 1) {
                //判断是否修改了图片
                // 如果老图片存在，删除该图片
                if (fs.existsSync(__dirname + "/../../" + oldimg)) {
                    fs.unlinkSync(__dirname + "/../../" + oldimg);
                }
                res.send("<script>alert('修改成功');location.href ='/admin/slider' </script>");
            } else {
                res.send("<script>alert('修改失败');history.go(-1) </script>");
            }
        }
    })
});

// 删除功能
router.get("/ajax_del", function (req, res, next) {
    // 接收用户要删除的数据
    let { id, img } = req.query;

    // 删除数据
    mysql.query("delete from banner where id = ?", [id], function (err, data) {
        if (err) {
            return "";
        } else {
            if (data.affectedRows == 1) {
                // 删除对应的图片
                // 判断图片是否存在
                if (fs.existsSync(__dirname + "/../../" + img)) {
                    // 存在则删除对应的图片
                    fs.unlinkSync(__dirname + "/../../" + img);
                }
                res.send("1");
            } else {
                res.send("0");
            }
        }
    });
});
// 无刷新修改排序功能
router.get("/ajax_sort", function (req, res, next) {
    // 接收数据
    let { id, sort } = req.query;
    // console.log(id +sort);

    // 数据的修改
    mysql.query("update banner set sort = ? where id = ? ", [sort, id], function (err, data) {
        if (err) {
            // console.log(err);
            return "";
        } else {
            if (data.affectedRows == 1) {
                res.send("1");
            } else {
                res.send("0");
            }
        }
    });
})
module.exports = router;