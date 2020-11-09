<template>
  <transition name="tip">
    <div class="top-tip" v-show="showTag" @click.stop="hide">
      <slot></slot>
    </div>
  </transition>
</template>

<script>
  export default {
    props: {
      delay: {
        type: Number,
        default: 2000
      }
    },
    data() {
      return {
        showTag: false
      }
    },
    methods: {
      // 显示
      show() {
        this.showTag = true
        clearTimeout(this.timmer)
        this.timmer = setTimeout(() => {
          this.hide()
        }, this.delay)
      },
      // 隐藏
      hide() {
        this.showTag = false
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "common/css/variable.scss";

  .top-tip {
    position: fixed;
    top: 0;
    z-index: 500;
    width: 100%;
    background: $color-dialog-background;
    &.tip-enter-active,
    &.tip-leave-active {
      transition: all .3s;
    }
    &.tip-enter,
    &.tip-leave-to {
      transform: translate3d(0, -100%, 0);
    }
  }
</style>