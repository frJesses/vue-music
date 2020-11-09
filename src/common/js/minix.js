import { mapGetters, mapMutations, mapActions } from "vuex";
import { playMode } from 'common/js/config'
import { shuffer } from 'common/js/utils'

// 1. 用来处理 显示迷你播放器后 下边遮挡问题
export const playMinix = {
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  mounted() {
    this.handlePlayList(this.playList)
  },
  activated() {
    this.handlePlayList(this.playList)
  },
  watch: {
    playList(newList) {
      this.handlePlayList(newList)
    }
  },
  methods: {
    handlePlayList() {
      throw new Error('You need to handle the handleplaylist method')
    }
  }
}

// 2. 处理 player组件 和 playlist组件相同的代码
export const playerMinix = {
  computed: {
    ...mapGetters([
      'mode',
      'sequenceList',
      'currentSong',
      'playList',
      'favoriteSong'
    ]),
    modeIcon() {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop
        ? 'icon-loop' : 'icon-random'
    }
  },
  methods: {
    // 改变歌曲播放模式
    changeMode() {
      const mode = (this.mode + 1) % 3
      this.setMode(mode)
      // 如果是随机播放
      let list = null
      if (mode === playMode.random) {
        list = shuffer(this.sequenceList)
      }else {
        list = this.sequenceList
      }
      // 因为数组被打乱了，所以需要重新设置索引值
      this.getNewCurrentIndex(list)
      this.setPlayList(list)
    },
    // 重新设置索引值
    getNewCurrentIndex(list) {
      let index = list.findIndex(item => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    // 计算喜爱歌曲的icon
    getFavoriteIcon(song) {
      if (this.isFavorite(song)) {
        return 'icon-favorite'
      }
      return 'icon-not-favorite'
    },
    toggleIcon(song) {
      if (this.isFavorite(song)) {
        this.deleteFavorite(song)
      } else {
        this.saveFavorite(song)
      }
    },
    isFavorite(song) {
      let index = this.favoriteSong.findIndex(item => {
        return item.id === song.id
      })
      return index > -1
    },
    ...mapMutations({
      setMode: 'SET_MODE',
      setPlayList: 'SET_PLAYLIST',
      setCurrentIndex: 'SET_CURRENTINDEX',
      setPlaying: 'SET_PLAYING'
    }),
    ...mapActions([
      'saveFavorite',
      'deleteFavorite'
    ])
  }
}

// 3. 处理搜索框相同的逻辑
export const searchMinix = {
  data() {
    return {
      query: '',
      refreshDelay: 100
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ]),
  },
  methods: {
    // 点击每日推荐数据后进行搜索
    selectQuery(searchQuery) {
      this.$refs.searchBox && this.$refs.searchBox.setQuery(searchQuery)
    },
    // 设置query
    onQueryChange(query) {
      this.query = query
    },
    // 点击设置搜索历史
    saveHistory() {
      this.saveSearchHistory(this.query)
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory'
    ])
  }
}
