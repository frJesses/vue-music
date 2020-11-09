<template>
  <div class="no-result">
    <div class="no-result-icon"></div>
    <p class="no-result-text">{{text}}</p>
  </div>
</template>

<script>
  export default {
    props: {
      text: {
        type: String,
        default: ''
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "common/css/variable.scss";
  @import "common/css/mixin.scss";

  .no-result {
    text-align: center;
    .no-result-icon {
      width: 86px;
      height: 90px;
      @include bg-image('no-result')
      background-size: 86px 90px;
      margin: 0 auto;
    }
    .no-result-text {
      color: $color-text-d;
      font-size: $font-size-medium;
    }
  }
</style>