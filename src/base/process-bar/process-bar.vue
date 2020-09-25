<template>
  <div class="process-bar" ref="processBar">
    <div class="bar-inner">
      <div class="progess" ref="progress"></div>
      <div class="progess-btn-wrapper" ref="progressBtn">
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
    watch: {
      percent(newPercent) {
        if (newPercent >= 0) {
          let barWidth = this.$refs.processBar.clientWidth - btnWidth
          let offetWidth = this.percent * barWidth
          this.$refs.progress.style.width = `${offetWidth}px`
          this.$refs.progressBtn.style.transform = `translate3d(${offetWidth}px, 0, 0)`
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