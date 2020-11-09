<template>
 <div class="search">
   <div class="search-box-wrapper">
     <search-box ref="searchBox" @query="onQueryChange"></search-box>
   </div>
   <div class="shortcut-wrapper" v-show="!query"  ref="shortcutWrapper">
      <Scroll class="shortcut"
              ref="shortcut"
              :refreshDelay="refreshDelay"
              :data="shortcut"
      >
        <div>
          <div class="hotkey">
              <h1>热门推荐</h1>
              <ul>
                <li v-for="(item, index) in hotkey"
                    :key="index"
                    class="item"
                    @click="selectQuery(item.k)"
                >
                  {{item.k}}
                </li>
              </ul>
            </div>
          <div class="history" v-show="searchHistory.length">
              <div class="title">
                搜索历史
                <span>
              <i class="icon-clear" @click="showConfirm"></i>
            </span>
              </div>
              <search-list :searches="searchHistory"
                           @delete="deleteSearchHistory"
                           @select="selectQuery"
              ></search-list>
            </div>
        </div>
      </Scroll>
   </div>
   <div class="search-result" v-show="query" ref="searchResult">
     <suggest @select="saveHistory" :query="query" ref="suggest"></suggest>
   </div>
   <confirm ref="confirm"
            :text="'是否要清空所有的搜索历史'"
            :confirmBtnText="'清空'"
            @comfirm="clearAllSearchHistory"
   ></confirm>
   <router-view></router-view>
 </div>
</template>

<script>
  import SearchBox from 'base/search-box/search-box'
  import Suggest from 'components/suggest/suggest'
  import SearchList from 'base/search-list/search-list'
  import Scroll from 'base/scroll/scroll'
  import Confirm from 'base/confirm/confirm'

  import { ERR_OK } from "api/config";
  import { getHotSearch } from 'api/search'
  import { mapActions, mapGetters } from 'vuex'
  import { playMinix, searchMinix } from 'common/js/minix'
  export default {
    mixins: [playMinix, searchMinix],
   data () {
     return {
        hotkey: []
     }
   },
    created() {
     this._getHotSearch()
    },
    computed: {
      shortcut() {
        return this.hotkey.concat(this.searchHistory)
      }
    },
    methods: {
      // 调整下边位置
      handlePlayList(playlist) {
        let bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.shortcutWrapper.style.bottom = bottom
        this.$refs.shortcut.refresh()

        this.$refs.searchResult.style.bottom = bottom
        this.$refs.suggest.refresh()
      },
      // 显示confirm组件
      showConfirm() {
        this.$refs.confirm.show()
      },
      // 获取每日热门搜索数据
      _getHotSearch() {
        getHotSearch().then(res => {
          if (res.code === ERR_OK) {
            this.hotkey = res.data.hotkey.slice(0, 10)
          }
        })
      },
      ...mapActions([
        'saveSearchHistory',
        'deleteSearchHistory',
        'clearAllSearchHistory'
      ])
    },
    components: {
      SearchBox,
      Suggest,
      SearchList,
      Scroll,
      Confirm
   },
    watch: {
      query(newQuery) {
        if (!newQuery) {
          setTimeout(() => {
            this.$refs.shortcut.refresh()
          }, 20)
        }
      }
    }
 }
</script>

<style scoped lang="scss">
  @import "common/css/variable.scss";
  .search {
    .search-box-wrapper {
      margin: 20px;
    }
    .shortcut-wrapper {
      position: fixed;
      top: 178px;
      bottom: 0;
      left: 0;
      right: 0;
      .shortcut {
        height: 100%;
        overflow: hidden;
        .hotkey {
          margin: 0 20px 20px 20px;
          h1 {
            font-size: 14px;
            color: $color-theme;
            margin-bottom: 20px;
          }
          .item {
            display: inline-block;
            margin: 0 15px 15px 0;
            padding: 5px 10px;
            background: $color-highlight-background;
            border-radius: 5px;
            color: $color-text-d;
            font-size: $font-size-medium;
          }
        }
        .history {
          padding: 0 20px 20px 20px;
          .title {
            font-size: 14px;
            color: $color-theme;
            margin-bottom: 20px;
            position: relative;
            span {
              position: absolute;
              right: 0;
              top: 0;
            }
          }
        }
      }

    }
    .search-result {
      position: fixed;
      top: 178px;
      bottom: 0;
      left: 0;
      right: 0;
    }
  }

</style>
