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


// 2. 获取每日推荐的数据
// 获取歌单详细歌曲
export function getDiscSong(disstid) {
  const url = baseUrl + 'api/getDiscSong'
  const data = Object.assign({}, commonParams, {
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    new_format: 1,
    disstid: disstid,
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq.json',
    needNewCode: 0
  })
  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}