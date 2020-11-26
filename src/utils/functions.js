import { confirm } from 'element-ui'

/**
 * 多维数组指定子项扁平化函数
 * @param array              要执行的扁平化数组
 * @param childrenKeys       要参与扁平的子键名数组 默认 ['children']
 * @param flattenParent      默认的父数组
 * @param flattenParentKey   被压平后子项父数组存放键名
 * @returns {Array}
 */
export function arrayChildrenFlatten(array, { childrenKeys, flattenParent, flattenParentKey } = {}) {
  childrenKeys = childrenKeys || ['children'];
  flattenParent = flattenParent || [];
  flattenParentKey = flattenParentKey || 'flattenParent';
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
          flattenParentKey,
        });
        result.push(...children);
      }
    });
  });
  return result;
}

export function arrayLookup(data, key, value, targetKey) {
  var targetValue = "";
  for (var i = 0; i < data.length; i++) {
    if (data[i][key] == value) {
      targetValue = data[i][targetKey];
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
      var element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
      element.setAttribute('download', filename);

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    }