<template>
  <scroll :data="singer" class="listview" ref="listview">
    <!-- 显示标题和歌手信息-->
    <div class="list-group">
      <h2 v-html="targetTitle"></h2>
      <ul>
        <li v-for="(item, index) in singer" :key="index" class="list-item">
          <img :src="item.singer_pic" alt="">
          <span v-html="item.singer_name"></span>
        </li>
      </ul>
    </div>
    <!-- 显示右边的字母表-->
    <div class="list-shortcut">
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
  </scroll>
</template>

<script>
  import Scroll from 'base/scroll/scroll'
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
        showTag: false
      }
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
    components: {
      Scroll
    }
  }
</script>

<style lang="scss" scoped>
  @import "common/css/variable.scss";
.listview {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .list-group {
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
    }
    .active {
      color: $color-theme;
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
}
</style>