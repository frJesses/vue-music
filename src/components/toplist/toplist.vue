<template>
  <transition name="slide">
    <music-list :title="title"
                :bgImg="bgImg"
                :song="song"
                :rank="true"
    ></music-list>
  </transition>
</template>

<script>
  import MusicList from 'components/music-list/musiclist'

  import { mapGetters } from 'vuex'
  import { getMusicList } from 'api/rank'
  import { ERR_OK } from "api/config"
  import { createSong } from "common/js/singer";

  export default {
    data() {
      return {
        song: []
      }
    },
    created() {
      this._getMusicList()
    },
    computed: {
      title() {
        return this.toplist.title
      },
      bgImg() {
        if (this.song.length) {
          return this.song[0].image
        }
        return ''
      },
      ...mapGetters([
        'toplist'
      ])
    },
    methods: {
      // 获取排行歌曲
      _getMusicList() {
        if (!this.toplist.topId) {
          this.$router.push({
            path: '/rank'
          })
        }
        getMusicList(this.toplist.topId).then(res => {
          if (res.code === ERR_OK) {
            this.song = this._normalize(res.songlist)
          }
        })
      },
      // 处理数据
      _normalize(list) {
        let ret = []
        list.forEach(item => {
          if (item.data.albummid && item.data.songid) {
            ret.push(createSong(item.data))
          }
        })
        return ret
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
    transition: all 0.3s;
  }
  .slide-enter,
  .slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }
</style>