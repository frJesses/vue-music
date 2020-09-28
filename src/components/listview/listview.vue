<template>
  <scroll :data="singer"
          class="listview"
          ref="listview"
          :probe-type="3"
          :listen-scroll="true"
          @scroll="scroll"
  >
    <!-- 显示标题和歌手信息-->
    <div class="list-group">
      <h2 v-html="targetTitle"></h2>
      <ul>
        <li v-for="(item, index) in singer"
            :key="index"
            class="list-item"
            @click="selectSinger(item)"
        >
          <img v-lazy="item.singer_pic" alt="" @load="imgLoad">
          <span v-html="item.singer_name"></span>
        </li>
      </ul>
    </div>
    <!-- 显示标题 -->
    <div class="title-group" v-if="titleShow">
      <div class="title-fixed">{{targetTitle}}</div>
    </div>
    <!-- 显示右边的字母表-->
    <div class="list-shortcut"
         @touchstart.stop.prevent="cutTouchStart"
         @touchmove.stop.prevent="cutTouchMove"
         @touchend.stop.prevent="cutTouchEnd"
    >
      <ul>
        <li v-for="(item, index) in letters"
            :key="index" class="list-item"
            :data-index="index"
            :class="{'active': currentIndex === index}"
        >
          {{item}}
        </li>
      </ul>
    </div>
    <!-- 显示拖动时显示的小标签-->
    <div class="list-show" v-if="showTag">
      <div class="show-title">
        {{targetTitle}}
      </div>
      <div class="triangle"></div>
    </div>
    <!-- 加载组件-->
    <div class="loading-wrapper" v-if="!singer.length">
      <loading></loading>
    </div>
  </scroll>
</template>

<script>
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'

  import { getData } from "common/js/dom"
  import { ERR_OK } from "api/config"
  import { getSingerList } from 'api/singer'
  import _ from 'loadsh'

  export default {
    props: {
      list: {
        type: Array,
        default() {
          return []
        }
      }
    },
    data() {
      return {
        letters: [
          '热',
          'A',
          'B',
          'C',
          'D',
          'E',
          'F',
          'G',
          'H',
          'I',
          'J',
          'K',
          'L',
          'M',
          'N',
          'O',
          'P',
          'Q',
          'R',
          'S',
          'T',
          'U',
          'V',
          'W',
          'X',
          'Y',
          'Z',
          '#'
        ],
        currentIndex: 0,
        getSingers: [],
        showTag: false,
        titleShow: false
      }
    },
    created() {
      this.touch = {}
    },
    computed: {
      // 获取歌手
      singer() {
        if (this.getSingers.length > 0) {
          return this.getSingers
        }
        return this.list
      },
      // 获取标题
      targetTitle() {
        let title = ''
        if (this.currentIndex === 0) {
          title = '热门'
        }else {
          title = this.letters[this.currentIndex]
        }
        return title
      }
    },
    methods: {
      // 触摸右边字母表开始
      cutTouchStart(e) {
        // 获取索引值
        const clickIndex = getData(e.target, 'index') | 0
        // 设置currentIndex的值
        this.currentIndex = clickIndex
        // 记录第一次点击时的位置
        this.touch.y1 = e.touches[0].pageY
        // 记录第一次点击时的索引值
        this.touch.index = clickIndex
      },
      // 移动触摸右边字母表
      cutTouchMove(e) {
        // 记录移动后的位置
        this.touch.y2 = e.touches[0].pageY
        // 计算差值
        let detal = (this.touch.y2 - this.touch.y1) / 18 | 0
        // 改变currentIndex的值
        this.currentIndex = this.touch.index + detal
        if (this.currentIndex < 0) {
          this.currentIndex = 0
        }else if (this.currentIndex > this.letters.length - 1) {
          this.currentIndex = this.letters.length - 1
        }
        // 显示展示字母的组件
        this.showTag = true
      },
      // 结束触摸右边字母表
      cutTouchEnd() {
        // 选择内地
        let area = 200
        let clickIndex = this.currentIndex
        if (clickIndex === 0) {
          area = -100
          clickIndex = -100
        }
        // 滑动结束后发送网络请求数据
        getSingerList(clickIndex, area).then(res => {
          if (res.code === ERR_OK) {
            this.getSingers = res.singerList.data.singerlist
          }
          setTimeout(() => {
            this.refresh()
          }, 20)
        })
        // 显示字母表的组件隐藏
        this.showTag = false
      },
      // 刷新函数
      refresh() {
        this.$refs.listview && this.$refs.listview.refresh()
      },
      // 监听页面滚动
      scroll(pos) {
        pos.y > 0 ? this.titleShow = false : this.titleShow = true
      },
      // 图片加载后刷新
      imgLoad: _.debounce(function () {
        this.refresh()
      }),
      // 点击歌手后跳转到歌手播放器页面
      selectSinger(singer) {
        this.$emit('select', singer)
      }
    },
    components: {
      Scroll,
      Loading
    }
  }
</script>

<style lang="scss" scoped>
  @import "common/css/variable.scss";
.listview {
  width: 100%;
  height: 100%;
  overflow: hidden;
  transform: translateZ(0px);
  .list-group {
    padding-bottom: 30px;
    h2 {
      height: 30px;
      line-height: 30px;
      font-size: $font-size-medium;
      padding-left: 20px;
      box-sizing: border-box;
      background: $color-highlight-background;
      color: $color-text-l;
    }
    .list-item {
      padding: 20px 0 0 30px;
      display: flex;
      align-items: center;
      img {
        width: 50px;
        height: 50px;
        display: block;
        vertical-align: center;
        border-radius: 100px;
      }
      span {
        margin-left: 20px;
        color: $color-text-l;
        font-size: $font-size-medium;
      }
    }
  }
  .title-group {
    position: absolute;
    left: 0;
    top: -1px;
    width: 100%;
    .title-fixed {
      height: 30px;
      line-height: 30px;
      color: $color-text-l;
      background: $color-highlight-background;
      font-size: $font-size-medium;
      padding-left: 20px;
    }
  }
  .list-shortcut {
    position: fixed;
    right: 0;
    top: 50%;
    transform: translateY(-45%);
    background: $color-background-d;
    text-align: center;
    width: 20px;
    padding: 10px 0;
    border-radius: 10px;
    .list-item {
      padding: 3px;
      font-size: $font-size-small;
      color: $color-text-l;
      &.active {
        color: $color-theme;
      }
    }
  }
  .list-show {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
    z-index: 5;
    .show-title {
      width: 60px;
      height: 60px;
      line-height: 60px;
      text-align: center;
      border-radius: 50%;
      color: $color-theme;
      background: #383737;
    }
    .triangle {
      width: 0;
      height: 0;
      border-top: 25px solid transparent;
      border-bottom: 25px solid transparent;
      border-left: 50px solid #383737;
      margin-left: -15px;
      margin-top: 5px;
    }
  }
  .loading-wrapper {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>