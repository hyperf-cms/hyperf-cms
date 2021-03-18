import { confirm } from "element-ui";

/**
 * 多维数组指定子项扁平化函数
 * @param array              要执行的扁平化数组
 * @param childrenKeys       要参与扁平的子键名数组 默认 ['children']
 * @param flattenParent      默认的父数组
 * @param flattenParentKey   被压平后子项父数组存放键名
 * @returns {Array}
 */
export function arrayChildrenFlatten(
  array,
  { childrenKeys, flattenParent, flattenParentKey } = {}
) {
  childrenKeys = childrenKeys || ["children"];
  flattenParent = flattenParent || [];
  flattenParentKey = flattenParentKey || "flattenParent";
  const result = [];
  array.forEach(item => {
    const flattenItem = JSON.parse(JSON.stringify(item));
    // flattenItem[flattenParentKey] = flattenParent;
    result.push(flattenItem);
    childrenKeys.forEach(key => {
      if (item[key] && Array.isArray(item[key])) {
        const children = arrayChildrenFlatten(item[key], {
          childrenKeys,
          // flattenParent: [...flattenParent, item],
          flattenParentKey
        });
        result.push(...children);
      }
    });
  });
  return result;
}

export function arrayLookup(data, key, value, targetKey = "") {
  var targetValue = "";
  for (var i = 0; i < data.length; i++) {
    if (data[i][key] == value) {
      if (targetKey == "") {
        targetValue = data[i];
      } else {
        targetValue = data[i][targetKey];
      }
      break;
    }
  }
  return targetValue;
}

/**
 * 生成TXT并下载
 * @param string  下载文件名名称
 * @param string  文件内容
 */
export function createTxt(filename, text) {
  var element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 * @param {*} rootId 根Id 默认 0
 */
export function handleTree(data, id, parentId, children, rootId) {
  id = id || "id";
  parentId = parentId || "parentId";
  children = children || "children";
  rootId =
    rootId ||
    Math.min.apply(
      Math,
      data.map(item => {
        return item[parentId];
      })
    ) ||
    0;
  //对源数据深度克隆
  const cloneData = JSON.parse(JSON.stringify(data));
  //循环所有项
  const treeData = cloneData.filter(father => {
    let branchArr = cloneData.filter(child => {
      //返回每一项的子级数组
      return father[id] === child[parentId];
    });
    branchArr.length > 0 ? (father.children = branchArr) : "";
    //返回第一层
    return father[parentId] === rootId;
  });
  return treeData != "" ? treeData : data;
}

/**
 * 上传附件转base64
 * @param {File} file 文件流
 */
export const fileByBase64 = (file, callback) => {
  var reader = new FileReader();
  // 传入一个参数对象即可得到基于该参数对象的文本内容
  reader.readAsDataURL(file);
  reader.onload = function (e) {
    // target.result 该属性表示目标对象的DataURL
    callback(e.target.result)
  };
}


/**
 * 随机生成消息ID
 */
export function generateUUID() {
  var d = new Date().getTime();
  if (window.performance && typeof window.performance.now === "function") {
    d += performance.now(); //use high-precision timer if available
  }
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(
    c
  ) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}