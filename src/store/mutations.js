import * as types from './mutations-type'

const mutations = {
  [types.SET_SINGER](state, singer) {
    state.singer = singer
  },
  [types.SET_PLAYING](state, playing) {
    state.playing = playing
  },
  [types.SET_FULLSCREEN](state, fullscreen) {
    state.fullScreen = fullscreen
  },
  [types.SET_MODE](state, mode) {
    state.mode = mode
  },
  [types.SET_PLAYLIST](state, playList) {
    state.playList = playList
  },
  [types.SET_SEQUENCELIST](state, sequenceList) {
    state.sequenceList = sequenceList
  },
  [types.SET_CURRENTINDEX](state, currentIndex) {
    state.currentIndex = currentIndex
  },
  [types.SET_DISC](state, disc) {
    state.disc = disc
  },
  [types.SET_TOPLIST](state, toplist) {
    state.toplist = toplist
  },
  [types.SET_SEARCH_HISTORY](state, history) {
    state.list.searchHistory = history
  },
  [types.SET_PLAY_HISTORY](state, history) {
    state.list.playHistory = history
  },
  [types.SET_FAVORITE](state, favorite) {
    state.list.favoriteSong = favorite
  },
  [types.SET_LIST_USER](state, user) {
    state.list.user = user
  }
}

export default mutations