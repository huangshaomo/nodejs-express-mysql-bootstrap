NodeJS-Express-Bootstrap-Mysql
=================================
213123
1）前台功能分析

    1）用户管理
        1.1）栏目列表
        1.2）轮播图展示
        1.3）最新发布
        1.4）热门文章
        1.5）搜索功能

    2）分类页面
        2.1）分类新闻
        2.2）热门文章

    3）详情页
        3.1）新闻详情
        3.2）相关推荐
        3.3）热门文章
        3.4）评论列表
        3.5）发布评论

    4）登陆页面

    5）注册页面





2）后台功能分析

    1）管理员管理

    2）用户管理

    3）系统管理

    4）轮播图管理

    5）新闻分类管理

    6）新闻管理

    7）评论管理


3）数据库设计

    1）管理员表（admin）
        id
        username
        password
        status
        
    2）用户表（user）

        id
        username
        password
        status
        time

    3）栏目表（column）
        id
        name 栏目名
        url 栏目url地址
        sort 排序
        keywords 关键字
        description 描述

    4） 轮播图管理（banner）
        id
        name 轮播图名
        url  轮播图跳转地址
        sort 轮播图的先后顺序
        img 轮播图图片
    
    5）新闻分类管理（newStyle）
        id
        name
        keyword
        description
    
    6）新闻管理（news）
        id
        cid 新闻所属分类
        title 新闻标题
        img 新闻图片
        time 新闻发布时间
        num 浏览数
        info 新闻简介
        author 新闻作者
        text 新闻详情内容

    7）评论管理（comment）
        id
        user_id 评论的用户
        news_id 评论的文章
        text 评论的内容
        time 评论的时间
        status 评论的状态
          


4）项目初始化

    1）环境准备
        1.1）node.js
            在命令行 node -v
            v12.05.0

        1.2）npm 环境
            在命令行 npm -v
            v6.9.0

        1.3）mysql数据库
            只要正常的创建数据库，数据表，证明mysql ok


    2）创建项目
        2.1）在某盘建立项目文件

        2.2）用命令行打开文件（cmd 或powershell）

        2.3）使用npm init初始化项目
            在nodejs-express-mysql目录下新建一个package.json，存储项目的基本信息

        2.4）安装express框架
             npm install express --save

             #安装成功 在nodejs-express-mysql目录下 node_modules 存放着所有的node的相关模块
             #安装成功 在nodejs-express-mysql目录下 package-lock.json存放着node-modules里面安装包的所有版本

        2.5）创建网站相关目录
            nodejs-express-mysql
                |-----common #存放封装的函数方法
                |-----node_modules #模块包
                |-----config #公共配置文件
                |-----images ueditor富文本编辑器静态资源路由
                |-----views #存放网站的静态页面
                |-----public #存放网站的静态资源
                |-----upload #存放网站上传下载的资源
                |-----router #路由相关目录
                |-----app.js #网页的入口文件
                |-----package.json #基础信息文件

        2.6）安装mysql数据库
            #npm/cnpm install mysql


        2.7）安装moment 时间初始化插件（在将时间戳转换成时间的时候会用到）
            #npm/cnpm install moment


        2.8）安装文件上传模块 multer
            #npm/cnpm install multer

        2.9）安装富文本编辑器模块 ueditor(ueditor没有nodejs版本，我们需要安装这个用于提供支持)
            #npm/cnpm install ueditor
            安装参考：https://blog.csdn.net/qq_30100043/article/details/77527934
                     https://blog.csdn.net/a1104258464/article/details/52231737

            代码高亮插件prism,配合ueditor使用 
            安装参考：https://blog.csdn.net/u013182762/article/details/60962434

        
        3.0）安装session模块 （实现用户持久登录）
            #npm/cnpm install express-session

界面预览
=================================     
    前台界面
![Image text](https://github.com/huangshaomo/photo/blob/master/github_img1.jpg)

