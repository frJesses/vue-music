<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h2 class="singer-name">{{title}}</h2>
    <div class="bg-img" :style="bgImage" ref="bgImg">
      <div class="play-wrapper" ref="playWrapper">
        <div class="play">
          <i class="icon-play"></i>
          <span @click="random">随机播放全部</span>
        </div>
      </div>
      <div class="filter"></div>
    </div>
    <!--背景遮挡层-->
    <div class="bg-layer" ref="bgLayer"></div>
    <!-- 歌曲列表-->
    <Scroll :data="song"
            class="scroll-list"
            ref="scrollList"
            :probeType="3"
            :listenScroll="true"
            @scroll="scroll"
            :pullup="true"
            @pullUp="pullUp"
    >
      <div class="song-list-wrapper">
        <song-list :song="song" :rank="rank" @select="selectItem" />
      </div>
    </Scroll>
    <div class="loading-wrapper" v-show="!song.length">
      <loading></loading>
    </div>
  </div>
</template>

<script>
  import Scroll from 'base/scroll/scroll';
  import SongList from 'base/song-list/song-list'
  import Loading from 'base/loading/loading'

  import { mapActions } from 'vuex'
  import { playMinix } from 'common/js/minix'

  const RESEVER_HEIGHT = 40
  export default {
    mixins: [playMinix],
    props: {
      title: {
        type: String,
        default: ''
      },
      bgImg: {
        type: String,
        default: ''
      },
      song: {
        type: Array,
        default() {
          return []
        }
      },
      rank: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      bgImage() {
        return `background-image: url(${this.bgImg})`
      }
    },
    mounted() {
      this.imgHeight = this.$refs.bgImg.clientHeight
      this.minTransformY = -this.imgHeight + RESEVER_HEIGHT
      this.$refs.scrollList.$el.style.top = `${this.imgHeight}px`
    },
    data() {
      return {
        saveY: 0
      }
    },
    methods: {
      // 处理迷你播放器展示后遮挡内容
      handlePlayList(playlist) {
        const bottom = playlist.length > 0 ? '60px' : 0
        this.$refs.scrollList.$el.style.bottom = bottom
        this.$refs.scrollList.refresh()
      },
      // 点击返回图标返回上一个路由
      back() {
        this.$router.back()
      },
      // 监听歌曲列表的滚动
      scroll(pos) {
        this.saveY = pos.y
      },
      // 监听下拉加载更多
      pullUp() {
        this.$emit('scrollEnd')
      },
      // 处理点击歌曲后的事件
      selectItem(song, index) {
        this.setPlay({
          list: this.song,
          index
        })
      },
      // 点击随机播放全部的处理函数
      random() {
        this.randomPlay({
          list: this.song
        })
      },
      ...mapActions([
        'setPlay',
        'randomPlay'
      ])
    },
    components: {
      Scroll,
      SongList,
      Loading
    },
    watch: {
      saveY(newY) {
        let zIndex = 0
        let scale = 1
        let transformY = Math.max(this.minTransformY, newY)
        this.$refs.bgLayer.style.transform = `translate3d(0, ${transformY}px, 0)`
        let percent = Math.abs(newY / this.minTransformY)
        if (newY > 0) {
          scale += percent
          zIndex = 10
        }
        if (newY < transformY) {
          zIndex = 10
          this.$refs.bgImg.style.paddingTop = 0
          this.$refs.bgImg.style.height = `${RESEVER_HEIGHT}px`
          this.$refs.playWrapper.style.display = 'none'
        }else {
          this.$refs.bgImg.style.paddingTop = '70%'
          this.$refs.bgImg.style.height = 0
          this.$refs.playWrapper.style.display = 'block'
        }
        this.$refs.bgImg.style.zIndex = zIndex
        this.$refs.bgImg.style.transform = `scale(${scale}) translateZ(0px)`
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "common/css/variable.scss";
  @import "common/css/mixin.scss";

  .music-list {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    top: 0;
    z-index: 20;
    background: $color-background;
    width: 100%;
    .back {
      position: absolute;
      top: 0;
      left: 6px;
      z-index: 30;
      .icon-back {
        display: block;
        font-size: $font-size-large-x;
        color: $color-theme;
        padding: 10px;
      }
    }
    .singer-name {
      position: absolute;
      left: 10%;
      top: 0;
      width: 80%;
      z-index: 30;
      text-align: center;
      @include no-wrap();
      height: 40px;
      line-height: 40px;
      font-size: $font-size-large;
      color: $color-text;
    }
    .bg-img {
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 70%;
      transform-origin: top;
      background-size: cover;
      .play-wrapper {
        position: absolute;
        bottom: 20px;
        z-index: 50;
        width: 100%;
        .play {
          width: 175px;
          box-sizing: border-box;
          text-align: center;
          margin: 0 auto;
          padding: 7px 0;
          border: 1px solid $color-theme;
          border-radius: 100px;
          color: $color-theme;
          font-size: 0;
          .icon-play {
            font-size: 18px;
            margin-right: 6px;
            display: inline-block;
            vertical-align: middle;
          }
          span {
            font-size: 12px;
            vertical-align: middle;
          }
        }
      }
      .filter {
        position: absolute;
        width: 100%;
        height: 100%;
        background: rgba(7,17,27,0.4);
        left: 0;
        top: 0;
      }
    }
    .bg-layer {
      position: relative;
      height: 100%;
      background: $color-background;
    }
    .scroll-list {
      position: fixed;
      top: 0;
      bottom: 0;
      width: 100%;
      background: $color-background;
      transform: translateZ(0);
      .song-list-wrapper {
        padding: 20px 30px;
      }
    }
    .loading-wrapper {
      position: absolute;
      left: 50%;
      top: 55%;
      transform: translate(-50%, -50%);
    }
  }
</style>