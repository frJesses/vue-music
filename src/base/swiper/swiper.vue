<template>
 <div class="swiper" ref="swiper">
   <div class="swiper-slider" ref="swiperSlider">
     <slot></slot>
   </div>
   <div class="dots">
     <span v-for="(item, index) in dots" :key="index" class="dot" :class="{'active': currentIndex === index}"></span>
   </div>
 </div>
</template>

<script>
import { addClass } from 'common/js/dom'
import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'
BScroll.use(Slide)

 export default {
   props: {
     loop: {
       type: Boolean,
       default: true
     },
     autoPlay: {
       type: Boolean,
       default: true
     },
     interval: {
       type: Number,
       default: 3000
     }
   },
   data () {
     return {
       dots: [],
       currentIndex: 0
     }
   },
   mounted () {
    this.initWidth()
    this.initDots()
    this.initScroll()
    if (this.autoPlay) {
      this.play()
    }
   },
   methods: {
     // 1. 初始化容器的宽度
     initWidth() {
       this.childrens = this.$refs.swiperSlider.children
       let widths = 0
       let length = this.childrens.length
       // 获取容器的宽度
       let swiperWidth = this.$refs.swiper.clientWidth
       for(let i = 0; i < length; i++) {
         const child = this.childrens[i]
         addClass(child, 'swiper-item')
         child.style.width = swiperWidth + 'px'
         widths += swiperWidth
       }
       if (this.loop) {
         widths += 2 * swiperWidth;
       }
       this.$refs.swiperSlider.style.width = widths + 'px'
     },
     // 2. 初始化小点
     initDots() {
       this.dots = new Array(this.childrens.length)
     },
     // 3. 初始化滚动
    initScroll() {
      // let self = this
      // 3.1 定义better-scroll
      this.swiper = new BScroll(this.$refs.swiper, {
        scrollX: true,
        scrollY: false,
        slide: true,
        momentum: false,
        swipeTime: 400
      })
      // 3.2 小圆点跟随图片的滚动而变化
      this.swiper.on('slideWillChange', (page) => {
        this.currentIndex = page.pageX
      })
      this.swiper.on('scrollEnd', () => {
        if (this.autoPlay) {
          clearInterval(this.timmer)
          this.play()
        }
      })
    },
    // 4. 自动播放
    play() {
       let pageIndex = this.currentIndex + 1
       if (pageIndex === this.childrens.length - 2) {
         pageIndex = 0
       }
      // console.log(pageIndex)
       this.timmer = setInterval(() => {
         this.swiper.goToPage(pageIndex, 0, 400)
       }, this.interval)
     }
   }
 }
</script>

<style lang="scss" scoped>
@import "common/css/variable.scss";
.swiper {
  min-height: 1px;
  overflow: hidden;
  .swiper-slider {
    overflow: hidden;
    white-space: normal;
    .swiper-item {
      display: inline-block;
      width: 100%;
      text-align: center;
      overflow: hidden;
      box-sizing: border-box;
      a {
        display: block;
        text-decoration: none;
        width: 100%;
        overflow: hidden;
        img {
          width: 100%;
          display: block;
        }
      }
    }
  }
  .dots {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 10px;
    text-align: center;
    font-size: 0;
    .dot {
      width: 8px;
      height: 8px;
      display: inline-block;
      border-radius: 100px;
      background: $color-text-l;
      margin: 0 4px;
    }
    .active {
      width: 20px;
      background: $color-text-ll;
    }
  }
}
</style>
