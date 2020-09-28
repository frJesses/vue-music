<template>
  <div class="song-list">
    <ul>
      <li v-for="(song, index) in song"
          :key="index"
          class="song-item"
          @click="selectItem(song, index)"
      >
        <div class="rank" v-show="rank">
          <span :class="getRankClass(index)">{{getRankText(index)}}</span>
        </div>
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
      },
      rank: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      getDesc(song) {
        return `${song.singer}·${song.name}`
      },
      // 点击歌曲进行播放
      selectItem(song, index) {
        this.$emit('select', song, index)
      },
      // 获取类名
      getRankClass(index) {
        if (index <= 2) return `icon icon${index}`
        return 'text'
      },
      // 获取内容
      getRankText(index) {
        if (index > 2) return index + 1
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
      .rank {
        flex: 0 0 25px;
        width: 25px;
        margin-right: 30px;
        text-align: center;
        .icon {
          display: inline-block;
          width: 25px;
          height: 24px;
          background-size: 25px 24px;
          &.icon0 {
            @include bg-image('first');
          }
          &.icon1 {
            @include bg-image('second');
          }
          &.icon2 {
            @include bg-image('third');
          }
        }
        .text {
          color: $color-theme;
          font-size: $font-size-large;
        }
      }
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