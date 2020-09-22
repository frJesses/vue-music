import { getLyric } from 'api/singer'
import { Base64 } from 'js-base64'
import { ERR_OK } from '../../api/config'

// 创建歌曲类
export default class Song {
  constructor(props) {
    this.id = 0
    this.mid = 0
    this.singer = 0
    this.name = 0
    this.album = 0
    this.duration = 0
    this.image = 0
    this.url = 0
    Object.assign(this, props)
    return this
  }
  // 获取歌词
  getLyrics() {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }
    return new Promise((resolve, reject) => {
      getLyric(this.mid).then(res => {
        if (res.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        } else {
          reject(new Error('no lyric'))
        }
      })
    })
  }
}

// 创建歌曲类
export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`
  })
}

function filterSinger(singer) {
  let ret = []
  if (singer.length === 0) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}