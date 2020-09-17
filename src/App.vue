<template>
  <div id="app">
    <m-header></m-header>
    <tag/>
    <router-view></router-view>
  </div>
</template>

<script>
import MHeader from 'components/head/m-header'
import Tag from 'components/tag/tag'
export default {
  name: 'App',
  components: {
    MHeader,
    Tag
  }
}
</script>

<style lang="scss" scoped>
</style>
