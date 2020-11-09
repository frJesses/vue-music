<template>
  <div class="search-list" ref="searchList">
    <ul>
      <li v-for="(item, index) in searches"
          :key="index"
          class="search-item"
          @click="selectItem(item)"
      >
        <span class="text">{{item}}</span>
        <span class="icon" @click.stop="deleteOne(item)">
          <i class="icon-delete"></i>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    props: {
      searches: {
        type: Array,
        default() {
          return []
        }
      }
    },
    methods: {
      // 点击删除icon
      deleteOne(item) {
        this.$emit('delete', item)
      },
      // 点击搜索项
      selectItem(item) {
        this.$emit('select', item)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "common/css/variable.scss";
  .search-list {
    .search-item {
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .text {
        flex: 1;
        color: $color-text-l;
      }
      .icon {
        .icon-delete {
          font-size: $font-size-small;
          color: $color-text-l;
        }
      }
    }
  }
</style>