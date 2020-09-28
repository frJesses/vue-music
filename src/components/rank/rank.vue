<template>
 <div class="rank" ref="rank">
   <Scroll class="topList" :data="toplist" ref="topList">
      <div>
        <ul>
          <li class="item"
              v-for="(item, index) in toplist"
              :key="index"
              @click="itemClick(item)"
          >
            <div class="icon">
              <img v-lazy="item.frontPicUrl" alt="">
            </div>
            <ul class="songlist">
              <li v-for="(song, currentIndex) in item.song"
                  :key="currentIndex"
                  class="song"
              >
                <span>{{currentIndex + 1}}</span>
                <span>{{song.title}}-{{song.singerName}}</span>
              </li>
            </ul>
          </li>
        </ul>
      </div>
   </Scroll>
   <router-view></router-view>
 </div>
</template>

<script>
  import Scroll from 'base/scroll/scroll'

  import { getRank } from 'api/rank'
  import { ERR_OK } from "api/config"
  import { mapMutations } from 'vuex'
  import { playMinix } from 'common/js/minix'

  export default {
    mixins: [playMinix],
   data () {
     return {
       toplist: []
     }
   },
   created() {
     this._getRank()
   },
   methods: {
     // 获取排行榜数据
     _getRank() {
      getRank().then(res => {
        if (res.code === ERR_OK) {
          this.toplist = this._normalize(res.data.group)
        }
      })
     },
     // 格式化数据
     _normalize(list) {
       let arr = []
       list.forEach(item => {
         let { toplist } = item
         arr = arr.concat(toplist)
       })
       return arr
     },
     // 点击每个li处理事件
     itemClick(item) {
       this.setTopList(item)
       this.$router.push({
         path: `/rank/${item.topId}`
       })
     },
     // 处理底部函数
     handlePlayList(playlist) {
       const bottom = playlist.length > 0 ? '60px' : 0
       this.$refs.rank.style.bottom = bottom
       this.$refs.topList.refresh()
     },
     ...mapMutations({
       setTopList: 'SET_TOPLIST'
     })
   },
   components: {
     Scroll
   }
 }
</script>

<style lang="scss" scoped>
  @import "common/css/variable.scss";
  @import "common/css/mixin.scss";
  .rank {
    position: fixed;
    top: 88px;
    left: 0;
    right: 0;
    bottom: 0;
    .topList {
      height: 100%;
      overflow: hidden;
      .item {
          height: 100px;
          display: flex;
          margin: 0 20px;
          padding-top: 20px;
          &:last-child {
            padding-bottom: 20px;
          }
          .icon {
            flex: 0 0 100px;
            img {
              width: 100%;
              height: 100%;
              display: block;
            }
          }
          .songlist {
            flex: 1;
            background: $color-background-d;
            color: $color-text-l;
            padding: 0 20px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            overflow: hidden;
            font-size: 12px;
            .song {
              @include no-wrap();
              line-height: 26px;
            }
          }
        }
    }
  }
</style>
