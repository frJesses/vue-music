<template>
 <div class="tag">
   <router-link tag="div" class="tag-item" to="/recommend">
     <span>推荐</span>
   </router-link>
   <router-link tag="div" class="tag-item" to="/singer">
     <span>歌手</span>
   </router-link>
   <router-link tag="div" class="tag-item" to="/rank">
     <span>排行</span>
   </router-link>
   <router-link tag="div" class="tag-item" to="/search">
     <span>搜索</span>
   </router-link>
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
 .tag {
   height: 44px;
   line-height: 44px;
   display: flex;
   text-align: center;
   .tag-item {
     flex: 1;
     span {
       color: $color-text-l;
       padding-bottom: 5px;
       font-size: 16px;
     }
   }
   .router-link-active {
     span {
       color: $color-theme;
       border-bottom: 2px solid $color-theme;
     }
   }
 }
</style>
