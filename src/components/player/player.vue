<template>
  <div class="player" v-show="playList.length > 0">
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
          <div class="cd-wrapper">
            <div class="cd">
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
            <i class="icon-play"></i>
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
    <div class="mini-player" v-show="!fullScreen" @click="open">
      <div class="icon">
        <img :src="currentSong.image" alt="">
      </div>
      <div class="text">
        <h2>{{currentSong.name}}</h2>
        <p>{{currentSong.singer}}</p>
      </div>
      <div class="control">
        <process-circle :radius="radius">
          <i class="icon-mini" :class="miniPlay"></i>
        </process-circle>
      </div>
      <div class="control">
        <i class="icon-playlist"></i>
      </div>
    </div>
  </div>
</template>

<script>
  import ProcessBar from 'base/process-bar/process-bar'
  import ProcessCircle from 'base/process-circle/process-circle'

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
      ...mapMutations({
        setFullScreen: 'SET_FULLSCREEN'
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
            &.paused {
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
          .icon-play {
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
        &.paused {
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
  }
}
</style>