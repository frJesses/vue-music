export const singer = state => state.singer

export const playing  = state => state.playing

export  const fullScreen = state => state.fullScreen

export const mode = state => state.mode

export const playList = state => state.playList

export const sequenceList = state => state.sequenceList

export const currentIndex = state => state.currentIndex

export const currentSong = state => {
  return state.playList[state.currentIndex] || {}
}

export const disc = state => state.disc

export const toplist = state => state.toplist

export const searchHistory = state => state.list.searchHistory

export const playHistory = state => state.list.playHistory

export const favoriteSong = state => state.list.favoriteSong

export const user = state => state.list.user
