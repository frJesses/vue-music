import { baseUrl, commonParams } from './config'
import axios from 'axios'

// 获取歌手
export function getSingerList(letter, area = -100) {
  const url = baseUrl + 'api/getSingerList'
  const data = Object.assign({}, commonParams, {
    '-': 'getUCGI15774718990432723',
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq.json',
    needNewCode: 0,
    data: {
      comm: {
        ct: 24,
        cv: 0
      },
      singerList: {
        module: 'Music.SingerListServer',
        method: 'get_singer_list',
        param: {
          area: area,
          sex: -100,
          genre: -100,
          index: letter,
          sin: 0,
          cur_page: 1
        }
      }
    }
  })
  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

// 获取歌手歌曲数据
export function getSingerSongs(singer) {
  const url = baseUrl + 'api/getSingerSongs'
  const data = Object.assign({}, commonParams, {
    uin: 0,
    platform: 'h5page',
    needNewCode: 1,
    order: 'listen',
    from: 'h5',
    num: 15,
    begin: singer.num * 15,
    singerid: singer.singer_id,
    singermid: singer.singer_mid
  })
  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

// 获取歌曲的vkey
export function getSongVkey(songmid) {
  const url = '/api/getSongVkey'
  const data = Object.assign({}, commonParams, {
    '-': 'getplaysongvkey06362299039050012',
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq.json',
    needNewCode: 0,
    data: {
      req: {
        module: 'CDN.SrfCdnDispatchServer',
        method: 'GetCdnDispatch',
        param: {
          guid: '6532953658',
          calltype: 0,
          userip: ''
        }
      },
      req_0: {
        module: 'vkey.GetVkeyServer',
        method: 'CgiGetVkey',
        param: {
          guid: '6532953658',
          songmid: [songmid],
          songtype: [0],
          uin: '0',
          loginflag: 1,
          platform: '20'
        }
      },
      comm: {
        uin: 0,
        format: 'json',
        ct: 24,
        cv: 0
      }
    }
  })
  return axios.get(url, {
    params: data
  }).then(res => {
    // 返回vkey
    return Promise.resolve(res.data.req_0.data.midurlinfo[0].purl)
  })
}

// 获取歌词
export function getLyric(songmid) {
  const url = baseUrl + 'api/getLyric'
  const data = Object.assign({}, commonParams, {
    '-': 'MusicJsonCallback_lrc',
    pcachetime: 1566728079648,
    songmid: songmid,
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
