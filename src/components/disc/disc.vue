<template>
  <transition name="slide">
    <MusicList :title="title" :bgImg="bgImg" :song="songs"></MusicList>
  </transition>
</template>

<script>
  import MusicList from 'components/music-list/musiclist'
  import { mapGetters } from 'vuex'
  import { getDiscSong } from 'api/recommend'
  import { ERR_OK } from "../../api/config"
  import { createSong } from 'common/js/singer'

  export default {
    data() {
      return {
        songs: []
      }
    },
    computed: {
      title() {
        return this.disc.dissname
      },
      bgImg() {
        return this.disc.imgurl
      },
      ...mapGetters([
        'disc'
      ])
    },
    created() {
      this._getDiscSong()
    },
    methods: {
      // 获取歌单详情数据
      _getDiscSong() {
        if (!this.disc.dissid) {
          this.$router.push({
            path: '/recommend'
          })
        }
        getDiscSong(this.disc.dissid).then(res => {
          if (res.code === ERR_OK) {
            this.songs = this._normalize(res.cdlist[0].songlist)
          }
        })
      },
      // 格式化数据
      _normalize(list) {
        let ret = []
        list.forEach(item => {
          let musicObj = {}
          musicObj.songid = item.id
          musicObj.songmid = item.mid
          musicObj.singer = item.singer
          musicObj.songname = item.name
          musicObj.albumname = item.album.name
          musicObj.interval = item.interval
          musicObj.albummid = item.album.mid
          ret.push(createSong(musicObj))
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
    transition: all .3s;
  }
  .slide-enter,
  .slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }
</style>