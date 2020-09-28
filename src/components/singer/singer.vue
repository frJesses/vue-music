<template>
 <div class="singer" ref="singer">
   <list-view :list="singers" @select="selectSinger" ref="list"></list-view>
   <router-view></router-view>
 </div>
</template>

<script>
 import ListView from '../listview/listview'

 import { getSingerList } from 'api/singer'
 import { ERR_OK } from "api/config";
 import { mapMutations } from 'vuex'
 import { playMinix } from 'common/js/minix'

 export default {
   mixins: [playMinix],
   data () {
     return {
       singers: []
     }
   },
  created() {
    this._getSingerList()
  },
  methods: {
     // 处理迷你播放器展示后遮挡内容
    handlePlayList(playlist) {
      const bottom = playlist.length > 0 ? '60px' : 0
      this.$refs.singer.style.bottom = bottom
      this.$refs.list.refresh()
    },
     // 获取数据
    _getSingerList() {
     const hot = -100
     getSingerList(hot).then(res => {
      if(res.code === ERR_OK) {
       this.singers = res.singerList.data.singerlist
      }
     })
    },
    // 处理点击每个歌手函数
    selectSinger(item) {
      this.$router.push(`/singer/${item.singer_id}`)
      // 存储歌手信息到vuex中
      this.setSinger(item)
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  },
  components: {
     ListView
   }
 }
</script>

<style lang="scss" scoped>
  .singer {
    position: absolute;
    width: 100%;
    top: 88px;
    bottom: 0;
  }
</style>
