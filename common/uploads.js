
// 加载文件系统模块
const fs = require("fs");

// 引入path模块获取文件名后缀
const path = require("path");

// 文件上传函数，根据提供的图片信息跟想要存放的目录名，返回图片存放的路径
function uploads(imgRes,dir =''){
    // 获取文件的临时目录
    let tmpPath = imgRes.path;  //'tmp\\87fe4af813bd4a2d04cfaecdd7e23f7e'

    // 生成随机图片名:当前时间戳加后缀
    let newName = ""+(new Date().getTime())+Math.round(Math.random()*10000);
    // 获取上传文件名的后缀名
    let ext = path.extname(imgRes.originalname);  //例如：.png
    // 设置文件上传的指定目录
    let newPath = "/upload/"+dir+"/"+newName+ext;

    // 进行文件拷贝
    let fileData = fs.readFileSync(tmpPath);//同步读取里面的文件内容
    fs.writeFileSync(__dirname+"/../"+newPath,fileData);//同步将读取的文件内容写入到新的文件
    // console.log(__dirname+"/../../"+newPath);//E:\software\apps data\VS code\project\nodejs-express-mysql\routers\admin/../..//upload/slider/15658611447833694.png
    return newPath;
}

module.exports = uploads;