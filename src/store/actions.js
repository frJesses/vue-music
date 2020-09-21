import * as types from './mutations-type'

// 1. 设置播放
export const setPlay = function({ commit }, { list, index }) {
  commit(types.SET_PLAYLIST, list)
  commit(types.SET_SEQUENCELIST, list)
  commit(types.SET_FULLSCREEN, true)
  commit(types.SET_PLAYING, true)
  commit(types.SET_CURRENTINDEX, index)
}