// date.js
export function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
}

function padLeftZero(str) {
  return ('00' + str).substr(str.length);
}

export function str2Date(dateStr, separator) {
  if (!separator) {
    separator = "-";
  }
  let dateArr = dateStr.split(separator);
  let year = parseInt(dateArr[0]);
  let month;
  //处理月份为04这样的情况
  if (dateArr[1].indexOf("0") == 0) {
    month = parseInt(dateArr[1].substring(1));
  } else {
    month = parseInt(dateArr[1]);
  }
  let day = parseInt(dateArr[2]);
  let date = new Date(year, month - 1, day);
  return date;
}

export function getDefaultTime(dateRange = '') {
  // 默认查询7天内的数据
  let dateNum = isNaN(dateRange) ? 7 : dateRange;

  let today = new Date(new Date().toLocaleDateString()).getTime();

  let timeBegin = '';
  let timeEnd = '';
  if (dateNum == -1) {
    timeBegin = new Date();
    timeEnd = new Date();
    timeBegin.setTime(today - 3600 * 24 * 1000);
    timeEnd.setTime(today - 1000);
  } else {
    timeBegin = today - 3600 * 24 * dateNum * 1000;
    timeEnd = today + 3600 * 24 * 1000 - 1000;
  }

  let date = [];
  date.push(formatDate(new Date(timeBegin), 'yyyy-MM-dd hh:mm:ss'));
  date.push(formatDate(new Date(timeEnd), 'yyyy-MM-dd hh:mm:ss'));

  return date;
}

export function getDefaultDate(dateRange = '') {
  // 默认查询7天内的数据
  let dateNum = isNaN(dateRange) ? 7 : dateRange;

  let today = new Date(new Date().toLocaleDateString()).getTime();

  let timeBegin = '';
  let timeEnd = '';
  if (dateNum == -1) {
    timeBegin = new Date();
    timeEnd = new Date();
    timeBegin.setTime(today - 3600 * 24 * 1000);
    timeEnd.setTime(today - 1000);
  } else {
    timeBegin = today - 3600 * 24 * dateNum * 1000;
    timeEnd = today + 3600 * 24 * 1000 - 1000;
  }

  let date = [];
  date.push(formatDate(new Date(timeBegin), 'yyyy-MM-dd'));
  date.push(formatDate(new Date(timeEnd), 'yyyy-MM-dd'));

  return date;
}
