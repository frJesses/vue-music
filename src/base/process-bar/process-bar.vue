<template>
  <div class="process-bar">
    <div class="bar-inner">
      <div class="progess"></div>
      <div class="progess-btn-wrapper">
        <div class="progess-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {

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
      width: 100px;
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