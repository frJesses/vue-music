<template>
  <div class="song-list">
    <ul>
      <li v-for="(song, index) in song"
          :key="index"
          class="song-item"
          @click="selectItem(song, index)"
      >
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="desc">{{getDesc(song)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    props: {
      song: {
        type: Array,
        default() {
          return []
        }
      }
    },
    methods: {
      getDesc(song) {
        return `${song.singer}·${song.name}`
      },
      // 点击歌曲进行播放
      selectItem(song, index) {
        this.$emit('select', song, index)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "common/css/mixin.scss";
  @import "common/css/variable.scss";
  .song-list {
    .song-item {
      display: flex;
      align-items: center;
      box-sizing: border-box;
      height: 64px;
      font-size: 14px;
      .content {
        flex: 1;
        line-height: 20px;
        overflow: hidden;
        .name {
          @include no-wrap();
          color: $color-text;
        }
        .desc {
          @include no-wrap();
          color: $color-text-d;
          margin-top: 3px;
        }
      }
    }
  }
</style>