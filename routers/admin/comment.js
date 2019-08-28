// 导入express框架
const express = require("express");

// 实例化
const router = express.Router();

// 导入数据库
const mysql = require("../../config/db.js");

// 导入moment模块，格式化时间
const moment = require("moment");

// 导入分页方法
const page = require("../../common/page");

// 展示评论管理

router.get("/", function (req, res, next) {
    // 分页搜索操作
    // 第一步：获取页面,URL上的数据，如果URL上有p带了数据，取得该p的数值，否则取1
    let p = req.query.p ? req.query.p : 1;

    // 默认每页数据展示个数
    let size = 5;
    // // 第二步：计算页码开始的位置
    // let start = (p - 1) * size;

    //接收检索数据
    let search = req.query.search ? req.query.search : ""; //获取点击提交按钮提交的输入框里面的数据

    // 计算总数据
    mysql.query("select  comment.*,user.username,news.title,news.img,count(news.title) tot from comment ,user ,news where comment.user_id = user.id and comment.news_id = news.id and news.title like ? ", ['%' + search + '%'], function (err, data) {
        if (err) {
            return "";
        } else {
            // console.log(data[0].tot);
            let tot = data[0].tot;
            let fpage = page(tot, p, size);
            // // 计算总页数:总数据/每页显示的个数，多出来的当一页处理
            // 执行sql语句
            mysql.query("select  comment.*,user.username,news.title,news.img from comment ,user ,news where comment.user_id = user.id and comment.news_id = news.id and news.title like ? order by `comment`.id desc limit ?,?", ['%' + search + '%', fpage.start, fpage.size], function (err, data) {
                if (err) {
                    return "";
                } else {
                    // console.log(data);
                    // 格式化时间
                    data.forEach(item => {
                        item.time = moment(item.time * 1000).format("YYYY-MM-DD HH:mm:ss");;
                    })
                    //加载页面
                    res.render("admin/comment/index.html", 
                    {
                        data: data,
                        search: search,
                        show:fpage.show
                    }
                    );
                }
            });
        }

    });
});

    // 无刷新修改状态

    router.get("/ajax_status", function (req, res, next) {
        // 接受数据
        let { id, status } = req.query;

        // 执行sql语句，修改数据库中的数据
        mysql.query("update comment set status = ? where id = ?", [status, id], function (err, data) {
            if (err) {
                console.log(err);
                return "";
            } else {
                if (data.affectedRows == 1) {
                    res.send("1");
                } else {
                    res.send("0");
                }
            }
        });


    });
    // 抛出路由
    module.exports = router;