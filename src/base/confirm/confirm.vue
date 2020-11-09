<template>
  <div class="confirm" v-show="showTag" @click.stop>
    <div class="confirm-wrapper">
      <div class="confirm-content">
        <div class="text">{{text}}</div>
        <div class="opeartor">
          <div class="opeartor-btn btn-left" @click="cancle">{{cancleBtnText}}</div>
          <div class="opeartor-btn" @click="confirm">{{confirmBtnText}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      text: {
        type: String,
        default: ''
      },
      cancleBtnText: {
        type: String,
        default: '取消'
      },
      confirmBtnText: {
        type: String,
        default: '确定'
      }
    },
    data() {
      return {
        showTag: false
      }
    },
    methods: {
      // 显示confirm
      show() {
        this.showTag = true
      },
      // 隐藏sconfirm
      hide() {
        this.showTag = false
      },
      // 点击取消
      cancle() {
        this.hide()
        this.$emit('cancle')
      },
      // 点击确定
      confirm() {
        this.hide()
        this.$emit('comfirm')
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "common/css/variable.scss";
  .confirm {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 998;
    .confirm-wrapper {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      .confirm-content {
        width: 270px;
        border-radius: 15px;
        background: $color-highlight-background;
        .text {
          padding: 19px 15px;
          line-height: 22px;
          text-align: center;
          font-size: $font-size-large;
          color: $color-text-l;
        }
        .opeartor {
          display: flex;
          align-items: center;
          text-align: center;
          font-size: $font-size-large;
          .opeartor-btn {
            flex: 1;
            line-height: 22px;
            padding: 10px 0;
            border-top: 1px solid $color-background-d;
            color: $color-text-d;
            &.btn-left {
              border-right: 1px solid $color-background-d;
            }
          }
        }
      }
    }
  }
</style>