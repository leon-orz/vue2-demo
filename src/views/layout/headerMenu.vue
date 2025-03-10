<template>
  <div class="head-identifier flex flex-between align-center">
    <div class="flex align-center">
      <img src="@/assets/imgs/login/image1030.png" alt="logo" />
      <span>物流设备管理平台</span>
    </div>
    <div class="flex">
      <p>{{ dateTime }}</p>
      <p @click="outLog()" v-if="$route.name != 'Login'" style="margin-left: 10px">退出登录</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'headerMenu',
  data() {
    return {
      datetimer: null,
      dateTime: '',
    }
  },
  created() {
    this.dynamicDate()
  },
  methods: {
    // 动态更新时间显示
    dynamicDate() {
      this.datetimer = setInterval(() => {
        this.dateTime = new Date().toLocaleString()
      }, 1000)
    },

    // 退出登录处理
    outLog() {
      this.$store.dispatch('user/logout')
      this.$router.push({ path: '/' })
    },
  },
  beforeDestroy() {
    if (this.datetimer) {
      clearInterval(this.datetimer)
      this.datetimer = null
    }
  },
}
</script>

<style></style>
