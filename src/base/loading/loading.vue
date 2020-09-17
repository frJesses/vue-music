<template>
  <div class="loading">
    <img src="./loading.gif" alt="加载图片" width="24px" height="24px">
    <p>{{text}}</p>
  </div>
</template>

<script>
  export default {
    props: {
      text: {
        type: String,
        default: '正在加载中...'
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~common/css/variable.scss";
.loading {
  width: 100%;
  text-align: center;
  p {
    color: $color-text-l;
    font-size: $font-size-medium;
    line-height: 20px;
  }
}
</style>