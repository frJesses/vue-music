import storage from 'good-storage'

const HISTORY_KEY = '__search__'
const HISTORY_MAX_LENGTH = 10

const PLAY_KEY = '__play__'
const PLAY_HISTORY_LENGTH = 200

const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LENGTH = 50

// 插入元素
function insertArr(arr, val, compare, maxlength) {
  let index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxlength && arr.length > maxlength) {
    arr.pop()
  }
}

// 删除元素
function deleteFormArr(arr, compare) {
  let index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

// 1. 保存历史存储
export function saveHistory(query) {
  let searches = storage.get(HISTORY_KEY, [])
  insertArr(searches, query, item => {
    return item == query
  }, HISTORY_MAX_LENGTH)
  storage.set(HISTORY_KEY, searches)
  return searches
}

// 2. 加载历史存储
export function loadHistory() {
  return storage.get(HISTORY_KEY, [])
}

// 3. 删除历史存储
export function deleteHistory(query) {
  let searches = storage.get(HISTORY_KEY, [])
  deleteFormArr(searches, (item) => {
    return item === query
  })
  storage.set(HISTORY_KEY, searches)
  return searches
}

// 4. 清除所有的搜索历史
export function clearAllHistory() {
  storage.clear(HISTORY_KEY)
  return []
}

// 5. 记录播放歌曲的历史记录
export function savePlayHistory(song) {
  let songs = storage.get(PLAY_KEY, [])
  insertArr(songs, song, (item) => {
    return item.id === song.id
  }, PLAY_HISTORY_LENGTH)
  storage.set(PLAY_KEY, songs)
  return songs
}

// 6. 加载历史播放存储
export function loadPlayHistory() {
  return storage.get(PLAY_KEY, [])
}

// 7. 保存自己喜欢的歌曲
export function saveFavoriteSong(song) {
  let favorite = storage.get(FAVORITE_KEY, [])
  insertArr(favorite, song, (item) => {
    return item.id === song.id
  }, FAVORITE_MAX_LENGTH)
  storage.set(FAVORITE_KEY, favorite)
  return favorite
}

// 8. 删除自己喜欢的歌曲
export function deleteFavoriteSong(song) {
  let favorite = storage.get(FAVORITE_KEY, [])
  deleteFormArr(favorite, item => {
    return item.id === song.id
  })
  storage.set(FAVORITE_KEY, favorite)
  return favorite
}

// 9. 加载喜欢的歌曲
export function loadFavoriteSong() {
  return storage.get(FAVORITE_KEY, [])
}