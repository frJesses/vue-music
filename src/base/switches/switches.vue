<template>
  <ul class="switches">
    <li v-for="(item, index) in switches"
        :key="item.id"
        class="item"
        :class="{'active': currentIndex === index}"
        @click="selectItem(index)"
    >
      <span>{{item.name}}</span>
    </li>
  </ul>
</template>

<script>
  export default {
    props: {
      switches: {
        type: Array,
        default() {
          return []
        }
      },
      currentIndex: {
        type: Number,
        default: 0
      }
    },
    methods: {
      selectItem(index) {
        this.$emit('select', index)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "common/css/variable.scss";
  .switches {
    display: flex;
    width: 240px;
    align-items: center;
    margin: 0 auto;
    border: 1px solid $color-highlight-background;
    border-radius: 5px;
    .item {
      flex: 1;
      text-align: center;
      padding: 8px;
      font-size: $font-size-medium;
      color: $color-text-d;
      &.active {
        background: $color-highlight-background;
        color: $color-text;
      }
    }
  }
</style>