// 1. 判断有没有该类名
export function hasClass(el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(&|\\s)');
  return reg.test(el.className)
}

// 2. 添加没有的类名
export function addClass(el, className) {
  // 判断有没有指定的类名
  if (hasClass(el, className)) {
    return
  }
  let newClass = el.className.split(' ');
  newClass.push(className)
  el.className = newClass.join(' ')
}

// 3. 获取自定义属性
export function getData(el, name, value) {
  const prefix = 'data-'
  name = prefix + name
  if (value) {
    return el.setAttribute(name, value)
  }else {
    return el.getAttribute(name)
  }
}