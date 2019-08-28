// 加载express模块框架
let express = require("express");

// 实例化一个路由类
let router = new express.Router();

// 加载文件系统模块
const fs =  require("fs");

// 上传图片设置模块
const multer =  require("multer");

// 设置存放临时文件的目录
const upload = multer({dest:"tmp/"});

const uploads = require("../../common/uploads.js");

// 系统管理首页路由，渲染首页并把json数据传送到首页进行展示
router.get("/",function(req,res,next){
    // 读取文件中的内容
    let fileData = fs.readFileSync(__dirname+"/../../config/webConfig.json");

    // 读取的文件是一个二进制流buffer，我们需要转换成字符串，载转换成json对象即可使用  
    let data = JSON.parse(fileData.toString());
    res.render("admin/system/index.html",{data:data});
});

// 系统管理的更新方法

router.post("/save",upload.single("logo"),function(req,res,next){

    // 接收上传的资源
    let imgRes = req.file;
    // 接受表单提交的数据
    let {title,keywords, description,count,copyright,record,logo}  = req.body;
    //判断用户是否修改图片

    let newlogo = ""
    if(imgRes){
        // 上传新图片，返回图片存放的路径
         newlogo = uploads(imgRes);//默认上传到upload根目录
    }

    // 格式化数据（更新修改后的数据）
    let data ={
        title:title,
        keywords:keywords,
        description:description,
        copyright:copyright,
        record:record,
        count:count,
        logo:newlogo? newlogo:logo //判断是否上传的新图片，是则替换成新图片的恶露就，否则还是原图片的路径

    }
    
    // 将更新后的数据以字符串的形式写入json文件
    fs.writeFileSync(__dirname+"/../../config/webConfig.json",JSON.stringify(data));
    //删除老图片
    if(imgRes){
        fs.unlinkSync(__dirname+"/../../" +logo);
    }
    res.send("<script>alert('修改成功');location.href='/admin/system'</script>");
});
module.exports = router;
