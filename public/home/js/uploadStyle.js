/**
 * @param {*} fileDIV 上传区域，是一个dom元素
 * @param {*} boxSize 容纳图片的盒子尺寸
 */
function uploads(fileDIV, boxSize) {
    var config = {
        div: document.createElement('div'),
        upload: document.createElement("div"),
        showImg: document.createElement("img"),
        remove :document.createElement('div'),
    }
    // 创建一个区域，用于存放上传按钮跟图片
    createDom();
    // 绑定事件区域
    bindEvent();

    // 初始化上传区域
    function createDom() {
        var div = config.div;
        div.className = "file";
        div.style.position = "relative";
        div.style.display = "inline-block";
        div.style.perspective = "800px";
        div.style.transformStyle = 'preserve-3d';
        div.style.width = boxSize + 'px';
        fileDIV.parentNode.insertBefore(div, fileDIV);
        fileDIV.parentNode.appendChild(div);
        div.appendChild(fileDIV);
        var upload = config.upload;
        upload.className = "upload";
        upload.innerHTML = '上传图片';
        upload.style.backgroundColor = '#3399cc';
        upload.style.color = '#fff';
        upload.style.width = '100%';
        upload.style.textAlign = 'center';
        upload.style.border = '0 none';
        upload.style.outline = '0 none';
        upload.style.lineHeight = '30px';
        upload.style.cursor = 'pointer';
        upload.style.borderRadius = '5px';
        div.insertBefore(upload, fileDIV);
        var showImg = config.showImg;
        showImg.setAttribute('alt', '未选择任何文件');
        showImg.setAttribute('width', boxSize);
        showImg.setAttribute('height', boxSize);
        showImg.style.display = 'none';
        showImg.style.boxSizing = 'border-box';
        showImg.style.margin = '10px 0';
        showImg.style.transition = 'all 0.3s ease-in-out';
        insertAfter(showImg, fileDIV);
        fileDIV.style.position = 'absolute';
        fileDIV.style.top = '99999em';
        // fileDIV.style.visibility = 'hidden';
    }
    // 绑定事件
    function bindEvent() {
        config.showImg.onmouseenter = function () {
            config.showImg.style.boxShadow = '0 0 5px rgba(20,20,20,0.7)';
            config.showImg.style.transform = 'scaleY(1.01)';
        }
        config.showImg.onmouseleave = function () {
            config.showImg.style.boxShadow = '';
            config.showImg.style.transform = '';

        }
        // 移除图片
        config.remove.onclick = function () {
            fileDIV.value = '';
            config.showImg.style.display = 'none';
            config.remove.innerHTML = '';
            return;

        }
        // 上传
        config.upload.onclick = function(){
            fileDIV.click();
        }
        fileDIV.onchange = function () {
            config.showImg.onload = function(){
                config.showImg.style.display = 'block';
                config.remove.className = 'remove';
                config.remove.innerHTML = 'X';
                config.remove.style.position = 'absolute';
                config.remove.style.right = '5px';
                config.remove.style.top = '40px';
                config.remove.style.color = '#fff';
                config.remove.style.zIndex = '10';
                config.remove.style.cursor = 'pointer';
                insertAfter(config.remove, fileDIV, config.showImg);
            }
            var str = this.files[0].name;
            var size = this.files[0].size;
            var arr = str.split("\\");//分隔图片路径
            var filename = arr[arr.length - 1];//获取图片名称
            var fileExtArr = filename.split(".");//分隔格式图片
            var fileExt = fileExtArr[fileExtArr.length - 1];//获取图片后缀
            // 判断文件类型
            if (fileExt != 'jpg' && fileExt != 'gif' && fileExt != 'png' && fileExt != 'jpeg') {
                alert('请上传jpg,gif,png,jpeg格式的图片');
                this.value = '';
                config.showImg.style.display = 'none';
                return;
            }
            // 判断文件大小
            var fileSize = 1024 * 1024 * 2;
            if (size >= fileSize) {
                alert("上传图片不得大于2M");
                this.value = '';
                config.showImg.style.display = 'none';
                return;
            }
            //创建fileReader对象
            var reader = new FileReader();
            //图片编码完成
            reader.onloadend = function (e) {
                config.showImg.src = e.target.result;
                console.log(reader.result);
            }
            //解析图片 成base 64位的图片 用fileReader的readAsDataURL 去读本地图片对象
            reader.readAsDataURL(this.files[0]);
        }
    }
    function insertAfter(newElement,targetElement){
        var parent = targetElement.parentNode;
        if(parent.lastChild == targetElement){
            parent.appendChild(newElement);
        }else{
            parent.insertBefore(newElement,targetElement.nextSibling);
        }
    }

}