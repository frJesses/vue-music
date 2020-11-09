<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input type="text" placeholder="搜索歌曲、歌手" v-model="query">
    <i class="icon-dismiss" v-show="query" @click="clear"></i>
  </div>
</template>

<script>
  import _ from 'loadsh'
  export default {
    data() {
      return {
        query: ''
      }
    },
    created() {
      this.$watch('query', _.debounce(function (newQuery) {
        this.$emit('query', newQuery)
      }, 300))
    },
    methods: {
      // 清除输入框中的内容
      clear() {
        this.query = ''
      },
      // 设置输入框的内容
      setQuery(query) {
        this.query = query
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "common/css/variable.scss";
  .search-box {
    width: 100%;
    height: 40px;
    box-sizing: border-box;
    padding: 0 6px;
    background: $color-highlight-background;
    border-radius: 6px;
    display: flex;
    align-items: center;
    .icon-search {
      font-size: 24px;
      color: $color-theme-d;
    }
    input {
      flex: 1;
      margin: 0 6px;
      line-height: 18px;
      border-radius: 3px;
      border: none;
      background: $color-highlight-background;
      color: $color-theme-d;
      font-size: 14px;
      padding: 1px 3px;
      &::placeholder {
        color: $color-theme-d;
      }
    }
    .icon-dismiss {
      font-size: 16px;
      color: $color-text-d;
    }
  }
</style>