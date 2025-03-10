import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

//跳转加载条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
NProgress.configure({ ease: 'ease', speed: 500 })

Vue.use(VueRouter)

let autoRouters = []
let pages = require.context('./routes', false, /\.routes\.js/)
pages.keys().forEach((key) => {
  if (pages(key).default) autoRouters.push(pages(key).default)
})
autoRouters.sort(function (a, b) {
  let as = a.sort || 0
  let bs = b.sort || 0
  return bs - as
})

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Login',
      component: () => import('../views/login.vue'),
    },
    {
      path: '/error401',
      name: 'Error401',
      component: () => import('../views/error401/index.vue'),
    },
    ...autoRouters,
  ],
})

//路由重复跳转报错
const originalPush = router.push
router.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}
//路由守卫
// no redirect whitelist
const whiteList = ['/', '/error401', '/error404']
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (whiteList.includes(to.path)) {
    next()
  } else {
    if (store.state.user.token) {
      next()
    } else {
      next({ path: '/' })
    }
  }
  NProgress.done()
})
export default router
