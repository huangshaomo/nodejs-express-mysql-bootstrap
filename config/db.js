// 导入数据库模块

const mysql = require("mysql");

// 设置数据库连接属性

let connect = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"huang",
    database:"newblog"

})

// 开始连接数据库
connect.connect();

// 抛出模块

module.exports = connect;

