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
        <div class="middle">
          <div class="middle-l">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCars">
                <img :src="currentSong.image" alt="">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">21345</div>
            </div>
          </div>
          <div class="middle-r">
            <div class="lyric-wrapper">
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="dots-wrapper">
            <span class="dot" :class="{'active': currentShow === 'cd'}"></span>
            <span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
          </div>
          <div class="process-wrapper">
            <span class="time">0.00</span>
            <div class="process-bar-wrapper">
              <process-bar></process-bar>
            </div>
            <span class="time">2.34</span>
          </div>
          <div class="operators">
            <div class="icon icon-right">
              <i class="icon-sequence"></i>
            </div>
            <div class="icon icon-right">
              <i class="icon-prev"></i>
            </div>
            <div class="icon icon-center">
              <i :class="playIcon" @click="togglePlaying"></i>
            </div>
            <div class="icon">
              <i class="icon-next"></i>
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
          <process-circle :radius="radius">
            <i class="icon-mini" @click.stop="togglePlaying" :class="miniPlay"></i>
          </process-circle>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <!-- audio播放器-->
    <audio ref="audio" :src="currentSong.url"></audio>
  </div>
</template>

<script>
  import ProcessBar from 'base/process-bar/process-bar'
  import ProcessCircle from 'base/process-circle/process-circle'
  import animations from 'create-keyframe-animation'

  import { mapGetters, mapMutations } from 'vuex'
  export default {
    data() {
      return {
        currentShow: 'cd',
        radius: 32
      }
    },
    computed: {
      ...mapGetters([
        'fullScreen',
        'playList',
        'currentSong',
        'playing'
      ]),
      miniPlay() {
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
      },
      playIcon() {
        return this.playing ? 'icon-pause' : 'icon-play'
      },
      cdCars() {
        return this.playing ? 'play' : 'play pause'
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
      // 动画的实现
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
      // 点击按钮进行播放与暂停
      togglePlaying() {
        this.setPlaying(!this.playing)
      },
      ...mapMutations({
        setFullScreen: 'SET_FULLSCREEN',
        setPlaying: 'SET_PLAYING'
      })
    },
    components: {
      ProcessBar,
      ProcessCircle
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