import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('../views/login/index.vue'),
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

const whiteList = ['Login']

router.beforeEach((to, from, next) => {
  const isAuthenticated = router.app.$store.getters.isLogged

  if (whiteList.includes(to.name)) {
    return next()
  }

  if (!isAuthenticated) {
    next({ name: 'Login' })
  } else {
    next()
  }
})

export default router
