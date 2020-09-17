<template>
 <div class="m-header">
   <div class="icon"></div>
   <div class="text">Chicken Music</div>
   <div class="mine">
     <i class="icon-mine"></i>
   </div>
 </div>
</template>

<script>
 export default {
   data () {
     return {

     }
   },
   components: {

   }
 }
</script>

<style lang="scss" scoped>
@import "common/css/variable.scss";
@import "common/css/mixin.scss";
.m-header {
  position: relative;
  height: 44px;
  text-align: center;
  color: $color-theme;
  .icon {
    width: 30px;
    height: 32px;
    display: inline-block;
    @include bg-image(logo);
    background-size: 30px 32px;
    vertical-align: top;
    margin-right: 9px;
    margin-top: 6px;
  }
  .text {
    display: inline-block;
    line-height: 44px;
    vertical-align: top;
    font-size: 18px;
  }
  .mine {
    position: absolute;
    right: 0;
    top: 0;
    .icon-mine {
      padding: 12px;
      display: block;
      font-size: 20px;
    }
  }
}
</style>
