<template>
  <Scroll class="suggest"
          ref="suggest"
          :data="result"
          :pullup="true"
          :probeType="2"
          @pullUp="scrollEnd"
  >
    <ul class="suggest-list">
      <li v-for="(item, index) in result"
          :key="index"
          class="suggest-item"
          @click="selectItem(item)"
      >
        <div class="icon">
          <i :class="getIcon(item)"></i>
        </div>
        <div class="name">
          <p v-html="getTxt(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore"></loading>
    </ul>
    <div class="no-result-wrapper" v-show="!hasMore && !result.length">
      <no-result :text="'抱歉，暂无搜索结果'"></no-result>
    </div>
  </Scroll>
</template>

<script>
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import NoResult from 'base/no-result/no-result'

  import { getSearch } from 'api/search'
  import { ERR_OK } from "api/config"
  import { createSong } from "common/js/singer"
  import { mapMutations, mapActions } from 'vuex'

  export default {
    props: {
      query: {
        type: String,
        default: ''
      },
      showSinger: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        page: 1,
        result: [],
        hasMore: true,
        searchMore: true
      }
    },
    methods: {
      // 发送搜索请求
      _getSearch() {
        this.hasMore = true
        this.searchMore = false
        getSearch(this.query, this.page, this.showSinger).then(res => {
          if (res.code === ERR_OK) {
            this.result = this.result.concat(this._getResult(res.data))
            this._checkMore(res.data)
          }
        })
      },
      // 滚动到底部后再发送请求，请求数据
      async scrollEnd() {
        if (!this.searchMore) {
          this.$refs.suggest.finishPullUp()
          return
        }
        this.page += 1
        this._getSearch()
        this.$refs.suggest.finishPullUp()
      },
      // 点击歌曲或者歌手
      selectItem(item) {
        if (item.type === 'singer') {
          let temp = {}
          temp.singer_id = item.singerid
          temp.singer_mid = item.singermid
          temp.singer_name = item.singername
          temp.singer_pic = `http://y.gtimg.cn/music/photo_new/T001R150x150M000${temp.singer_mid}.webp`
          // 跳转到歌手页面
          this.$router.push({
            path: `/search/${temp.singer_id}`
          })
          this.setSinger(temp)
        } else {
          this.insertSong(item)
        }
        this.$emit('select')
      },
      // 判断是歌手图标还是音乐图标
      getIcon(item) {
        return item.type === 'singer' ? 'icon-mine' : 'icon-music'
      },
      // 获取歌手和歌曲名
      getTxt(item) {
        return item.type === 'singer' ? item.singername : `${item.name} - ${item.singer}`
      },
      // 格式化数据
      _getResult(data) {
        let ret = []
        if (data.zhida && data.zhida.singerid) {
          ret.push({ ...data.zhida, ...{ type: 'singer' } })
        }
        if (data.song) {
          ret = ret.concat(this._normalize(data.song.list))
        }
        return ret
      },
      // 判断是否还有更多
      _checkMore(data) {
        const song = data.song
        if (!song.list.length || (song.curnum + song.curpage * 20) > song.totalnum) {
          this.hasMore = false
          this.searchMore = false
        } else {
          this.searchMore = true
        }
      },
      // 格式化歌曲数据
      _normalize(data) {
        let ret = []
        data.forEach(item => {
          ret.push(createSong(item))
        })
        return ret
      },
      // 刷新
      refresh() {
        this.$refs.suggest.refresh()
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      ...mapActions([
        'insertSong'
      ])
    },
    components: {
      Scroll,
      Loading,
      NoResult
    },
    watch: {
      query() {
        this.page = 1
        this.result = []
        this._getSearch()
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "common/css/variable.scss";
  @import "common/css/mixin.scss";
  .suggest {
    height: 100%;
    overflow: hidden;
    .suggest-list {
      padding: 0 30px;
      .suggest-item {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        .icon {
          flex: 0 0 30px;
          width: 30px;
          i {
            color: $color-text-d;
          }
        }
        .name {
          flex: 1;
          font-size: $font-size-medium;
          color: $color-text-d;
          overflow: hidden;
          p {
            @include no-wrap();
          }
        }
      }
    }
    .loading-wrapper {
      position: fixed;
      top: 60%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .no-result-wrapper {
      position: fixed;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
</style>