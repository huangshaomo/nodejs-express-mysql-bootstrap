// 导入express框架
const express = require("express");
// 实例化router
const router = express.Router();

// 导入数据库相关内容
const mysql = require("../../config/db.js");


// 分类查看页面
router.get("/", function (req, res, nxet) {
    // 从数据库中查询相关数据
    mysql.query("select *from newstype order by sort desc", function (err, data) {
        if (err) {
            return "";
        } else {
            // 加载页面
            res.render("admin/newstype/index.html", { data: data });
        }
    });

});



// 分类的添加页面
router.get("/add", function (req, res, nxet) {
    // 加载添加页面
    res.render("admin/newstype/add.html");
});

// 分类的添加操作
router.post("/add", function (req, res, next) {
    // 接收post方法传递的参数
    let { name, keywords, description, sort } = req.body;
    // 将数据插入到数据库
    mysql.query("insert into newstype(name,keywords,description,sort) value(?,?,?,?)", [name, keywords, description, sort], function (err, data) {
        if (err) {
            console.log(err);
            return "";
        } else {
            if (data.affectedRows == 1) {
                res.send("<script>alert('分类添加成功');location.href ='/admin/newstype'</script>");
            } else {
                res.send("<script>alert('分类添加成功');history.go(-1) </script>");
            }
        }
    });

});

// 分类管理修改页面
router.get("/edit", function (req, res, nxet) {
    let id = req.query.id;
    // 从数据库中查找数据
    mysql.query("select * from newstype where id = ?", [id], function (err, data) {
        if (err) {
            return "";
        } else {
            // 将获取到的数据渲染要页面
            res.render("admin/newstype/edit.html", { data: data[0] });
        }
    });
});

// 分类管理修改数据功能
router.post("/edit", function (req, res, next) {
    // 获取要修改的数据
    let { name, keywords, description, sort,id} = req.body;
    console.log(id);
    mysql.query("update newstype set name = ?, keywords = ?, description = ?, sort = ? where id = ?",[name, keywords, description, sort,id],function(err,data){
        if(err){
            return err;
        }else{
            console.log(data);
            if(data.affectedRows == 1){
                res.send("<script>alert('分类数据修改成功');location.href ='/admin/newstype'</script>");
            }else{
                res.send("<script>alert('分类数据修改失败');history.go(-1) </script>");
            }
        }
    }); 

})

// 无刷新删除数据
router.get('/ajax_del', function (req, res, next) {
    // console.log(req.query);
    let id = req.query.id;
    // console.log(id);
    mysql.query(`delete from newstype where id = ${id}`, function (err, data) {
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

// 无刷新修改排序操作
router.get("/ajax_sort",function(req,res,next){
    // 获取传入的数据
    let {id,sort} = req.query;
    // 执行更新sql语句操作
    mysql.query("update newstype set sort = ? where id = ?",[sort,id],function(err,data){
        if(err){
            return "";
        }else{
            if(data.affectedRows == 1){
                res.send("1");
            }else{
                res.send("0");
            }
        }
    });
    
})

module.exports = router;