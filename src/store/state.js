import { playMode } from 'common/js/config.js'
import { loadHistory, loadPlayHistory, loadFavoriteSong } from 'common/js/cache'
const state = {
  singer: [], // 记录歌手信息
  playing: false, // 记录播放状态
  fullScreen: false, // 记录是否全屏
  mode: playMode.sequence, // 记录歌曲的播放模式
  playList: [], // 记录播放歌曲的列表
  sequenceList: [], // 记录各种模式下的列表
  currentIndex: -1,  // 记录播放歌曲的索引值
  disc: {},  // 记录热门歌单推荐数据
  toplist: {}, // 记录排行数据
  isLogin: false,  // 记录是否登录
  list: {
    user: '123456',   // 记录用户名
    searchHistory: loadHistory(),  // 记录搜索历史
    playHistory: loadPlayHistory(), // 记录历史播放歌曲
    favoriteSong: loadFavoriteSong(), // 记录自己喜欢的歌曲
  }
}

export default state