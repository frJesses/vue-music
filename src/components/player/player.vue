<template>
  <div class="player" v-show="playList.length > 0">
    <transition name="normal"
                 @enter="enter"
                 @after-enter="afterEnter"
                 @leave="leave"
                 @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image" alt="">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1>{{currentSong.name}}</h1>
          <h2>{{currentSong.singer}}</h2>
        </div>
        <div class="middle"
             @touchstart.prevent="middleTouchStart"
             @touchmove.prevent="middleTouchMove"
             @touchend.prevent="middleTouchEnd"
        >
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCars">
                <img :src="currentSong.image" alt="">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playLyric}}</div>
            </div>
          </div>
          <Scroll class="middle-r"
                  :data="currentLyric && currentLyric.lines"
                  ref="LyricWrapper"
          >
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p class="text"
                   v-for="(item, index) in currentLyric.lines"
                   :key="index"
                   :class="{'current': lyricLineNum === index}"
                   ref="lyricNum"
                >
                  {{item.txt}}
                </p>
              </div>
            </div>
          </Scroll>
        </div>
        <div class="bottom">
          <div class="dots-wrapper">
            <span class="dot" :class="{'active': currentShow === 'cd'}"></span>
            <span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
          </div>
          <div class="process-wrapper">
            <span class="time">{{format(currentTime)}}</span>
            <div class="process-bar-wrapper">
              <process-bar :percent="percent" @percentChange="percentChange"></process-bar>
            </div>
            <span class="time">{{format(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon icon-right">
              <i :class="modeIcon" @click="changeMode"></i>
            </div>
            <div class="icon icon-right" :class="disableCls">
              <i @click="prev" class="icon-prev" ></i>
            </div>
            <div class="icon icon-center" :class="disableCls">
              <i :class="playIcon" @click="togglePlaying"></i>
            </div>
            <div class="icon" :class="disableCls">
              <i @click="next" class="icon-next" ></i>
            </div>
            <div class="icon">
              <i class="icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon" >
          <img :class="cdCars" :src="currentSong.image" alt="">
        </div>
        <div class="text">
          <h2>{{currentSong.name}}</h2>
          <p>{{currentSong.singer}}</p>
        </div>
        <div class="control">
          <process-circle :radius="radius" :percent="percent">
            <i class="icon-mini" @click.stop="togglePlaying" :class="miniPlay"></i>
          </process-circle>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <!-- audio播放器-->
    <audio ref="audio"
           @canplay="ready"
           @timeupdate="timeupdate"
           @error="error"
           @ended="end"
    ></audio>
  </div>
</template>

<script>
  import ProcessBar from 'base/process-bar/process-bar'
  import ProcessCircle from 'base/process-circle/process-circle'
  import animations from 'create-keyframe-animation'
  import Lyric from 'lyric-parser'
  import Scroll from 'base/scroll/scroll'

  import { mapGetters, mapMutations } from 'vuex'
  import {currentSong} from "../../store/getters";
  import { getSongVkey } from 'api/singer'
  import { playMode } from 'common/js/config'
  import { shuffer } from 'common/js/utils'

  export default {
    data() {
      return {
        currentShow: 'cd',
        radius: 32,
        musicUrl: '',
        songReady: false,
        currentTime: 0,
        currentLyric: null,
        playLyric: '',
        lyricLineNum: 0
      }
    },
    created() {
      this.touch = {}
    },
    computed: {
      ...mapGetters([
        'fullScreen',
        'playList',
        'currentSong',
        'playing',
        'currentIndex',
        'mode',
        'sequenceList'
      ]),
      miniPlay() {
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
      },
      playIcon() {
        return this.playing ? 'icon-pause' : 'icon-play'
      },
      cdCars() {
        return this.playing ? 'play' : 'play pause'
      },
      disableCls() {
        return this.songReady ? '' : 'disable'
      },
      percent() {
        return this.currentTime / this.currentSong.duration
      },
      modeIcon() {
        return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
      }
    },
    methods: {
      // 点击返回按钮返回
      back() {
        this.setFullScreen(false)
      },
      // 点击迷你播放器，进入全屏播放器
      open() {
        this.setFullScreen(true)
      },
      // 格式化数据
      format(interval) {
        interval = interval | 0
        const minutes = interval / 60 | 0
        const second = interval % 60 < 10 ? '0' + interval % 60 : interval % 60
        return `${minutes}:${second}`
      },

      // ---------------   动画的实现   -----------------
      // 动画进来时 会执行 enter 和 afterEnter
      enter(el, done) {
        let { x, y, scale } = this._getPosition()
        let animation = {
          0: {
            transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
          },
          60: {
            transform: `translate3d(0, 0, 0}) scale(1.1)`
          },
          100: {
            transform: `translate3d(0, 0, 0) scale(1)`
          }
        }
        // 配置动画
        animations.registerAnimation({
          name: 'move',
          animation,
          presets: {
            duration: 400,
            easing: 'linear'
          }
        })
        // 执行动画
        animations.runAnimation(this.$refs.cdWrapper, 'move', done)
      },
      afterEnter() {
        animations.unregisterAnimation('move')
        this.$refs.cdWrapper.style.animation = ''
      },
      // 动画离开之后执行 leave 和 afterLeave
      leave(el, done) {
        this.$refs.cdWrapper.style.transition = 'all 0.4s'
        let { x, y, scale } = this._getPosition()
        this.$refs.cdWrapper.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        this.$refs.cdWrapper.addEventListener('transitionend', done)
      },
      afterLeave() {
        this.$refs.cdWrapper.style.transition = ''
        this.$refs.cdWrapper.style.transform = ''
      },
      // 获取大图片和小图片的位置
      _getPosition() {
        // 小图片的位置
        let tragetWidth = 40
        let paddingLeft = 20
        let paddingBottom = 30
        // 大图片
        let paddingTop = 80
        let bigImgWidth = window.innerWidth * 0.8
        let scale = tragetWidth / bigImgWidth
        const x = -(window.innerWidth / 2 - paddingLeft)
        const y = window.innerHeight / 2 - paddingTop - paddingBottom - (bigImgWidth / 2)
        return {
          scale,
          x,
          y
        }
      },

      // ---------------- 歌曲的前进与后退功能的实现  -------
      // 播放前一首歌曲
      prev() {
        let index = this.currentIndex - 1
        if (index < 0) {
          index = this.playList.length - 1
        }
        this.setCurrentIndex(index)
        // 防止切换太快
        this.songReady = false
      },
      // 播放下一首歌曲
      next() {
        let index = this.currentIndex + 1
        if (index === this.playList.length) {
          index = 0
        }
        this.setCurrentIndex(index)
        // 防止切换太快
        this.songReady = false
      },
      // 歌曲循环播放
      loop() {
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
      },
      // 点击按钮进行播放与暂停
      togglePlaying() {
        if (!this.songReady) {
          return
        }
        this.setPlaying(!this.playing)
        // 歌曲的暂停与播放
        if (this.currentLyric) {
          this.currentLyric.togglePlay()
        }
      },
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
      // 歌曲的进度条发生改变
      percentChange(percent) {
        let currentTime = this.currentSong.duration * percent
        this.$refs.audio.currentTime = currentTime
        if (!this.playing) {
          this.togglePlaying()
        }
        // 歌词随着进度条的改变而改变
        if (this.currentLyric) {
          this.currentLyric.seek(currentTime * 1000)
        }
      },
      // 获取歌词
      getLyric() {
        this.currentSong.getLyrics().then(res => {
          this.currentLyric = new Lyric(res, this.handler)
          if (this.playing) {
            this.currentLyric.play()
          }
        }).catch(err => {
          this.lyricLineNum = 0
          this.currentLyric = null
          this.currentTime = 0
        })
      },
      // 处理歌词函数
      handler({lineNum, txt}) {
        this.lyricLineNum = lineNum
        if (lineNum > 5) {
          let lyEle = this.$refs.lyricNum[lineNum - 5]
          this.$refs.LyricWrapper.scrollToElement(lyEle, 1000)
        } else {
          this.$refs.LyricWrapper.scrollTo(0, 0, 800)
        }
        this.playLyric = txt
      },

      // --------------- audio控制前进与后退太频繁导致错误 -------
      // 歌曲缓冲到可以播放的处理函数
      ready() {
        this.songReady = true
      },
      // 歌曲播放错误的处理函数
      error() {
        this.songReady = true
      },
      // 获取歌曲播放了多长的时间
      timeupdate(e) {
        this.currentTime = e.target.currentTime
      },
      // 歌曲播放完后的处理函数
      end() {
        if (this.mode === playMode.loop) {
          this.loop()
        }else {
          this.next()
        }
      },

      // ------------- 播放器与歌词左右切换 ----------
      middleTouchStart(e) {
        this.touch.inited = true
        const touch = e.touches[0]
        this.touch.startX = touch.pageX
        this.touch.startY = touch.pageY
      },
      middleTouchMove(e) {
        if (!this.touch.inited) {
          return
        }
        const touch = e.touches[0]
        let detalX = touch.pageX - this.touch.startX
        let detalY = touch.pageY - this.touch.pageY
        // 如果移动Y大于X则认为是X轴移动
        if (detalY > detalX) {
          return
        }
        // 获取left的值
        const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
        // 获取移动的范围
        let width = Math.min(0, Math.max(-window.innerWidth, detalX + left))
        // 记录移动的百分比
        this.touch.percent = Math.abs(width / window.innerWidth)
        this.$refs.LyricWrapper.$el.style.transform =  `translate3d(${width}px, 0, 0)`
        this.$refs.LyricWrapper.$el.style.transitionDuration =  0
        this.$refs.middleL.style.opacity = 1 - this.touch.percent
        this.$refs.middleL.style.transitionDuration = 0
      },
      middleTouchEnd() {
        let offsetWidth, opacity, time = 300
        if (this.currentShow === 'cd') {
          if (this.touch.percent > 0.1) {
            offsetWidth = -window.innerWidth
            opacity = 0
            this.currentShow = 'lyric'
          }else {
            opacity = 1
            offsetWidth = 0
          }
        }else {
          if (this.touch.percent < 0.9) {
            offsetWidth = 0
            opacity = 1
            this.currentShow = 'cd'
          }else {
            offsetWidth = -window.innerWidth
            opacity = 0
          }
        }
        this.$refs.LyricWrapper.$el.style.transform =  `translate3d(${offsetWidth}px, 0, 0)`
        this.$refs.LyricWrapper.$el.style.transitionDuration = `${time}ms`
        this.$refs.middleL.style.opacity = opacity
        this.$refs.middleL.style.transitionDuration = `${time}ms`
      },

      // -------------  vuex中的同步函数 -------------
      ...mapMutations({
        setFullScreen: 'SET_FULLSCREEN',
        setPlaying: 'SET_PLAYING',
        setCurrentIndex: 'SET_CURRENTINDEX',
        setMode: 'SET_MODE',
        setPlayList: 'SET_PLAYLIST'
      })
    },
    components: {
      ProcessBar,
      ProcessCircle,
      Scroll
    },
    watch: {
      currentSong(newSong, oldSong) {
        if (newSong.id === oldSong.id) {
          return
        }
        // 获取vkey
        getSongVkey(newSong.mid).then(vkey => {
          this.$refs.audio.src = 'http://ws.stream.qqmusic.qq.com/' + vkey
          this.$nextTick(() => {
            if (this.playing) {
              this.$refs.audio.play()
              // 获取歌词
              this.getLyric()
            }
          })
        })
      },
      playing(newPlaying) {
        this.$nextTick(() => {
          const audio = this.$refs.audio
          newPlaying ? audio.play() : audio.pause()
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "common/css/variable.scss";
  @import "common/css/mixin.scss";
.player {
  .normal-player {
    z-index: 99;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: $color-background;
    .background {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      opacity: .6;
      z-index: -1;
      filter: blur(20px); // 给图像设置高斯模糊
    }
    .top {
      position: relative;
      margin-bottom: 25px;
      .back {
        position: absolute;
        left: 6px;
        top: 0;
        z-index: 50;
        .icon-back {
          display: block;
          padding: 9px;
          transform: rotate(-90deg);
          font-size: 22px;
          color: $color-theme;
        }
      }
      h1 {
        height: 40px;
        line-height: 40px;
        width: 70%;
        margin: 0 auto;
        text-align: center;
        font-size: $font-size-large;
        @include no-wrap();
      }
      h2 {
        line-height: 20px;
        font-size: $font-size-medium;
        text-align: center;
      }
    }
    .middle {
      position: fixed;
      top: 80px;
      bottom: 170px;
      width: 100%;
      font-size: 0;
      white-space: nowrap;
      .middle-l,
      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
      }
      .middle-l {
        position: relative;
        height: 0;
        padding-top: 80%;
        .cd-wrapper {
          position: absolute;
          left: 10%;
          width: 80%;
          height: 100%;
          top: 0;
          .cd {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            border: 10px solid $color-text-d;
            border-radius: 50%;
            position: relative;
            &.play {
              animation: rotate 20s linear infinite;
            }
            &.pause {
              animation-play-state: paused;
            }
            img {
              width: 100%;
              height: 100%;
              position: absolute;
              left: 0;
              top: 0;
              border-radius: 50%;
            }
          }
        }
        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0;
          overflow: hidden;
          text-align: center;
          .playing-lyric {
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }
      .middle-r {
        height: 100%;
        overflow: hidden;
        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;
          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
            &.current {
              color: $color-text;
            }
          }
        }
      }
    }
    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
      .dots-wrapper {
        text-align: center;
        font-size: 0;
        .dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-d;
          margin: 0 4px;
          vertical-align: middle;
          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-l;
          }
        }
      }
      .process-wrapper {
        width: 80%;
        padding: 10px 0;
        display: flex;
        align-items: center;
        margin: 0 auto;
        .time {
          flex: 0 0 30px;
          font-size: $font-size-small;
          text-align: center;
          line-height: 30px;
          color: $color-text-ll;
        }
        .process-bar-wrapper {
          flex: 1;
        }
      }
      .operators {
        display: flex;
        align-items: center;
        .icon {
          flex: 1;
          color: $color-theme;
          &.disable {
            color: $color-theme-d;
          }
          i {
            font-size: 30px;
          }
          .icon-play,
          .icon-pause {
            font-size: 40px;
          }
        }
        .icon-left {
          text-align: left;
        }
        .icon-center {
          text-align: center;
          padding: 0 20px;
        }
        .icon-right {
          text-align: right;
        }
      }
    }
    &.normal-enter-active,
    &.normal-enter-leave {
      transition: all .7s;
      .top,
      .bottom {
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
      }
    }
    &.normal-enter,
    &.normal-leave-to {
      opacity: 0;
      .top {
        transform: translate3d(0, -100px, 0);
      }
      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }
  .mini-player {
    position: fixed;
    height: 60px;
    width: 100%;
    bottom: 0;
    z-index: 180;
    background: $color-highlight-background;
    display: flex;
    align-items: center;
    .icon {
      flex: 0 0 40px;
      width: 40px;
      padding: 0 10px 0 20px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        &.play {
          animation: rotate 20s linear infinite;
        }
        &.pause {
          animation-play-state: paused;
        }
      }
    }
    .text {
      flex: 1;
      justify-items: center;
      line-height: 20px;
      overflow: hidden;
      h2 {
        font-size: $font-size-medium;
        @include no-wrap();
        margin-bottom: 3px;
        color: $color-text-ll;
        overflow: hidden;
      }
      p {
        font-size: $font-size-small;
        @include no-wrap();
        overflow: hidden;
        color: $color-text-l;
      }
    }
    .control {
      flex: 0 0 30px;
      width: 30px;
      padding: 0 10px;
      .icon-play-mini, .icon-pause-mini, .icon-playlist {
        font-size: 30px;
        color: $color-theme-d;
      }
      .icon-mini {
        position: absolute;
        left: 0;
        top: 0;
        font-size: 32px;
      }
    }
    &.mini-enter-active,
    &.mini-leave-active {
      transition: all 0.4s;
    }
    &.mini-enter,
    &.mini-leave-to {
      opacity: 0;
    }
  }
  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>