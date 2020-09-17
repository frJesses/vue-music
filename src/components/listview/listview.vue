<template>
  <scroll :data="singer" class="listview" ref="listview">
    <!-- 显示标题和歌手信息-->
    <div class="list-group">
      <h2 v-html="targetTitle"></h2>
      <ul>
        <li v-for="(item, index) in getSingers" :key="index" class="list-item"></li>
      </ul>
    </div>
  </scroll>
</template>

<script>
  import Scroll from 'common/scroll/scroll'
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
        getSingers: []
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

</style>