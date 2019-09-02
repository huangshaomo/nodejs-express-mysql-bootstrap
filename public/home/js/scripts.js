//当浏览器窗口大小改变时重载网页
/*window.onresize=function(){
    window.location.reload();
}*/

//页面加载-NProgress插件
$('body').show();
$('.version').text(NProgress.version);
NProgress.start();
setTimeout(function () {
    NProgress.done();
    $('.fade').removeClass('out');
}, 1000);

//页面加载时给img和a标签添加draggable属性
(function () {
    $('img').attr('draggable', 'false');
    $('a').attr('draggable', 'false');
})();

//设置Cookie
function setCookie(name, value, time) {
    var strsec = getsec(time);
    var exp = new Date();
    exp.setTime(exp.getTime() + strsec * 1);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString(); //toGMTString() 方法可根据格林威治时间 (GMT) 把 Date 对象转换为字符串，并返回结果。
}
function getsec(str) {
    var str1 = str.substring(1, str.length) * 1;
    var str2 = str.substring(0, 1);
    if (str2 == "s") {
        return str1 * 1000;//秒
    } else if (str2 == "h") {
        return str1 * 60 * 60 * 1000;//小时
    } else if (str2 == "d") {
        return str1 * 24 * 60 * 60 * 1000;//24小时
    }
}

//获取Cookie
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
        return unescape(arr[2]);
    } else {
        return null;
    }
}

//导航栏智能定位
$.fn.navSmartFloat = function () {
    var position = function (element) {
        var top = element.position().top,
            pos = element.css("position");
        $(window).scroll(function () {
            var scrolls = $(this).scrollTop();
            if (scrolls > top) { //如果滚动到页面超出了当前元素element的相对页面顶部的高度
                $('.header-topbar').fadeOut(0);
                $('.header-topbar2').fadeIn(0);
                if (window.XMLHttpRequest) { //如果不是ie6
                    element.css({
                        position: "fixed",
                        top: 0
                    }).addClass("shadow");
                } else { //如果是ie6
                    element.css({
                        top: scrolls
                    });
                }
            } else {
                $('.header-topbar').fadeIn(500);
                $('.header-topbar2').fadeOut(0);
                element.css({
                    position: pos,
                    top: top
                }).removeClass("shadow");
            }
        });
    };
    return $(this).each(function () {
        position($(this));
    });
};

//启用导航定位
$("#navbar").navSmartFloat();

//返回顶部按钮
$("#gotop").hide();
$(window).scroll(function () {
    if ($(window).scrollTop() > 100) {
        $("#gotop").fadeIn();
    } else {
        $("#gotop").fadeOut();
    }
});
$("#gotop").click(function () {
    $('html,body').animate({
        'scrollTop': 0
    }, 500);
});

//图片延时加载
$("img.thumb").lazyload({
    placeholder: "/public/home/images/occupying.png",
    effect: "fadeIn"
});
$(".single .content img").lazyload({
    placeholder: "/public/home/images/occupying.png",
    effect: "fadeIn"
});

//IE6-9禁止用户选中文本
document.body.onselectstart = document.body.ondrag = function () {
    return false;
};

//启用工具提示
$('[data-toggle="tooltip"]').tooltip();


//无限滚动反翻页
jQuery.ias({
    history: false,
    container: '.content',
    item: '.excerpt',
    pagination: '.pagination',
    next: '.next-page a',
    trigger: '查看更多',
    loader: '<div class="pagination-loading"><img src="public/home/images/loading.gif" /></div>',
    triggerPageThreshold: 5,
    onRenderComplete: function () {
        $('.excerpt .thumb').lazyload({
            placeholder: 'public/home/images/occupying.png',
            threshold: 400
        });
        $('.excerpt img').attr('draggable', 'false');
        $('.excerpt a').attr('draggable', 'false');
    }
});

//鼠标滚动超出侧边栏高度绝对定位
$(window).scroll(function () {
    var sidebar = $('.sidebar');
    var sidebarHeight = sidebar.height();
    var windowScrollTop = $(window).scrollTop();
    if (windowScrollTop > sidebarHeight - 60 && sidebar.length) {
        $('.fixed').css({
            'position': 'fixed',
            'top': '70px',
            'width': '360px'
        });
    } else {
        $('.fixed').removeAttr("style");
    }
});

//禁止右键菜单
/*window.oncontextmenu = function(){
	return false;
};*/

/*自定义右键菜单*/
(function () {
    var oMenu = document.getElementById("rightClickMenu");
    var aLi = oMenu.getElementsByTagName("li");
    //加载后隐藏自定义右键菜单
    //oMenu.style.display = "none";
    //菜单鼠标移入/移出样式
    for (i = 0; i < aLi.length; i++) {
        //鼠标移入样式
        aLi[i].onmouseover = function () {
            $(this).addClass('rightClickMenuActive');
            //this.className = "rightClickMenuActive";
        };
        //鼠标移出样式
        aLi[i].onmouseout = function () {
            $(this).removeClass('rightClickMenuActive');
            //this.className = "";
        };
    }
    //自定义菜单
    document.oncontextmenu = function (event) {
        $(oMenu).fadeOut(0);
        var event = event || window.event;
        var style = oMenu.style;
        $(oMenu).fadeIn(300);
        //style.display = "block";
        style.top = event.clientY + "px";
        style.left = event.clientX + "px";
        return false;
    };
    //页面点击后自定义菜单消失
    document.onclick = function () {
        $(oMenu).fadeOut(100);
        //oMenu.style.display = "none"
    }
})();

/*禁止键盘操作*/
document.onkeydown = function (event) {
    var e = event || window.event || arguments.callee.caller.arguments[0];
    if ((e.keyCode === 123) || (e.ctrlKey) || (e.ctrlKey) && (e.keyCode === 85)) {
        return false;
    }
};

/*文章评论*/
$(function () {
    $("#comment-submit").click(function () {
        var imgSrc = $('.comment-title').find("img").attr("src");
        var commentContent = $("#comment-textarea");//文本区
        var commentButton = $("#comment-submit");   //提交按钮
        var promptBox = $('.comment-prompt');       //提交内容展示框
        var promptText = $('.comment-prompt-text'); //内容
        var articleid = $('.articleid').val();      //获取隐藏框内容
        var loginUsesr = $('.loginUser').val();
        promptBox.fadeIn(400);
        if (!imgSrc) {
            var str = '<a data-toggle="modal" data-target="#loginModal2">登录?</a>';
            promptText.html("请登录后再进行评论" + `  ` + str);
            commentButton.attr('disabled', true);
            commentButton.addClass('disabled')
            return false;
        } else {
            if (commentContent.val() === '') {
                promptText.text('请留下您的评论');
                return false;
            }
            commentButton.attr('disabled', true);
            commentButton.addClass('disabled');
            promptText.text('正在提交...');
            $.ajax({
                type: "POST",
                url: "/comment",
                //url:"/Article/comment/id/" + articleid,   
                data: {
                    commentContent: replace_em(commentContent.val()),
                    news_id: articleid,
                    user_name: loginUsesr

                },
                cache: false, //不缓存此页面  
                success: function (data) {
                    if (data.ok) {
                        promptText.text(data.msg);
                        window.location.reload();
                    } else {
                        promptText.text(data.msg);
                    }
                    commentContent.val(null);//清空输入框
                    $(".commentlist").fadeIn(300);
                    /*$(".commentlist").append();*/
                    commentButton.attr('disabled', false);
                    commentButton.removeClass('disabled');
                }
            });
            /*$(".commentlist").append(replace_em(commentContent.val()));*/
            promptBox.fadeOut(4000);
            return false;
        }
    });
});
//对文章内容进行替换_将icon替换成图片地址
function replace_em(str) {
    str = str.replace(/\</g, '&lt;');
    str = str.replace(/\>/g, '&gt;');
    str = str.replace(/\[em_([0-9]*)\]/g, '<img src="/public/home/images/arclist/$1.gif" border="0" />');
    return str;
}
// 用户登录注册
$(function () {
    $('#isLogining').val()
    $("#login_btn").click(function () {
      $.ajax({
        url: '/login',
        type: 'post',
        data: {
          act: 'login',
          username: $("#username").val(),
          password: $("#password").val()
        },
        success: function (json) {
          if (json.ok) {
            alert(json.username + "" + json.msg);
          } else {
            alert(json.msg);
          }

          if (json.username) {
            $('#loginBox').addClass('hide');
            $('#widget').removeClass('hide');
            window.location.reload();
          }
          $('#loginModal').modal('toggle');
        },
        error: function (err) {
          console.log(err);
        }
      });
    });
    // 用户注册判断
    $("#reg_btn").click(function () {
      $.ajax({
        url: "/reg",
        type: "post",
        data: {
          username: $("#regUsername").val(),
          password: $("#regPassword").val(),
          repassword: $("#regRepassword").val(),
        },
        success: function (json) {
          if (json.ok) {
            $('#regModal').modal('toggle');
            window.location.reload();
          }
          alert(json.msg);

        },
        error: function (err) {
          console.log(err);
        }
      });
    });
  });
// 退出登录
function logout() {
    $.get("/ajax_logout", function (data) {
        if (data.ok) {
            window.location.reload();
        }
    })
}

// var num = $(this).html();
//         $(this).toggleClass('zaned');
//         if ($(this).hasClass('zaned')) {
//             num++;
//             console.log(num);
//         } else {
//             num--;
//             console.log(num);
//         }
//Console
try {
    if (window.console && window.console.log) {
        console.log("\n欢迎访问黄绍模博客！\n\n在本站可以看到前端技术，后端程序，网站内容管理系统等文章；\n\n还有我的程序人生！！！\n");
        console.log("\nPOWERED BY WY ALL RIGHTS RESERVED");
    }
} catch (e) { };