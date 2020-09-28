<template>
 <div class="recommend" ref="recommend">
   <BScroll class="scroll-wrapper" :data="recommendList" ref="scrollWrapper">
     <div>
       <!-- 存放轮播图容器 -->
       <div class="swiper-wrap">
         <swiper>
           <div v-for="(item, index) in imgs" :key="index">
             <a :href="item.link">
               <img :src="item.url" alt="图片">
             </a>
           </div>
         </swiper>
       </div>
       <!--   歌单列表展示-->
       <div class="recommend-list">
         <h1 class="list-title">热门歌单推荐</h1>
         <ul>
           <li class="item"
               v-for="(item, index) in recommendList"
               :key="index"
               @click="clickItem(item)"
           >
             <div class="l-image">
               <img v-lazy="item.imgurl" @load="imgLoad" alt="">
             </div>
             <div class="r-describe">
               <h2 v-html="item.creator.name"></h2>
               <p v-html="item.dissname"></p>
             </div>
           </li>
         </ul>
       </div>
     </div>
   </BScroll>
   <!-- 加载组件 -->
   <div class="loading-wrapper" v-if="!recommendList.length">
     <loading></loading>
   </div>
   <router-view></router-view>
 </div>
</template>

<script>
import Swiper from 'base/swiper/swiper'
import BScroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'

import { getSongList } from 'api/recommend'
import { ERR_OK } from 'api/config'
import { mapMutations } from 'vuex'
import _ from 'loadsh'
import { playMinix } from 'common/js/minix'

 export default {
   mixins: [playMinix],
   data () {
     return {
       imgs: [
         {
           url: require('common/image/banner/1.jpg'),
           link: 'javascript:;'
         },
         {
           url: require('common/image/banner/2.jpg'),
           link: 'javascript:;'
         },
         {
           url: require('common/image/banner/3.jpg'),
           link: 'javascript:;'
         },
         {
           url: require('common/image/banner/4.jpg'),
           link: 'javascript:;'
         },
         {
           url: require('common/image/banner/5.jpg'),
           link: 'javascript:;'
         },
         {
           url: require('common/image/banner/6.jpg'),
           link: 'javascript:;'
         }
       ],
       recommendList: []
     }
   },
   created() {
     this._getSongList()
   },
   methods: {
     // 获取歌单数据
     _getSongList() {
       getSongList().then(res => {
         if (res.code === ERR_OK) {
           this.recommendList = res.data.list
         }
       })
     },
     // 解决图片加载不了的问题
     imgLoad: _.debounce(function () {
       this.$refs.scrollWrapper && this.$refs.scrollWrapper.refresh()
     }, 20),
     //  点击歌单进入下一级路由
     clickItem(item) {
       this.$router.push({
         path: `/recommend/${item.dissid}`
       })
       this.setDisc(item)
     },
     // 处理迷你播放器展示后遮挡内容
     handlePlayList(playlist) {
       const bottom = playlist.length > 0 ? '60px' : 0
       this.$refs.recommend.style.bottom = bottom
       this.$refs.scrollWrapper.refresh()
     },
     ...mapMutations({
       setDisc: 'SET_DISC'
     })
   },
   components: {
     Swiper,
     BScroll,
     Loading
   }
 }
</script>

<style lang="scss" scoped>
@import "~common/css/variable.scss";

.recommend {
  position: fixed;
  top: 88px;
  width: 100%;
  bottom: 0;
  .scroll-wrapper {
    height: 100%;
    overflow: hidden;
    transform: translateZ(0px);
    .swiper-wrap {
      position: relative;
      width: 100%;
      transform: translateZ(0px);
      overflow: hidden;
    }
    .recommend-list {
      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        color: $color-theme;
        font-size: $font-size-medium;
      }
      .item {
        display: flex;
        padding: 0 20px 20px 20px;
        box-sizing: border-box;
        align-items: center;
        .l-image {
          width: 60px;
          padding-right: 20px;
          img {
            width: 100%;
            display: block;
          }
        }
        .r-describe {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          h2 {
            margin-bottom: 10px;
            color: $color-text;
            font-size: $font-size-medium-x;
          }
          p {
            color: $color-text-d;
            font-size: $font-size-medium;
          }
        }
      }
    }
  }
  .loading-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

</style>
