import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
})

// 路由重复跳转报错
const originalPush = router.push
router.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

// 路由白名单
const whiteList = ['/login']

router.beforeEach((to, from, next) => {
  NProgress.start()

  // 白名单直接放行
  if (whiteList.includes(to.path)) {
    NProgress.done()
    return next()
  }

  // 检查登录状态
  let token
  try {
    token = Vue.ls.get('access_token')
  } catch (error) {
    console.error('获取token失败:', error)
    NProgress.done()
    return next({ name: 'Login' })
  }

  if (!token) {
    NProgress.done()
    return next({ name: 'Login' })
  }

  NProgress.done()
  next()
})

export default router
