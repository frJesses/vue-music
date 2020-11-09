<template>
  <transition name="list-fade">
    <div class="playlist" v-show="showTag" @click="hide">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon" :class="modeIcon" @click="changeMode"></i>
            <span class="text">{{modeText}}</span>
            <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
          </h1>
        </div>
        <Scroll :data="sequenceList"
                ref="listContent"
                class="list-content"
                :refreshDelay="refreshDelay"
        >
          <transition-group name="list" tag="ul">
            <li v-for="(item, index) in sequenceList"
                :key="index"
                class="item"
                @click="selectItem(index, item)"
                ref="listItem"
            >
              <i class="current" :class="getCurrentIcon(item)"></i>
              <span class="name">{{item.name}}</span>
              <span class="like">
                <i :class="getFavoriteIcon(item)" @click.stop="toggleIcon(item)"></i>
              </span>
              <span class="delete" @click.stop="deleteOne(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </Scroll>
        <div class="list-operate">
          <div class="add" @click.stop="addSong">
            <i class="icon-add"></i>
            <span class="add-text">添加歌曲到队列</span>
          </div>
        </div>
        <div class="list-close" @click.stop="hide">
          <span>关闭</span>
        </div>
      </div>
      <Confirm :text="'是否清空播放列表'"
               :confirmBtnText="'清空'"
               ref="confirm"
               @comfirm="clearAllSong"
      >
      </Confirm>
      <add-song ref="addSong"></add-song>
    </div>
  </transition>
</template>

<script>
  import Scroll from 'base/scroll/scroll'
  import Confirm from 'base/confirm/confirm'
  import AddSong from 'components/add-song/add-song'

  import { playMode } from 'common/js/config'
  import { mapActions } from 'vuex'
  import { playerMinix } from 'common/js/minix'

  export default {
    mixins: [playerMinix],
    data() {
      return {
        showTag: false,
        refreshDelay: 120
      }
    },
    computed: {
      modeText() {
        return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.loop ? '循环播放' :
          '随机播放'
      }
    },
    methods: {
      // 显示组件
      show() {
        this.showTag = true
        setTimeout(() => {
          this.$refs.listContent.refresh()
          this.scrollToCurrent(this.currentSong)
        }, 20)
      },
      // 关闭组件
      hide() {
        this.showTag = false
      },
      // 获取icon
      getCurrentIcon(item) {
        if (item.id === this.currentSong.id) {
          return 'icon-play'
        }
        return ""
      },
      // 点击歌曲进行播放
      selectItem(index, item) {
        if (this.mode === playMode.random) {
          index = this.playList.findIndex((song) => {
            return item.id === song.id
          })
        }
        this.setCurrentIndex(index)
        this.setPlaying(true)
      },
      // 播放的歌曲移动到第一的位置
      scrollToCurrent(current) {
        let index = this.sequenceList.findIndex(song => {
          return song.id === current.id
        })
        this.$refs.listContent.scrollToElement(this.$refs.listItem[index], 1000)
      },
      // 删除歌曲
      deleteOne(item) {
        this.deleteOneSong(item)
        if (!this.playList.length) {
          this.hide()
        }
      },
      // 显示confirm组件
      showConfirm() {
        this.$refs.confirm.show()
      },
      // 清除播放列表
      clearAllSong() {
        this.deleteAllSong()
        if (!this.playList.length) {
          this.hide()
        }
      },
      // 点击添加歌曲到播放列表
      addSong() {
        this.$refs.addSong.show()
      },
      ...mapActions([
        'deleteOneSong',
        'deleteAllSong'
      ])
    },
    components: {
      Scroll,
      Confirm,
      AddSong
    },
    watch: {
      currentSong(newSong, oldSong) {
        if (!this.showTag || newSong.id === oldSong.id) {
          return
        } else {
          setTimeout(() => {
            this.scrollToCurrent(newSong)
          }, 20)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "common/css/variable.scss";
  @import "common/css/mixin.scss";
  .playlist {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 999;
    &.list-fade-enter-active,
    &.list-fade-leave-active {
      transition: opacity .4s;
      .list-wrapper {
        transition: all .4s;
      }
    }
    &.list-fade-leave-to,
    &.list-fade-enter {
      opacity: 0;
      .list-wrapper {
        transform: translate3d(0, 100%, 0);
      }
    }
    .list-wrapper {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      background-color: $color-dialog-background;
      .list-header {
        position: relative;
        padding: 20px 30px 10px 20px;
        .title {
          display: flex;
          align-items: center;
          .icon {
            font-size: $font-size-large-mx;
            margin-right: 10px;
            color: $color-theme-d;
          }
          .text {
            flex: 1;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
          .clear {
            @include extend-click();
            .icon-clear {
              color: $color-theme-d;
              font-size: $font-size-medium;
            }
          }
        }
      }
      .list-content {
        max-height: 240px;
        overflow: hidden;
        .item {
          padding: 0 30px 0 20px;
          display: flex;
          height: 40px;
          overflow: hidden;
          align-items: center;
          &.list-enter-active,
          &.list-leave-active {
            transition: all 0.1s linear;
          }
          &.list-enter,
          &.list-leave-to {
            height: 0;
          }
          .current {
            flex: 0 0 20px;
            width: 20px;
            color: $color-theme-d;
            font-size: $font-size-small;
          }
          .name {
            flex: 1;
            @include no-wrap();
            font-size: $font-size-medium;
            color: $color-text-l;
          }
          .like,
          .delete {
            position: relative;
            font-size: $font-size-small;
            color: $color-text-l;
            margin-right: 15px;
          }
          .like {
            .icon-favorite {
              color: red;
            }
          }
          .delete {
            margin-right: 0;
          }
        }
      }
      .list-operate {
        width: 140px;
        margin: 20px auto 30px auto;
        .add {
          display: flex;
          padding: 8px 16px;
          border: 1px solid $color-text-l;
          border-radius: 100px;
          color: $color-text-l;
          .icon-add {
            font-size: $font-size-small-s;
            margin-right: 10px;
          }
          .add-text {
            font-size: $font-size-small;
          }
        }
      }
      .list-close {
        text-align: center;
        line-height: 50px;
        background: $color-highlight-background;
        font-size: $font-size-medium-x;
        span {
          color: $color-text-l;
        }
      }
    }
  }
</style>