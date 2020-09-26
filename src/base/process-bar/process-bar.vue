<template>
  <div class="process-bar" ref="processBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progess" ref="progress"></div>
      <div class="progess-btn-wrapper"
           ref="progressBtn"
           @touchstart.prevent="progressTouchStart"
           @touchmove.prevent="progressTouchMove"
           @touchend.prevent="progressTouchEnd"
      >
        <div class="progess-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
  const btnWidth = 16
  export default {
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    created() {
      this.touch = {}
    },
    methods: {
      //  -------------  触摸事件 ------------------
      // 触摸开始
      progressTouchStart(e) {
        this.touch.inited = true
        this.touch.startX = e.touches[0].pageX
        this.touch.left = this.$refs.progress.clientWidth
      },
      // 触摸移动
      progressTouchMove(e) {
        if (!this.touch.inited) {
          return
        }
        // 计算两次插值
        let detal = e.touches[0].pageX - this.touch.startX
        // 计算可以滑动的距离
        let offsetWidth = Math.min(this.$refs.processBar.clientWidth - btnWidth, Math.max(0,
          detal + this.touch.left))
        console.log(offsetWidth)
        this._offsetWidth(offsetWidth)
      },
      // 触摸结束
      progressTouchEnd() {
        this.touch.inited = false
        this.triggerPercent()
      },
      // 进度条改变
      triggerPercent() {
        let barWidth = this.$refs.processBar.clientWidth - btnWidth
        let percent = this.$refs.progress.clientWidth / barWidth
        this.$emit('percentChange', percent)
      },
      //  点击进度条发生改变
      progressClick(e) {
        let reat = this.$refs.progress.getBoundingClientRect().left | 0
        let offsetWidth = e.pageX - reat - btnWidth / 2
        this._offsetWidth(offsetWidth)
        this.triggerPercent()
      },
      // 封装
      _offsetWidth(offsetWidth) {
        this.$refs.progress.style.width = `${offsetWidth}px`
        this.$refs.progressBtn.style.transform = `translate3d(${offsetWidth}px, 0, 0)`
      }
    },
    watch: {
      percent(newPercent) {
        if (newPercent >= 0 && !this.touch.inited) {
          let barWidth = this.$refs.processBar.clientWidth - btnWidth
          let offsetWidth = this.percent * barWidth
          this._offsetWidth(offsetWidth)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "common/css/variable.scss";
.process-bar {
  height: 30px;
  .bar-inner {
    position: relative;
    height: 4px;
    background: $color-text-d;
    top: 14px;
    .progess {
      position: absolute;
      height: 100%;
      background: $color-theme;
    }
    .progess-btn-wrapper {
      position: absolute;
      width: 30px;
      height: 30px;
      top: -13px;
      left: -9px;
      .progess-btn {
        position: relative;
        width: 16px;
        height: 16px;
        box-sizing: border-box;
        border: 3px solid $color-text;
        border-radius: 50%;
        left: 7px;
        top: 7px;
        background: $color-theme;
      }
    }
  }
}
</style>