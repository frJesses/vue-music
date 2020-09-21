<template>
  <div id="app">
    <m-header></m-header>
    <tag/>
    <router-view></router-view>
    <player></player>
  </div>
</template>

<script>
import MHeader from 'components/head/m-header'
import Tag from 'components/tag/tag'
import Player from 'components/player/player'
export default {
  name: 'App',
  components: {
    MHeader,
    Tag,
    Player
  }
}
</script>

<style lang="scss" scoped>
</style>
