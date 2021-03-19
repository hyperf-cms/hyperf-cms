/**
 *
 * @param {*} src 文件url链接
 * @param {*} fileName 文件名+后缀
 * @param {*} fileType 文件类型（后缀）
 * @param {*} isNotImage 是否是图片
 */
export function download(src, fileName, fileType, isNotImage) {
  if (isNotImage) {
    //判断是否为chrome里的图片
    fileLinkToStreamDownload(src, fileName, fileType);
  } else {
    ImgtodataURL(src, fileName, fileType);
  }
}

function fileLinkToStreamDownload(url, fileName, type) {
  let xhr = new XMLHttpRequest();
  xhr.open("get", url, true);
  xhr.setRequestHeader("Content-type", `application/${type}`);
  xhr.responseType = "blob";
  xhr.onload = function() {
    if (this.status == 200) {
      var blob = this.response;
      downloadNormalFile(blob, fileName);
    }
  };
  xhr.send();
}

function downloadNormalFile(blob, filename) {
  var eleLink = document.createElement("a");
  let href = blob;
  if (typeof blob == "string") {
    eleLink.target = "_blank";
  } else {
    href = window.URL.createObjectURL(blob); //创建下载的链接
  }
  eleLink.href = href;
  eleLink.download = filename; //下载后文件名
  eleLink.style.display = "none";
  // 触发点击
  document.body.appendChild(eleLink);
  eleLink.click(); //点击下载
  //下载完成移除元素
  document.body.removeChild(eleLink);
  if (typeof blob == "string") {
    window.URL.revokeObjectURL(href); //释放掉blob对象
  }
}

function ImgtodataURL(url, filename, fileType) {
  getBase64(url, fileType, _baseUrl => {
    // 创建隐藏的可下载链接
    var eleLink = document.createElement("a");
    eleLink.download = filename;
    eleLink.style.display = "none";
    // 图片转base64地址
    eleLink.href = _baseUrl;
    // 触发点击
    document.body.appendChild(eleLink);
    eleLink.click();
    // 然后移除
    document.body.removeChild(eleLink);
  });
}

/**
 * 通过构造函数来创建的 img 实例，在赋予 src 值后就会立刻下载图片
 * @param {*} url
 * @param {*} fileType
 * @param {*} callback
 */
function getBase64(url, fileType, callback) {
  var Img = new Image(),
    dataURL = "";
  Img.src = url;
  Img.setAttribute("crossOrigin", "anonymous");
  Img.onload = function() {
    //要先确保图片完整获取到，这是个异步事件
    var canvas = document.createElement("canvas"), //创建canvas元素
      width = Img.width, //确保canvas的尺寸和图片一样
      height = Img.height;
    canvas.width = width;
    canvas.height = height;
    canvas.getContext("2d").drawImage(Img, 0, 0, width, height); //将图片绘制到canvas中
    dataURL = canvas.toDataURL("image/" + fileType); //转换图片为dataURL
    callback ? callback(dataURL) : null;
  };
}

/**
 * 使用方法
 * fileByBase64(file, (base64) => {
      console.log(base64) 
   })
 * 上传附件转base64
 * @param {File} file 文件流
 */
export const fileByBase64 = (file, callback) => {
  var reader = new FileReader();
  // 传入一个参数对象即可得到基于该参数对象的文本内容
  reader.readAsDataURL(file);
  reader.onload = function(e) {
    // target.result 该属性表示目标对象的DataURL
    callback(e.target.result);
  };
};

/**
 * 将字节转换成合适单位
 * @param {*} size
 */
export function getfilesize(size) {
  //把字节转换成正常文件大小
  if (!size) return "";
  var num = 1024.0; //byte
  if (size < num) return size + "B";
  if (size < Math.pow(num, 2)) return (size / num).toFixed(2) + "KB"; //kb
  if (size < Math.pow(num, 3))
    return (size / Math.pow(num, 2)).toFixed(2) + "MB"; //M
  if (size < Math.pow(num, 4))
    return (size / Math.pow(num, 3)).toFixed(2) + "G"; //G
  return (size / Math.pow(num, 4)).toFixed(2) + "T"; //T
}
