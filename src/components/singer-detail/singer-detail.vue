<template>
  <transition name="slide">
    <music-list :title="title" :bg-img="bgImg" :song="song" @scrollEnd="scrollEnd" />
  </transition>
</template>

<script>
  import MusicList from 'components/music-list/musiclist'

  import { mapGetters } from 'vuex'
  import { getSingerSongs } from 'api/singer'
  import { ERR_OK } from "../../api/config"
  import { createSong } from 'common/js/singer'

  export default {
    computed: {
      ...mapGetters([
        'singer'
      ]),
      title() {
        return this.singer.singer_name
      },
      bgImg() {
        return this.singer.singer_pic
      }
    },
    created() {
      if (!this.singer.singer_id) {
        this.$router.back()
      }
      this._getSingerSongs()
    },
    data() {
      return {
        num: 0,
        song: []
      }
    },
    methods: {
      // 获取歌手的歌曲
      _getSingerSongs() {
        if (this.num < 0) return null
        // 设置页数，一页15条数据
        this.singer.num = this.num
        getSingerSongs(this.singer).then(res => {
          if (res.code === ERR_OK) {
            // 获取不到数据时，上拉不再发生请求
            if (res.data.list.length === 0) {
              this.num = -99
            }
            this.song = this.song.concat(this._normalized(res.data.list))
          }
        })
      },
      // 格式化数据
      _normalized(list) {
        let ret = []
        list.forEach(item => {
          let { musicData } = item
          ret.push(createSong(musicData))
        })
        return ret
      },
      // 下拉加载下一页数据
      scrollEnd() {
        this.num += 1
        this._getSingerSongs()
      }
    },
    components: {
      MusicList
    }
  }
</script>

<style lang="scss" scoped>
  .slide-enter-active,
  .slide-leave-active {
    transition: all .3s;
  }
  .slide-enter,
  .slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }
</style>