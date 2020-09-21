import { playMode } from 'common/js/config.js'
const state = {
  singer: [], // 记录歌手信息
  playing: false, // 记录播放状态
  fullScreen: false, // 记录是否全屏
  mode: playMode.sequence, // 记录歌曲的播放模式
  playList: [], // 记录播放歌曲的列表
  sequenceList: [], // 记录各种模式下的列表
  currentIndex: -1  // 记录播放歌曲的索引值
}

export default state