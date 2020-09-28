import Vue from 'vue'
import vueRouter from 'vue-router'

// 引入路由模板
const Recommend = () => import('components/recommend/recommend')
const Rank = () => import('components/rank/rank')
const Search = () => import('components/search/search')
const Singer = () => import('components/singer/singer')
const SingerDetail = () => import('components/singer-detail/singer-detail')
const Disc = () => import('components/disc/disc')
const TopList = () => import('components/toplist/toplist')

Vue.use(vueRouter)

const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/recommend',
    component: Recommend,
    children: [{
      path: ':id',
      component: Disc
    }]
  },
  {
    path: '/singer',
    component: Singer,
    children: [{
      path: ':id',
      component: SingerDetail
    }]
  },
  {
    path: '/rank',
    component: Rank,
    children: [{
      path: ':id',
      component: TopList
    }]
  },
  {
    path: '/search',
    component: Search
  }
]

const router = new vueRouter({
  routes,
  mode: 'history'
})

export default router