export function debounce(func, delay=50) {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

export function formatDate(date, fmt) {
  // 1、获取年份
  // y+ -> 表示匹配一个或者多个
  // y* -> 表示匹配0个或者多个
  // y? -> 表示匹配0个或者1个
  // 2019
  // yy - 19
  // yyyy - 2019
  // y - 9
  // yyy - 019
  // yyyy-MM-dd
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    // yyyy
    // fmt = fmt.replace(‘yyyy’, (2019 + '').substr(4 - 4));
    // yy
    // fmt = fmt.replace(‘yy’, (2019 + '').substr(4 - 2));
  }
  // 2、获取
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(), // h和H
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

// 防止这种情况4:4:4
function padLeftZero (str) {
  // 04 ->   ('00' + 04).substr(2) = 04
  // 4 ->  ('00' + 4).substr(1) = 04
  return ('00' + str).substr(str.length);
}