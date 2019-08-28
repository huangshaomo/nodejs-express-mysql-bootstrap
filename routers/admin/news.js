// 导入express
const express = require("express");
// 实例化router
const router = express.Router();

//设置文件上传
const multer = require("multer");

// 设置存放文件的临时目录
const upload = multer({ dest: "tmp/" });

// 导入数据库模块
const mysql = require("../../config/db.js");
// 引入图片上传方法
const uploads = require("../../common/uploads");

// 格式化时间戳
const moment = require("moment");

// 导入分页方法
const page = require("../../common/page");

// 导入文件系统模块——执行删除某个文件操作
const fs = require("fs");

// 声明路由规则

// 新闻管理首页
router.get("/", function (req, res, next) {
    // 第一步：获取页面,URL上的数据，如果URL上有p并带了数据，取得该p的数值，否则取1
    let p = req.query.p ? req.query.p : 1;
    // console.log(req.query)
    // 搜索
    let search = req.query.search ? req.query.search : "";
    // console.log(p);
    // 第二步：默认每页展示数据个数
    let size = 3;
    // 第二步：计算页码开始的位置
    let start = (p - 1) * size;
    // 第三步：统计数据库中数据总条数
    mysql.query("select count(*) tot from news,newstype type where news.cid = type.id and title like ? ", ['%' + search + '%'], function (err, data) {
        if (err) {
            return '';
        } else {
            //  console.log(data);  //[ RowDataPacket { tot: 15 } ]
            let tot = data[0].tot; //获取数据条数
            let fpage = page(tot, p, size); //
            // 从数据中查询相关数据
            mysql.query("select news.*,type.name tname from news,newstype type where news.cid = type.id and title like ? order by news.id desc limit ?,?", [`%${search}%`, fpage.start, fpage.size], function (err, data) {
                if (err) {
                    return "";
                } else {
                    // 格式话时间戳
                    data.forEach(item => {
                        item.time = moment(item.time * 1000).format("YYYY-MM-DD HH:mm:ss");
                    })
                    // 加载新闻管理首页
                    res.render("admin/news/index.html", { data: data, search: search, show: fpage.show });
                }
            });

        }

        });
});


// 新闻管理的添加页面
router.get("/add", function (req, res, next) {
    mysql.query("select * from newstype order by sort desc", function (err, data) {
        if (err) {
            return "";
        } else {
            // 加载新闻管理添加页面
            res.render("admin/news/add.html", { data: data });
        }
    });

});

// 新闻管理的添加功能 upload.single("img")表示获取表单提交name == img的文件的详细信息
router.post("/add", upload.single("img"), function (req, res, next) {
    // 接收文件上传资源
    let imgRes = req.file;
    let { title, keywords, description, info, author, cid, text } = req.body;
    let num = 0;//阅读量
    let time = (Math.round(new Date().getTime()) / 1000);//秒时间戳，需要转换成毫秒
    // 进行图片上传
    let img = uploads(imgRes, "news");//返回图片存放的地址
    // console.log(text);

    // 继续数据库插入
    mysql.query("insert into news(title,keywords,description,info,author,cid,text,num,time,img) value(?,?,?,?,?,?,?,?,?,?)",
        [title, keywords, description, info, author, cid, text, num, time, img], function (err, data) {
            if (err) {
                return "";
            } else {
                if (data.affectedRows == 1) {
                    res.send("<script>alert('添加成功');location.href = '/admin/news'</script>");
                } else {
                    res.send("<script>alert('添加失败');history.go(-1)</script>");

                }
            }
        });

})

// 新闻管理的修改页面
router.get("/edit",function(req,res,next){
    // 获取传入的数据
    let id = req.query.id;
    // 查询数据库分类页面
    mysql.query("select * from newstype order by sort desc",function(err,data){
        if(err){
            return "";
        }else{
            // 查询数据库新闻页面
            mysql.query("select * from news where id = "+id,function(err,data2){
                if(err){
                    return "";
                }else{
                    // data2取出来的是一个二维数组
                    res.render("admin/news/edit.html",{data:data , newDate:data2[0]});
                }
            })
           
        }
    });

});

// 新闻管理的修改功能
router.post("/edit",upload.single("img"),function(req,res,next){
    // 接收post方法传过来的数据
    let imgRes = req.file;
    let {id,cid,text,oldimg,author,info,description,keywords,title } = req.body;
    let img = oldimg;

    // 判断用户是否修改图片
    if(imgRes){
        // 获取要替换新图返回的路径，
       img = uploads(imgRes,"news");//根目录是upload
    }
    // 发送sql语句修改数据
    mysql.query("update news set cid = ? , text = ? , author= ? , info= ? , description= ? , keywords= ?, title= ? , img = ? where id = ?",
    [cid,text,author,info ,description,keywords,title,img,id],function(err,data){
        if(err){
            return "";
        }else{

            if(data.affectedRows == 1){
                // 判断用户是否修改了图片
                if(imgRes){
                    if(fs.existsSync(__dirname+"/../../"+oldimg)){
                        fs.unlinkSync(__dirname+"/../../"+oldimg);
                    }
                }
                res.send("<script>alert('修改成功');location.href = '/admin/news'</script>");
            }else{
                res.send("<script>alert('修改失败');history.go(-1)</script>");

            }
        }
    });
})

// 无刷新删除新闻数据
router.get("/ajax_del",function(req,res,next){
    // 接收要删除的数据
    let {id,img} =  req.query;
    mysql.query("delete from news where id ="+id,function(err,data){
        if(err){
            console.log(err);
            return "";
        }else{
            if(data.affectedRows == 1){
                // 删除图片
                if(fs.existsSync(__dirname+"/../../"+img)){
                    fs.unlinkSync(__dirname+"/../../"+img);
                }
                res.send("1");
            }else{
                res.send("0");
            }
        }
    });
})
module.exports = router;