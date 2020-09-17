import Vue from 'vue'
import vueRouter from 'vue-router'

// 引入路由模板
const Recommend = () => import('components/recommend/recommend')
const Rank = () => import('components/rank/rank')
const Search = () => import('components/search/search')
const Singer = () => import('components/singer/singer')

Vue.use(vueRouter)

const routes = [
  { path: '/', redirect: '/recommend' },
  { path: '/recommend', component: Recommend },
  { path: '/singer', component: Singer },
  { path: '/rank', component: Rank },
  { path: '/search', component: Search }
]

const router = new vueRouter({
  routes,
  mode: 'history'
})

export default router