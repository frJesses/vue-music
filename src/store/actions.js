import { playMode } from "../common/js/config";
import * as types from './mutations-type'
import {shuffer} from "../common/js/utils";
import { saveHistory, deleteHistory, clearAllHistory, savePlayHistory, saveFavoriteSong,
  deleteFavoriteSong } from 'common/js/cache'


// 1. 设置播放
export const setPlay = function({ commit, state }, { list, index }) {
  commit(types.SET_SEQUENCELIST, list)
  if (state.mode === playMode.random) {
    let randomList = shuffer(list)
    commit(types.SET_PLAYLIST, randomList)
    index = findIndex(randomList, list[index])
  }else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_FULLSCREEN, true)
  commit(types.SET_PLAYING, true)
  commit(types.SET_CURRENTINDEX, index)
}

// 2. 随机播放
export const randomPlay = function ({ commit }, { list }) {
  commit(types.SET_MODE, playMode.random)
  commit(types.SET_SEQUENCELIST, list)
  let randomList = shuffer(list)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_CURRENTINDEX, 0)
  commit(types.SET_FULLSCREEN, true)
  commit(types.SET_PLAYING, true)
}

// 查找索引值
function findIndex(arr, song) {
  return arr.findIndex(item => {
    return item.id === song.id
  })
}

// 3. 插入歌曲
export const insertSong = function ({commit, state}, song) {
  // 获取副本
  let playList = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  // 记录当前歌曲
  let currentSong = playList[currentIndex]
  // 查找插入的歌曲存不存在
  let fpIndex = findIndex(playList, song)
  // 因为插入所以index+1
  currentIndex++
  // 插入歌曲到当前位置
  playList.splice(currentIndex, 0, song)

  // 如果列表中已经有了
  if (fpIndex > -1) {
    // 如果当前的插入的序号小于列表中的序号
    if (currentIndex > fpIndex) {
      playList.splice(fpIndex, 1)
      currentIndex--
    } else {
      playList.splice(fpIndex + 1, 1)
    }
  }

  let currentSIndex = findIndex(sequenceList,currentSong) + 1
  let fsIndex = findIndex(sequenceList,song)
  sequenceList.splice(currentSIndex,0,song)
  if(fsIndex > -1){
    if(currentSIndex > fsIndex){
      sequenceList.splice(fsIndex,1)
    }else{
      sequenceList.splice(fsIndex + 1,1)
    }
  }
  commit(types.SET_PLAYLIST,playList)
  commit(types.SET_SEQUENCELIST,sequenceList)
  commit(types.SET_CURRENTINDEX,currentIndex)
  commit(types.SET_FULLSCREEN, true)
  commit(types.SET_PLAYING, true)
}

// 4. 保存搜索历史
export const saveSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, saveHistory(query))
}

// 5. 删除搜索历史
export const deleteSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, deleteHistory(query))
}

// 6. 清除所有的搜索历史
export const clearAllSearchHistory = function ({commit}) {
  commit(types.SET_SEARCH_HISTORY, clearAllHistory())
}

// 7. 删除列表中的歌曲
export const deleteOneSong = function ({commit, state}, song) {
  let playList = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  // 查找要删除歌曲再playList中的索引值
  let pIndex = findIndex(playList, song)
  playList.splice(pIndex, 1)
  let sIndex = findIndex(sequenceList, song)
  sequenceList.splice(sIndex, 1)
  // 如果播放歌曲在要删除歌曲的后面，则索引值需要减1
  if (currentIndex > pIndex || currentIndex === playList.length) {
    currentIndex--
  }
  commit(types.SET_SEQUENCELIST, sequenceList)
  commit(types.SET_PLAYLIST, playList)
  commit(types.SET_CURRENTINDEX, currentIndex)

  let playIng = playList.length > 0
  commit(types.SET_PLAYING, playIng)
}

// 8. 删除列表中所有的歌曲
export const deleteAllSong = function ({commit}) {
  commit(types.SET_SEQUENCELIST, [])
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_CURRENTINDEX, -1)
  commit(types.SET_PLAYING, false)
}

// 9. 记录播放歌曲历史记录
export const setPlayHistory = function ({commit}, song) {
  commit(types.SET_PLAY_HISTORY, savePlayHistory(song))
}

// 10. 保存喜欢的歌曲
export const saveFavorite = function ({commit}, song) {
  commit(types.SET_FAVORITE, saveFavoriteSong(song))
}

// 11. 删除喜欢的歌曲
export const deleteFavorite = function ({commit}, song) {
  commit(types.SET_FAVORITE, deleteFavoriteSong(song))
}