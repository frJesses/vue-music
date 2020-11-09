<template>
  <transition name="slide">
    <div class="add-song" v-show="showTag" @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" @click="closeBtn">
          <i class="icon-close"></i>
        </div>
      </div>
      <div class="search-box-wrapper">
        <search-box ref="searchBox" placeholder="搜索歌曲" @query="search"></search-box>
      </div>
      <div class="shortcut" v-show="!query">
        <switches :switches="switches"
                  :currentIndex="currentIndex"
                  @select="switchChange">
        </switches>
        <div class="list-wrapper" :data="playHistory">
          <Scroll class="list-scroll-wrapper" ref="songList" v-if="currentIndex === 0">
            <div class="list-linner">
              <song-list :song="playHistory" @select="selectSong"></song-list>
            </div>
          </Scroll>
          <Scroll class="list-scroll-wrapper" ref="searchList" v-if="currentIndex === 1">
            <div class="list-linner">
              <search-list :searches="searchHistory"
                            @delete="deleteSearchHistory"
                           @select="selectQuery"
              ></search-list>
            </div>
          </Scroll>
        </div>
      </div>
      <div class="search-result" v-show="query">
        <suggest :query="query" :showSinger="false" ref="suggest"></suggest>
      </div>
      <top-tip ref="topTip">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">1首歌曲已经添加到播放列表</span>
        </div>
      </top-tip>
    </div>
  </transition>
</template>

<script>
  import SearchBox from 'base/search-box/search-box'
  import Suggest from 'components/suggest/suggest'
  import Switches from 'base/switches/switches'
  import Scroll from 'base/scroll/scroll'
  import SongList from 'base/song-list/song-list'
  import SearchList from 'base/search-list/search-list'
  import TopTip from 'base/top-tip/top-tip'

  import { mapGetters, mapActions } from 'vuex'
  import Song from 'common/js/singer'
  import { searchMinix } from 'common/js/minix'

  export default {
    mixins: [searchMinix],
    data() {
      return {
        showTag: false,
        query: '',
        switches: [
          {
            id: 0,
            name: '最近播放'
          },
          {
            id: 1,
            name: '搜索历史'
          }
        ],
        currentIndex: 0
      }
    },
    computed: {
      ...mapGetters([
        'playHistory',
        'searchHistory'
      ])
    },
    methods: {
      // 显示组件
      show() {
        this.showTag = true
        this.refreshFn()
      },
      // 隐藏组件
      hide() {
        this.showTag = false
      },
      // 关闭组件
      closeBtn() {
        this.hide()
      },
      // search-box中的函数处理
      search(query) {
        this.query = query
      },
      // 点击选择框进行转换
      switchChange(index) {
        this.currentIndex = index
        this.refreshFn()
      },
      // 点击最近播放中的歌曲进行播放
      selectSong(song, index) {
        if (index !== 0) {
          this.insertSong(new Song(song))
          this.$refs.topTip.show()
        }
      },
      // 刷新函数
      refreshFn() {
        setTimeout(() => {
          if (this.currentIndex === 0) {
            this.$refs.songList.refresh()
          }else {
            this.$refs.searchList.refresh()
          }
          this.$refs.suggest.refresh()
        }, 20)
      },
      ...mapActions([
        'insertSong'
      ])
    },
    components: {
      SearchBox,
      Suggest,
      Switches,
      Scroll,
      SongList,
      SearchList,
      TopTip
    }
  }
</script>

<style lang="scss" scoped>
  @import "common/css/variable.scss";
  @import "common/css/mixin.scss";
  .add-song {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    z-index: 200;
    background: $color-background;
    &.slide-enter-avtive,
    &.slide-leave-active {
      transition: all 0.3s;
    }
    &.slide-enter,
    &.slide-leave-to {
      transform: translate3d(100%, 0, 0);
    }
    .header {
      position: relative;
      height: 44px;
      text-align: center;
      line-height: 44px;
      .title {
        color: $color-theme;
        font-size: $font-size-large;
      }
      .close {
        position: absolute;
        right: 10px;
        top: 0;
        .icon-close {
          font-size: $font-size-large-c;
          display: block;
          padding: 12px;
          color: $color-theme;
        }
      }
    }
    .search-box-wrapper {
      margin: 20px;
    }
    .shortcut {
      .list-wrapper {
        position: fixed;
        top: 165px;
        bottom: 0;
        width: 100%;
        overflow: hidden;
        .list-scroll-wrapper {
          height: 100%;
          overflow: hidden;
          .list-linner {
            padding: 20px 30px;
          }
        }
      }
    }
    .search-result {
      position: fixed;
      top: 124px;
      bottom: 0;
      width: 100%;
    }
    .tip-title {
      text-align: center;
      padding: 18px 0;
      font-size: 0;
      .icon-ok {
        font-size: $font-size-medium;
        color: $color-theme;
        margin-right: 4px;
      }
      .text {
        font-size: $font-size-medium;
        color: $color-text;
      }
    }
  }
</style>