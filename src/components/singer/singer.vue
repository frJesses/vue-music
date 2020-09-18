<template>
 <div class="singer">
   <list-view :list="singers"></list-view>
 </div>
</template>

<script>
 import ListView from '../listview/listview'

 import { getSingerList } from 'api/singer'
 import { ERR_OK } from "api/config";

 export default {
   data () {
     return {
       singers: []
     }
   },
  created() {
    this._getSingerList()
  },
  methods: {
    _getSingerList() {
     const hot = -100
     getSingerList(hot).then(res => {
      if(res.code === ERR_OK) {
       this.singers = res.singerList.data.singerlist
      }
     })
    }
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
