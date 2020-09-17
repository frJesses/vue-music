import { baseUrl, commonParams } from "./config";
import axios from 'axios'

// 1. 获取首页歌单的数据
export function  getSongList() {
  const url = baseUrl + 'api/getSongList'
  const data = Object.assign({}, commonParams, {
    picmid: 1,
    rnd: Math.random(),
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq.json',
    needNewCode: 0,
    categoryId: 10000000,
    sortId: 5,
    sin: 0,
    ein: 19
  })
  // 发送请求
  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}