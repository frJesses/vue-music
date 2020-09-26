function getMaxValue(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function shuffer(arr) {
  let _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    let j = getMaxValue(0, i)
    let temp = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = temp
  }
  return _arr
}