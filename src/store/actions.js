import { playMode } from "../common/js/config";
import * as types from './mutations-type'
import {shuffer} from "../common/js/utils";


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