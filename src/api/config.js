export const commonParams = {
  g_tk: 5381,
  format: 'json',
  inCharset: 'utf-8',
  outCharset: 'utf-8',
  notice: 0
}
export const options = {
  param: 'jsonpCallback'
}

const urlMap = {
  development: '/',
  production: '/music/'
}

// https://wiselee.cn/music/
export const baseUrl = urlMap[process.env.NODE_ENV]

export const ERR_OK = 0
