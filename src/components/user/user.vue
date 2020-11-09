<template>
  <transition name="slide">
    <div class="user">
      <div class="back" @click.stop="back">
        <i class="icon-back"></i>
      </div>
      <div class="switch-wrapper">
        <switches :switches="switches"
                  :currentIndex="currentIndex"
                  @select="selectItem"
        ></switches>
      </div>
      <div class="play-btn" @click.stop="random">
        <i class="icon-play"></i>
        <span class="play-all">随机播放全部</span>
      </div>
      <div class="list-wrapper" ref="listWrapper">
        <Scroll :data="favoriteSong"
                class="list-scroll"
                v-if="currentIndex === 0"
                ref="favoriteList"
        >
          <div class="list-linner">
            <song-list :song="favoriteSong" @select="selectSong"></song-list>
          </div>
        </Scroll>
        <scroll :data="playHistory"
                class="list-scroll"
                v-if="currentIndex === 1"
                ref="playList"
        >
          <div class="list-linner">
            <song-list :song="playHistory" @select="selectSong"></song-list>
          </div>
        </scroll>
      </div>
    </div>
  </transition>
</template>

<script>
  import switches from "base/switches/switches";
  import Scroll from 'base/scroll/scroll'
  import SongList from 'base/song-list/song-list'

  import { mapGetters, mapActions } from 'vuex'
  import Song from 'common/js/singer'
  import { playMinix } from 'common/js/minix'

  export default {
    mixins: [playMinix],
    data() {
      return {
        switches: [
          {
            id: 0,
            name: '我喜欢的'
          },
          {
            id: 1,
            name: '最近听的'
          }
        ],
        currentIndex: 0
      }
    },
    computed: {
      ...mapGetters([
        'favoriteSong',
        'playHistory'
      ])
    },
    methods: {
      // 返回上一个界面
      back() {
        this.$router.back()
      },
      // 点击随机播放歌曲
      random() {
        let list = this.currentIndex == 0 ? this.favoriteSong : this.playHistory
        list = list.map(item => {
          return new Song(item)
        })
        this.randomPlay({list})
      },
      // 点击tab切换框
      selectItem(index) {
        this.currentIndex = index
      },
      // 点击 最近听的中的歌曲
      selectSong(song, index) {
        this.insertSong(new Song(song))
      },
      // 处理底部
      handlePlayList(playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.listWrapper.style.bottom = bottom
        this.$refs.favoriteList && this.$refs.favoriteList.refresh()
        this.$refs.playList && this.$refs.playList.refresh()
      },
      ...mapActions([
        'insertSong',
        'randomPlay'
      ])
    },
    components: {
      switches,
      Scroll,
      SongList
    }
  }
</script>

<style lang="scss" scoped>
  @import "common/css/variable.scss";
  .user {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    background: $color-background;
    z-index: 50;
    &.slide-enter-active,
    &.slide-leave-active {
      transition: all 0.3s;
    }
    &.slide-enter,
    &.slide-leave-to {
      transform: translate3d(100%, 0, 0);
    }
    .back {
      position: absolute;
      top: 0;
      left: 6px;
      z-index: 10;
      .icon-back {
        padding: 10px;
        display: block;
        font-size: $font-size-large-x;
        color: $color-theme;
      }
    }
    .switch-wrapper {
      margin: 10px 0 30px 0;
    }
    .play-btn {
      width: 135px;
      padding: 7px 0;
      border: 1px solid $color-text-l;
      margin: 0 auto;
      border-radius: 100px;
      text-align: center;
      font-size: 0;
      .icon-play,
      .play-all {
        font-size: $font-size-medium;
        color: $color-text-l;
      }
      .play-all {
        margin-left: 5px;
      }
    }
    .list-wrapper {
      position: absolute;
      width: 100%;
      top: 110px;
      bottom: 0;
      .list-scroll {
        height: 100%;
        overflow: hidden;
      }
      .list-linner {
        padding: 20px 30px;
      }
    }
  }
</style>