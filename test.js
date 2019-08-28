//导入express框架
let express = require("express");

// 实例化
let app = express.Router();


// 导入session模块
const session = require('express-session');

app.get("/",(req,res)=>{
    // 服务器接收请求，再给响应设置一个Cookie
    // 这个cookie的name 为testName
    // value 为testValue
    res.Cookie("testName","testValue")
    res.send('<h1>Hello world</h1>')
});